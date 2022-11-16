import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { _useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/RecommendationsUtils"

export default function RecommendationsTable({ recommendations, currentUser }) {

    // const navigate = useNavigate();

    // const editCallback = (cell) => {
    //     navigate(`/ucsbdates/edit/${cell.row.values.id}`)
    // }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/Recommendation/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Date Needed',
            accessor: 'dateNeeded',
        },
        {
            Header: 'Date Requested',
            accessor: 'dateRequested',
        },
        {
            Header: 'Done?',
            id: 'done',
            accessor: (row, _rowIndex) => String(row.done) // hack needed for boolean values to show up
        },
        {
            Header: 'Explanation',
            accessor: 'explanation',
        },
        {
            Header: 'Professor\'s Email',
            accessor: 'professorEmail',
        },
        {
            Header: 'Requester\'s Email',
            accessor: 'requesterEmail',
        },
    ];

    const columnsIfAdmin = [
        ...columns,
        // ButtonColumn("Edit", "primary", editCallback, "RecommendationsTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "RecommendationsTable")
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={recommendations}
        columns={columnsToDisplay}
        testid={"RecommendationsTable"}
    />;
};