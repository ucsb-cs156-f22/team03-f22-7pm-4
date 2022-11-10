import OurTable, { ButtonColumn} from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";


export default function HelpRequestsTable({ helpRequests, currentUser }) {

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
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={helpRequests}
        columns={columnsToDisplay}
        testid={"HelpRequestsTable"}
    />;
};
