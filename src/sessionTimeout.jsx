import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import TimerComponent from '../../molecules/timer';
import { fetchAccessTokenUsingRefreshToken } from '../../../services/auth/authAPI';
import { onSessionExpire } from '../../../services/auth/authSlice';
import { addModal, removeAllModal } from '../../../services/modal/modalSlice';

import { Redirect } from 'react-router';

import IdleTimer from './idleTimer';

const idleTimer = new IdleTimer();

const REFRESH_TIMER = 28 * 60 * 1000;
const IDLE_TIMER = 2 * 60 * 1000;

const SessionTimeout = () => {
  const dispatch = useDispatch();
  const isSessionValid = useSelector((state) => state?.auth?.data?.isSessionValid);
  const [resetTimer, setResetTimer] = useState(false);

  let timer = useRef(null);

  const closeHandler = () => {
    dispatch(onSessionExpire());
    localStorage.setItem('destroyAllSessionModal', true);
  };

  const onContinue = () => {
    setResetTimer(true);
    fetchAccessTokenUsingRefreshToken();
    localStorage.setItem('destroyAllSessionModal', true);
  };

  const showSessionModal = () => {
    const payload = {
      title: 'Authentication',
      subType: 'Authentication',
      body: '',
      children: (
        <div>
          Session will expire in <TimerComponent timeSeconds={120} callback={closeHandler} />
        </div>
      ),
      actions: [
        { title: 'Continue', type: 'primary', handlerFunction: onContinue },
        { title: 'Cancel', type: 'secondary', handlerFunction: closeHandler },
      ],
      additionalModalProps: { hideCloseButton: true, disableOutsideClick: true },
    };
    dispatch(addModal(payload));
    localStorage.setItem('destroyAllSessionModal', false);
  };

  const startTimer = () => {
    timer.current = setTimeout(() => {
      const _lastActivityTime = localStorage.getItem('_lastActivityTime') || 0;

      const timeDifference = Date.now() - parseInt(_lastActivityTime, 10);
      if (timeDifference > IDLE_TIMER) {
        showSessionModal();
      } else {
        setResetTimer(true);
        fetchAccessTokenUsingRefreshToken();
      }
    }, REFRESH_TIMER);
  };

  useEffect(() => {
    window.addEventListener('storage', function (event) {
      if (event?.key === 'refreshToken') {
        if (!resetTimer) {
          setResetTimer(true);
        }
        if (event.newValue === null) {
          dispatch(onSessionExpire());
        }
      }
      if (event?.key === 'destroyAllSessionModal') {
        const destroySessionModal = localStorage.getItem('destroyAllSessionModal');
        if (destroySessionModal && destroySessionModal === 'true') {
          dispatch(removeAllModal('Authentication'));
        }
      }
    });
    setResetTimer(true);
    return () => {
      clearTimeout(timer);
      idleTimer.cleanUp();
      localStorage.removeItem('destroyAllSessionModal');
    };
  }, []);

  useEffect(() => {
    if (resetTimer) {
      clearTimeout(timer.current);
      startTimer();
      setResetTimer(false);
    }
  }, [resetTimer]);

  if (!isSessionValid) {
    return <Redirect to="/home" />;
  }

  return <div className="mt-10"></div>;
};

export default SessionTimeout;