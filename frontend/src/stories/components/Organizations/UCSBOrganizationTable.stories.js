import React from 'react';
import UCSBOrganizationsTable from 'main/components/Organizations/UCSBOrganizationsTable';
import { ucsbOrganizationFixtures } from 'fixtures/ucsbOrganizationFixtures';

export default{
    title: 'components/Organizations/UCSBOrganizationTable',
    component: UCSBOrganizationsTable
};

const Template = (args) => {
    return(
        <UCSBOrganizationsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    ucsbOrganizations: []
};

export const ThreeOrganizations = Template.bind({});

ThreeOrganizations.args = {
    ucsbOrganizations: ucsbOrganizationFixtures.threeOrganizations
};