import React from 'react';

import MenuItemForm from 'main/components/MenuItem/MenuItemForm';
import { menuItemFixtures } from 'fixtures/menuItemFixtures';

export default {
    title: 'components/MenuItems/MenuItemForm',
    component: MenuItemForm
};


const Template = (args) => {
    return (
        <MenuItemForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    buttonLabel: "Create",
    submitAction: (data) => { console.log('Create was clicked, parameter to submitAction=',data); }
};

export const Show = Template.bind({});

Show.args = {
    initialMenuItem: menuItemFixtures.oneMenuItem,
    buttonLabel: "Update",
    submitAction: (data) => { console.log('Update was clicked, parameter to submitAction=',data); }
};
