import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Index } from './Index';
import { Media } from './Media';

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Index />} />
      <Route path=":category/:uuid" element={<Media />} />
    </Route>,
  ),
);

export const Main = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
};
