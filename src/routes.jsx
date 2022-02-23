import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PageVisibility from 'react-page-visibility';

// Route Path
import {
  EDIT_SUBSCRIBER,
  EMAIL_SEARCH,
  ORDER_SEARCH,
  PERSONAL_SUBSCRIBER_FORM,
  SEARCH_SUBSCRIBER,
  WEB_ACCESSFORM,
  OCC_DOLLAR_THRESHOLD,
  BIC_FORM,
  TWELVE_MONTH_OCC_FORM,
  MY_REQUESTS,
  OCC_FORM,
  RERATE_FORM,
  BIC_FORM_WITH_ID,
  OCC_FORM_EDIT_VIEW,
  APPROVAL_FORM,
  REQUESTED_APPROVAL,
} from './constants/routePath';

//pages
import PageLayout from './components/templates/pageLayout';
import WithMain from './components/organisms/main';
import SessionTimeout from './components/organisms/sessionTimeout';

// components
import Loader from './components/atoms/loader';
import ModalWrapper from './components/organisms/modalWrapper';
import ToasterWrapper from './components/organisms/toasterWrapper';

import { InitApplication } from './app';
import { getRoutingDetails } from './services/routing/routingSelector';
import FullPageLayout from './components/templates/fullPageLayout';
import PSIForm from './pages/personalSubscriberForm';
import { onSessionExpire } from './services/auth/authSlice';
import { useEffect } from 'react';

const Sample = lazy(() => import(/* webpackChunkName: "sample"*/ './pages/sample'));
const Form = lazy(() => import(/* webpackChunkName: "sampleForm"*/ './pages/sample/form'));
const PersonalSubscriberForm = lazy(() => import(/* webpackChunkName: "psi"*/ './pages/personalSubscriberForm'));
const TestPageWithGrid = lazy(() => import('./pages/sample/tableSample'));
const EmailSearch = lazy(() => import(/* webpackChunkName: "emailSearch"*/ './pages/emailSearch'));
const OrderSearch = lazy(() => import(/* webpackChunkName: "orderSearch"*/ './pages/orderSearch'));
const WebAccessForm = lazy(() => import(/* webpackChunkName: "webAccess"*/ './pages/webAccessForm'));
const OccDollarThreshold = lazy(() => import(/* webpackChunkName: "occdolThHold"*/ './pages/occDollarThreshold'));
const WIP_COMPONENT = lazy(() => import(/* webpackChunkName: "WIP"*/ './pages/error/workInProgress'));
const SearchSubscriber = lazy(() => import(/* webpackChunkName: "searchSubscriber"*/ './pages/searchSubscriber'));
const EditSubscriber = lazy(() => import(/* webpackChunkName: "editSubscriber"*/ './pages/editSubscriber'));
const BicForm = lazy(() => import(/* webpackChunkName: "bic"*/ './pages/bicForm'));
const TwelveMonthOccForm = lazy(() => import(/* webpackChunkName: "12mocc"*/ './pages/twelveMonthOcc'));
const MyRequests = lazy(() => import(/* webpackChunkName: "myRequests"*/ './pages/myRequests'));
const OccForm = lazy(() => import(/* webpackChunkName: "occ"*/ './pages/occForm'));
const RerateForm = lazy(() => import(/* webpackChunkName: "rerate"*/ './pages/rerateForm'));
const RequestedApproval = lazy(() => import(/* webpackChunkName: "requestedApproval"*/ './pages/requestedApproval'));
const ApprovalForm = lazy(() => import(/* webpackChunkName: "approvalForm"*/ './pages/approvalForm'));

const PlaceHolderComponent = () => <p>Main Content will be here...</p>;

const MAX_TIMER = 30 * 60 * 1000;

function Routes() {
  const dispatch = useDispatch();
  const routingDetails = useSelector(getRoutingDetails);

  const ROUTES = [
    { path: '/', Component: PlaceHolderComponent, escapeUrlCheck: true },
    { path: PERSONAL_SUBSCRIBER_FORM, Component: PersonalSubscriberForm },
    { path: EMAIL_SEARCH, Component: EmailSearch },
    { path: WEB_ACCESSFORM, Component: WebAccessForm },
    { path: OCC_DOLLAR_THRESHOLD, Component: OccDollarThreshold },
    { path: ORDER_SEARCH, Component: OrderSearch },
    { path: BIC_FORM, Component: BicForm },
    { path: OCC_FORM, Component: OccForm },
    { path: SEARCH_SUBSCRIBER, Component: SearchSubscriber },
    { path: EDIT_SUBSCRIBER, Component: EditSubscriber, escapeUrlCheck: true },
    { path: RERATE_FORM, Component: RerateForm },
    { path: TWELVE_MONTH_OCC_FORM, Component: TwelveMonthOccForm },
    { path: MY_REQUESTS, Component: MyRequests },
    { path: APPROVAL_FORM, Component: ApprovalForm, escapeUrlCheck: true },
    { path: REQUESTED_APPROVAL, Component: RequestedApproval },

    /* Only for Testing */
    { path: '/sample', Component: Sample },
    { path: '/sample/form', Component: Form },
    { path: '/sample/table', Component: TestPageWithGrid },

    { path: '*', Component: WIP_COMPONENT, escapeUrlCheck: true },
  ];

  const tabVisibilityChangeHandler = (isVisible) => {
    const _tm = localStorage.getItem('_token_tm') || 0;
    const timeDifference = Date.now() - parseInt(_tm, 10);
    if (isVisible && timeDifference > MAX_TIMER) {
      dispatch(onSessionExpire());
      localStorage.setItem('destroyAllSessionModal', true);
    }
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem('_token_tm');
    };
  }, []);

  return (
    <>
      <InitApplication />
      <ModalWrapper />
      <ToasterWrapper />
      <PageVisibility onChange={tabVisibilityChangeHandler}>
        <SessionTimeout />
      </PageVisibility>

      {routingDetails === true ? (
        <FullPageLayout>
          <PSIForm isFullPage={true} />
        </FullPageLayout>
      ) : (
        <Router>
          <PageLayout>
            <Suspense fallback={<Loader active />}>
              <Switch>
                {ROUTES.map((route, index) => (
                  <Route
                    key={`route-${index}`}
                    exact
                    path={route.path}
                    render={(props) => (
                      <WithMain path={route.path} escapeUrlCheck={route.escapeUrlCheck}>
                        <route.Component {...props} />
                      </WithMain>
                    )}
                  />
                ))}
              </Switch>
            </Suspense>
          </PageLayout>
        </Router>
      )}
    </>
  );
}
export default Routes;