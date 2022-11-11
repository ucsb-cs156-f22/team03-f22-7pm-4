import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemEditPage from "main/pages/MenuItem/MenuItemEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBDiningCommonsMenuItem", { params: { id: 1 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await waitFor(() => expect(getByText("Edit Menu Item")).toBeInTheDocument());
            expect(queryByTestId("MenuItemForm-diningCommonsCode")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBDiningCommonsMenuItem", { params: { id: 1 } }).reply(200, {
                id: 1,
                diningCommonsCode: '20221',
                name: "Pi Day",
                station: "2022-03-14T15:00"
            });
            axiosMock.onPut('/api/UCSBDiningCommonsMenuItem').reply(200, {
                id: "1",
                diningCommonsCode: '20224',
                name: "Christmas Morning",
                station: "2022-12-25T08:00"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("MenuItemForm-diningCommonsCode")).toBeInTheDocument());

            const idField = getByTestId("MenuItemForm-id");
            const quarterYYYYQField = getByTestId("MenuItemForm-diningCommonsCode");
            const nameField = getByTestId("MenuItemForm-name");
            const localDateTimeField = getByTestId("MenuItemForm-station");

            expect(idField).toHaveValue("1");
            expect(quarterYYYYQField).toHaveValue("20221");
            expect(nameField).toHaveValue("Pi Day");
            expect(localDateTimeField).toHaveValue("2022-03-14T15:00");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("MenuItemForm-diningCommonsCode")).toBeInTheDocument());

            const idField = getByTestId("MenuItemForm-id");
            const quarterYYYYQField = getByTestId("MenuItemForm-diningCommonsCode");
            const nameField = getByTestId("MenuItemForm-name");
            const localDateTimeField = getByTestId("MenuItemForm-station");
            const submitButton = getByTestId("MenuItemForm-submit");

            expect(idField).toHaveValue("1");
            expect(quarterYYYYQField).toHaveValue("20221");
            expect(nameField).toHaveValue("Pi Day");
            expect(localDateTimeField).toHaveValue("2022-03-14T15:00");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(quarterYYYYQField, { target: { value: '20224' } })
            fireEvent.change(nameField, { target: { value: 'Christmas Morning' } })
            fireEvent.change(localDateTimeField, { target: { value: "2022-12-25T08:00" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Menu Item Updated - id: 1 name: Christmas Morning");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuItem/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                diningCommonsCode: '20224',
                name: "Christmas Morning",
                station: "2022-12-25T08:00"
            })); // posted object

        });

       
    });
});


