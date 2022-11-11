import React from 'react';

import MenuItemTable from 'main/components/MenuItem/MenuItemTable';
import { menuItemFixtures } from 'fixtures/menuItemFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/MenuItems/MenuItemTable',
    component: MenuItemTable
};

const Template = (args) => {
    return (
        <MenuItemTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    menuItem: []
};

export const ThreeDates = Template.bind({});

ThreeDates.args = {
    menuItem: menuItemFixtures.threeMenuItems
};

export const ThreeDatesAsAdmin = Template.bind({});

ThreeDatesAsAdmin.args = {
    menuItem: menuItemFixtures.threeMenuItems,
    currentUser: currentUserFixtures.adminUser
}

