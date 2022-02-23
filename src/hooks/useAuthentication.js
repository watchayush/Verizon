import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import isNull from 'lodash/isNull';

//service
import { fetchAuth } from '../services/auth/authSlice';
import { fetchUserAsync } from '../services/user/userSlice';
import { fetchRoutingDetailsAsync } from '../services/routing/routingSlice';

//Selectors
import { getUserInfo } from '../services/user/userSelector';
import { selectAuth, authenticated } from '../services/auth/authSelector';
import { getRoutingDetails } from '../services/routing/routingSelector';

function useAuthentication() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const auth = useSelector(selectAuth);
  const isAuthenticated = useSelector(authenticated);
  const user = useSelector(getUserInfo);
  const routingDetails = useSelector(getRoutingDetails);

  const isRouteFetched = useRef(false);

  useEffect(() => {
    if (auth.status !== 'error') {
      dispatch(fetchAuth());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (auth.status === 'idle' && auth?.data?.hasValidTokens) {
      dispatch(fetchUserAsync());
    }
    if (auth.status === 'error') {
      setLoading(false);
      setError(auth.error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useEffect(() => {
    if (user.status === 'idle' && user?.data?.wfmUserDto?.userId?.length > 0 && !isRouteFetched.current) {
      dispatch(fetchRoutingDetailsAsync(dispatch));
      isRouteFetched.current = true;
    }
    if (user.status === 'error') {
      setLoading(false);
      setError(user.error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!isNull(routingDetails)) {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routingDetails]);

  return { loading, isAuthenticated, error };
}

export default useAuthentication;