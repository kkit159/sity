import { type FC } from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useRouteError } from 'react-router';

import { Home, Landing } from 'pages';
import { routes } from 'shared/const/routes';

import { AppLayout } from '../AppLayout';

const AppError: FC<{ error: Error }> = ({ error }) => {
  return <div>Error: {error.message}</div>;
};

export const ErrorElement: FC = () => {
  const error = useRouteError() as Error;

  return <AppError error={error} />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route Component={AppLayout} errorElement={<ErrorElement />}>
      <Route path={routes.home} Component={Home} />
      <Route path={routes.landing} Component={Landing} />
    </Route>,
  ),

  { basename: '/' },
);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
