import React from 'react';

import HelpRequestsTable from 'main/components/HelpRequests/HelpRequestsTable';
import { helpRequestsFixtures } from 'fixtures/helpRequestsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/HelpRequests/HelpRequestsTable',
    component: HelpRequestsTable,
};

const Template = (args) => {
    return (
        <HelpRequestsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    helpRequests: []
};

export const ThreeRequests = Template.bind({});

ThreeRequests.args = {
    helpRequests: helpRequestsFixtures.threeRequests
};

export const ThreeRequestsAsAdmin = Template.bind({});

ThreeRequestsAsAdmin.args = {
    helpRequests: helpRequestsFixtures.threeRequests,
    currentUser: currentUserFixtures.adminUser
};
