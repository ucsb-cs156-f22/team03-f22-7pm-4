import { render } from "@testing-library/react";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import UCSBOrganizationsTable from "main/components/Organizations/UCSBOrganizationsTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationTable tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing for empty table with user not logged in", () => {
        const currentUser = null;
    
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <UCSBOrganizationsTable organizations={[]} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
    
        );
    }); 

    test("renders without crashing for empty table for ordinary user", () => {
        const currentUser = currentUserFixtures.userOnly;
      
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <UCSBOrganizationsTable organizations={[]} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
      
        );
     
    });

    test("renders without crashing for empty table for admin", () => {
        const currentUser = currentUserFixtures.adminUser;
      
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <UCSBOrganizationsTable organizations={[]} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
      
        );
     
    });

    test("Has the expected column headers and content for adminUser", () => {

        const currentUser = currentUserFixtures.adminUser;
    
        const { getByText, getByTestId } = render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <UCSBOrganizationsTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
    
    );

    const expectedHeaders = ['Organization Code/Acronym', 'Short Organization Translation', 'Full Organization Translation', 'Inactive?'];
    const expectedFields = ['orgCode', 'orgTranslationShort','orgTranslation', 'inactive'];
    const testId = "UCSBOrganizationsTable";

    expectedHeaders.forEach((headerText) => {
        const header = getByText(headerText);
        expect(header).toBeInTheDocument();
    });
    
      expectedFields.forEach((field) => {
        const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
    });

   expect(getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("test2");
   expect(getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("test3");
   expect(getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent("org2Short");
   expect(getByTestId(`${testId}-cell-row-1-col-orgTranslationShort`)).toHaveTextContent("org3Short");
   
   const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
   expect(deleteButton).toBeInTheDocument();
   expect(deleteButton).toHaveClass("btn-danger");
 });
});
