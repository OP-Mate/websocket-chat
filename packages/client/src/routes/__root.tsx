import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const ROUTES = [
  { id: "1", path: "/users", iconClassName: "fa-users", title: "Users" },
  { id: "2", path: "/rooms", iconClassName: "fa-comment", title: "Rooms" },
];

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-row">
      <nav className="h-screen p-4 flex">
        <ul className="list-none flex flex-col border-2 border-line rounded-md overflow-hidden">
          {ROUTES.map((route) => (
            <li
              key={route.id}
              className="group border-b-2 border-line  flex justify-center items-center hover:bg-secondary"
            >
              <Link
                to={`${route.path}`}
                className="relative active:bg-black-500 flex flex-col items-center justify-center  py-1 px-2"
              >
                <i
                  className={`${route.iconClassName} fa-solid text-xl text-line group-hover:text-background`}
                />
                <span className="text-xs group-hover:text-background text-line">
                  {route.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="py-4 pr-4 flex flex-1">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
});
