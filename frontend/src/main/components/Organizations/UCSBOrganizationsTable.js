import OurTable from "main/components/OurTable";
// import { useBackendMutation } from "main/utils/useBackend"; 
// import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBDateUtils"
// import { useNavigate } from "react-router-dom";
// import { hasRole } from "main/utils/currentUser";

export default function UCSBOrganizationsTable({ organizations, _currentUser }) {

    // const navigate = useNavigate();

    // const editCallback = (cell) => {
    //     navigate(`/ucsbdates/edit/${cell.row.values.id}`)
    // }

    // Stryker disable all : hard to test for query caching
    // const deleteMutation = useBackendMutation(
    //     cellToAxiosParamsDelete,
    //     { onSuccess: onDeleteSuccess },
    //     ["/api/ucsbdates/all"]
    // );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    // const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    // {
    //     "orgCode": "ZPR",
    //     "orgTranslationShort": "ZETA PHI RHO",
    //     "orgTranslation": "ZETA PHI RHO",
    //     "inactive": false
    // }

    const columns = [
        {
            Header: 'Organization Code/Acronym',
            accessor: 'orgCode',
        },
        {
            Header: 'Short Organization Translation',
            accessor: 'orgTranslationShort',
        },
        {
            Header: 'Full Organization Translation',
            accessor: 'orgTranslation',
        },
        {
            Header: 'Inactive?',
            accessor: 'inactive',
        }
    ];

    // const columnsIfAdmin = [
    //     ...columns,
    //     ButtonColumn("Edit", "primary", editCallback, "UCSBDatesTable"),
    //     ButtonColumn("Delete", "danger", deleteCallback, "UCSBDatesTable")
    // ];

    // const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;
    const columnsToDisplay = columns;

    return <OurTable
        data={organizations}
        columns={columnsToDisplay}
        testid={"UCSBOrganizationsTable"}
    />;
};