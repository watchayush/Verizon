import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// TEMP:
import styled from 'styled-components';
import Input from './components/atoms/input';
import Typography from './components/atoms/typography';
import Button from './components/atoms/button';

// Main route component
import Routes from './routes';

import Loader from './components/atoms/loader';
import AuthLoading from './pages/loading/authLoading';

// Authentication CustomHooks
import useAuthentication from './hooks/authentication';

// Services
import { authenticated, getSessionHasValid } from './services/auth/authSelector';
import { fetchFunctionsAsync } from './services/functions/functionsSlice';
import { getUserInfo } from './services/user/userSelector';

import './app.css';

// Making all necessary api calls once application authenticated
export const InitApplication = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);

  useEffect(() => {
    if (userInfo.status === 'idle' && userInfo?.data?.wfmUserDto) {
      dispatch(fetchFunctionsAsync());
    }
  }, [userInfo, dispatch]);

  return <></>;
};

// TEMP:
const Wrapper = styled.div`
  display: flex;
  margin-top: 20px;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  & > button {
    margin-top: 10px;
  }

  & > h1 {
    margin-bottom: 10px;
  }
`;

// TEMP:
const LoginComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (value) {
      localStorage.setItem('userId', value);
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
    return <App />;
  }

  return (
    <Wrapper>
      <Typography primitive="h1" size="medium" text="Login to WFM-WebForm" title />
      <div>
        <Input label="User ID (VzId)" name="userId" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <Button className="mr-20" onClick={handleSubmit} type="submit">
        Submit
      </Button>
    </Wrapper>
  );
};

function App() {
  // make authentication call and setUser details
  const { loading, error } = useAuthentication();
  const isAuthenticated = useSelector(authenticated);
  const isSessionValid = useSelector(getSessionHasValid);

  if (loading) {
    return <Loader active />;
  }

  if (error || !isSessionValid) {
    return <AuthLoading data-testId="authLoading" inValidSession={!isSessionValid} />;
  }

  if (isAuthenticated) {
    return <Routes />;
  }

  return <div> need to check why it came here </div>;
}

export default LoginComponent;