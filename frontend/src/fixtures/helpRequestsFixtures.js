const helpRequestsFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requesterEmail": "ldelplaya@ucsb.edu",
        "teamId": "f22-7pm-4",
        "tableOrBreakoutRoom": "7",
        "requestTime": "2022-04-20T17:35:00",
        "explanation": "Need help with lab03",
        "solved": false,

    },
    threeRequests: [
        {
            "id": 1,
            "requesterEmail": "agaucho@ucsb.edu",
            "teamId": "s22-5pm-4",
            "tableOrBreakoutRoom": "5",
            "requestTime": "2022-01-03T00:00:00",
            "explanation": "Need help with mutation testing",
            "solved": false,
        },
        {
            "id": 2,
            "requesterEmail": "bgaucho@ucsb.edu",
            "teamId": "f22-6pm-4",
            "tableOrBreakoutRoom": "6",
            "requestTime": "2022-03-11T00:00:00",
            "explanation": "Need help with code coverage",
            "solved": false,
        },
        {
            "id": 3,
            "requesterEmail": "cgaucho@ucsb.edu",
            "teamId": "f22-7pm-4",
            "tableOrBreakoutRoom": "7",
            "requestTime": "2022-02-03T00:00:00",
            "explanation": "Need help with deployment",
            "solved": true,
        } 
    ]
};


export { helpRequestsFixtures };
