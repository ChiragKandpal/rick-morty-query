import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <div style={{ padding: '20px' }}>
        <Outlet />
      </div>
    </>
  ),
})
