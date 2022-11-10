import React from 'react'
import { useBackend } from 'main/utils/useBackend'; // use prefix indicates a React Hook

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import ReviewTable from 'main/components/Review/ReviewTable';
import { useCurrentUser } from 'main/utils/currentUser' // use prefix indicates a React Hook

export default function ReviewIndexPage() {

  const currentUser = useCurrentUser();

//   const { data: dates, error: _error, status: _status } =
//     useBackend(
//       // Stryker disable next-line all : don't test internal caching of React Query
//       ["/api/ucsbdates/all"],
//             // Stryker disable next-line StringLiteral,ObjectLiteral : since "GET" is default, "" is an equivalent mutation
//             { method: "GET", url: "/api/ucsbdates/all" },
//       []
//     );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Review</h1>
        {/* <UCSBDatesTable dates={dates} currentUser={currentUser} /> */}
      </div>
    </BasicLayout>
  )
}