import { render, waitFor, fireEvent } from "@testing-library/react";
import MenuItemCreatePage from "main/pages/MenuItem/MenuItemCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});


describe("MenuItemCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();

        const commons = {
            id: 1,
            "diningCommonsCode": "ortega",
            "name": "Ortega",
            "station": "veggie",
          };
        
    
        axiosMock.onPost("/api/UCSBDiningCommonsMenuItem/post").reply( 202, commons );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("MenuItemForm-diningCommonsCode")).toBeInTheDocument();
        });

        const diningCommonsCodeField = getByTestId("MenuItemForm-diningCommonsCode");
        const nameField = getByTestId("MenuItemForm-name");
        const stationField = getByTestId("MenuItemForm-station");
        const submitButton = getByTestId("MenuItemForm-submit");


        fireEvent.change(diningCommonsCodeField, { target: { value: 'ortega' } });
        fireEvent.change(nameField, { target: { value: 'Ortega' } });
        fireEvent.change(stationField, { target: { value: 'veggie' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            "diningCommonsCode": "ortega",
            "name": "Ortega",
            "station": 'veggie'
        });

        expect(mockToast).toBeCalledWith("New Menu Item Created - id: 1 name: Ortega");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuItem/list" });
    });


});


