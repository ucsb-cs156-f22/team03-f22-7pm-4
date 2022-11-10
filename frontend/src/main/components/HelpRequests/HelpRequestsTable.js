import OurTable, { ButtonColumn} from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";


export default function HelpRequestsTable({ helpRequests, currentUser }) {

    // const navigate = useNavigate();

    // const editCallback = (cell) => {
    //     navigate(`/helpRequest/edit/${cell.row.values.id}`)
    // }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/helprequest/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/helpRequests/edit/${cell.row.values.id}`)
    }

    const columns = [
        {
            Header: 'ID',
            accessor: 'id', 
        },
        {
            Header: 'Requester Email',
            accessor: 'requesterEmail',
        },
        {
            Header: "Team ID",
            accessor: "teamId",
        },
        {
            Header: "Table or breakout room",
            accessor: "tableOrBreakoutRoom",
        },
        {
            Header: 'Request Time',
            accessor: 'requestTime',
        },
        {
            Header: "Explanation",
            accessor: "explanation",
        },
        {
            Header: 'Solved?',
            id: 'solved', 
            accessor: (row, _rowIndex) => String(row.solved) 
        }
    ];


    const columnsIfAdmin = [
        ...columns,
        ButtonColumn("Edit", "primary", editCallback, "HelpRequestsTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "HelpRequestsTable")
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={helpRequests}
        columns={columnsToDisplay}
        testid={"HelpRequestsTable"}
    />;
};