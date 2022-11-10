import { _fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationsIndexPage from "main/pages/Recommendations/RecommendationsIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { recommendationsFixtures } from "fixtures/recommendationsFixtures";
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

describe("RecommendationIndexPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "RecommendationsTable";

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
        axiosMock.onGet("/api/Recommendation/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/Recommendation/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

    });

    test("renders three recommendations without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/Recommendation/all").reply(200, recommendationsFixtures.threeRecommendations);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(  () => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("0"); } );
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("1");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("2");

    });

    test("renders three diningCommons without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/Recommendation/all").reply(200, recommendationsFixtures.threeRecommendations);
    
        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    
        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("0"); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("1");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("2");
    
    });
    
    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();
    
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/Recommendation/all").timeout();
    
        const { queryByTestId, getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(3); });
    
        const expectedHeaders = ['id','Date Needed','Date Requested','Done?','Explanation','Professor\'s Email','Requester\'s Email'];
    
        expectedHeaders.forEach((headerText) => {
          const header = getByText(headerText);
          expect(header).toBeInTheDocument();
        });
    
        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });
});