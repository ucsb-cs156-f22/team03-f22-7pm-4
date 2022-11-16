import React from 'react';

import RecommendationsTable from "main/components/Recommendations/RecommendationsTable";
import { recommendationsFixtures } from 'fixtures/recommendationsFixtures';

export default {
    title: 'components/Recommendations/RecommendationTable',
    component: RecommendationsTable
};

const Template = (args) => {
    return (
        <RecommendationsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    recommendations: []
};

export const ThreeDates = Template.bind({});

ThreeDates.args = {
    recommendations: recommendationsFixtures.threeRecommendations
};