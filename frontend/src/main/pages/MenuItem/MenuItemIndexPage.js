import React from 'react'
import { useBackend } from 'main/utils/useBackend'; // use prefix indicates a React Hook

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemTable from 'main/components/MenuItem/MenuItemTable';
import { useCurrentUser } from 'main/utils/currentUser' // use prefix indicates a React Hook

export default function MenuItemIndexPage() {

  const currentUser = useCurrentUser();

  const { data: menuItem, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/UCSBDiningCommonsMenuItem/all"],
            // Stryker disable next-line StringLiteral,ObjectLiteral : since "GET" is default, "" is an equivalent mutation
            { method: "GET", url: "/api/UCSBDiningCommonsMenuItem/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>UCSB Dining Commons Menu Item</h1>
        <MenuItemTable menuItem={menuItem} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}