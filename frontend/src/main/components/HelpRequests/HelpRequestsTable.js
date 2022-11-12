import OurTable from "main/components/OurTable";

export default function HelpRequestsTable({ helpRequests, _currentUser }) {

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
            accessor: (row, rowIndex) => String(row.solved) 
        }
    ];

    return <OurTable
        data={helpRequests}
        columns={columns}
        testid={"HelpRequestsTable"}
    />;
};
