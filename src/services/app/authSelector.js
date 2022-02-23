import { createSelector } from 'reselect';

/**
 * Selector function to return authentication state
 * @return {string}  true if access token  is present else auth.state
 */
export const selectAuth = createSelector(
  (state) => {
    return state.auth;
  },
  (auth) => auth,
);

/**
 * Selector function to return is user is Authenticated
 * @return {boolean} returns TRUE if Access Token and user data are present and not expired
 */
export const authenticated = createSelector(
  [(state) => state.auth, (state) => state.user],
  (auth, user) => auth?.data?.hasValidTokens && user?.data?.wfmUserDto?.userId?.length > 0,
);

/**
 * Selector function to return JWT Access Token from Redux state
 * @return {string} JWT accessToken
 */
export const getAccessToken = createSelector(
  (state) => state.auth.data,
  (data) => (data?.hasValidTokens === true ? localStorage.getItem('token') : null),
);

/**
 * Selector function to return is user is Authenticated
 * @return {boolean} returns TRUE if Access Token and user data are present and not expired
 */
export const showSessionTimeAlert = createSelector(
  (state) => state.auth,
  (auth) => auth?.data?.showSessionTimeAlert,
);

export const getSessionHasValid = createSelector(
  (state) => state.auth,
  (auth) => auth?.data?.isSessionValid,
);