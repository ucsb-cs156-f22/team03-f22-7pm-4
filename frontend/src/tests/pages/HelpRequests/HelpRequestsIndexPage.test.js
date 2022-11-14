import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestsIndexPage from "main/pages/HelpRequests/HelpRequestsIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { helpRequestsFixtures } from "fixtures/helpRequestsFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import _mockConsole from "jest-mock-console";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("HelpRequestsIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "HelpRequestsTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/HelpRequest/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/HelpRequest/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders three helpRequests without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/HelpRequest/all").reply(200, helpRequestsFixtures.threeRequests);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(1); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(2);
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(3);
        expect(getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Need help with mutation testing");
        expect(getByTestId(`${testId}-cell-row-1-col-teamId`)).toHaveTextContent("f22-6pm-4");
        expect(getByTestId(`${testId}-cell-row-1-col-solved`)).toHaveTextContent("false");

    });

    test("renders three helpRequests without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/HelpRequest/all").reply(200, helpRequestsFixtures.threeRequests);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(1); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(2);
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(3);
        expect(getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Need help with mutation testing");
        expect(getByTestId(`${testId}-cell-row-1-col-teamId`)).toHaveTextContent("f22-6pm-4");
        expect(getByTestId(`${testId}-cell-row-1-col-solved`)).toHaveTextContent("false");

    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/HelpRequest/all").timeout();

        const { queryByTestId, getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(3); });

        const expectedHeaders = ['ID', 'Requester Email', 'Team ID', 'Table or breakout room', 'Explanation', 'Solved?', 'Request Time'];

        expectedHeaders.forEach((headerText) => {
            const header = getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("test what happens when you click delete, admin", async () => {
        setupAdminUser();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/HelpRequest/all").reply(200, helpRequestsFixtures.threeRequests);
        axiosMock.onDelete("/api/HelpRequest", { params: { id: 1 } }).reply(200, "HelpRequest with id 1 was deleted");


        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(1);


        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("HelpRequest with id 1 was deleted") });

    });


});


