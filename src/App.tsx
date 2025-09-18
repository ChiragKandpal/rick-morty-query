// @ts-nocheck
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CharacterList from "./CharacterList";
import CharacterDetail from "./CharacterDetail";

// Routes
const rootRoute = createRootRoute({
  component: () => (
    <div style={{ padding: 24 }}>
      <Outlet />
    </div>
  ),
});

const characterListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rick-morty-query/character",
  component: CharacterList,
});

const characterDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rick-morty-query/character/$id",
  component: CharacterDetail,
});

const routeTree = rootRoute.addChildren([characterListRoute, characterDetailRoute]);
const router = createRouter({ routeTree });

// Providers
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
