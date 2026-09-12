import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DashboardHeader } from "./DashboardHeader";
import {
  IconGrid,
  IconStore,
  IconLayers,
  IconUsers,
  IconTrendingUp,
  IconComment,
  IconWallet,
  IconLogout,
} from "./icons";

const NAV_ITEMS = [
  { to: "/brand/overview", label: "Overview", icon: IconGrid },
  { to: "/brand/creators", label: "Creators", icon: IconStore },
  { to: "/brand/campaigns", label: "Campaigns", icon: IconLayers },
  { to: "/brand/collaborations", label: "Collaborations", icon: IconUsers },
  { to: "/brand/results", label: "Results", icon: IconTrendingUp },
  { to: "/brand/messages", label: "Messages", icon: IconComment },
  { to: "/brand/billing", label: "Billing", icon: IconWallet },
];

export default function BrandLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#f4f5fb]">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="px-6 py-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-naano-dark flex items-center justify-center text-white text-sm font-bold">
            n
          </div>
          <span className="text-xl font-bold text-naano-dark">naano</span>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-naano-blue/10 text-naano-blue"
                    : "text-gray-500 hover:bg-gray-50 hover:text-naano-dark"
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-naano-dark"
          >
            <IconLogout />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader profileTo="/brand/overview" />

        <main className="flex-1 px-8 py-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
