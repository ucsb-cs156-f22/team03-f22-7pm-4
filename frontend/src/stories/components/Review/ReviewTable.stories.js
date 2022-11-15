import React from 'react';

import ReviewTable from "main/components/Review/ReviewTable";
import { reviewFixtures } from 'fixtures/reviewFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/Review/ReviewTable',
    component: ReviewTable
};

const Template = (args) => {
    return (
        <ReviewTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    review: []
};

export const ThreeReviews = Template.bind({});

ThreeReviews.args = {
    review: reviewFixtures.threeReview
};

export const ThreeReviewsAsAdmin = Template.bind({});

ThreeReviewsAsAdmin.args = {
    review: reviewFixtures.threeReview,
    currentUser: currentUserFixtures.adminUser
};

