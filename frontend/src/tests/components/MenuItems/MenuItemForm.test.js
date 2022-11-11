import { render, waitFor, fireEvent } from "@testing-library/react";
import MenuItemForm from "main/components/MenuItem/MenuItemForm";
import { menuItemFixtures } from "fixtures/menuItemFixtures"
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("MenuItemForm tests", () => {

    test("renders correctly ", async () => {

        const { getByText } = render(
            <Router  >
                <MenuItemForm />
            </Router>
        );
        await waitFor(() => expect(getByText(/Dining Commons Code/)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
    });


    test("renders correctly when passing in a MenuItem ", async () => {

        const { getByText, getByTestId } = render(
            <Router  >
                <MenuItemForm initialMenuItem={menuItemFixtures.oneMenuItem}  buttonLabel={"Update"} />
            </Router>
        );
        await waitFor(() => expect(getByTestId(/MenuItemForm-id/)).toBeInTheDocument());
        expect(getByText(/Id/)).toBeInTheDocument();
        await waitFor( () => expect(getByTestId(/MenuItemForm-id/)).toHaveValue("1") );
    });


    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <MenuItemForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("MenuItemForm-submit")).toBeInTheDocument());
        const submitButton = getByTestId("MenuItemForm-submit");

        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/Dining Commons Code is required./)).toBeInTheDocument());
        expect(getByText(/Name is required./)).toBeInTheDocument();
        expect(getByText(/Station is required./)).toBeInTheDocument();

    });


    test("Test that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId } = render(
            <Router  >
                <MenuItemForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("MenuItemForm-cancel")).toBeInTheDocument());
        const cancelButton = getByTestId("MenuItemForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


