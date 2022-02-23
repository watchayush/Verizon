import { createSelector } from 'reselect';

export const getRoutingDetails = createSelector(
  (state) => state.routingDetails,
  (routingDetails) => {
    let isPSF = false;
    if (routingDetails?.data?.routingPageName === null) {
      return null;
    }
    if (routingDetails?.data?.routingPageName === 'subscribe') {
      isPSF = true;
    }
    return isPSF;
  },
);