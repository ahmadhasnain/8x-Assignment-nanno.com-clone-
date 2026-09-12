import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconBell, IconChevronDown, IconCreditCard, IconLogout } from "./icons";

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
}

const CREATOR_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "Welcome to naano 👋", body: "Complete your onboarding so brands can discover you.", time: "Just now" },
  { id: "2", title: "Your creator card is live", body: "Brands can now find you in the marketplace.", time: "1h ago" },
  { id: "3", title: "Tip: broaden your industries", body: "Creators with 2+ industries get more views.", time: "1d ago" },
];

const COMPANY_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "Welcome to naano 👋", body: "We drafted your first campaign brief from your onboarding answers.", time: "Just now" },
  { id: "2", title: "New creators added", body: "Check out the latest creators that match your ICPs.", time: "1h ago" },
  { id: "3", title: "Tip: refine your brief", body: "Edit your value proposition anytime from Campaigns.", time: "1d ago" },
];

export function DashboardHeader({ profileTo }: { profileTo: string }) {
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const notifications = user?.role === "CREATOR" ? CREATOR_NOTIFICATIONS : COMPANY_NOTIFICATIONS;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end gap-3 px-8 shrink-0">
      <div className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 text-sm font-medium text-naano-dark">
        <IconCreditCard />
        €0
      </div>
      <div className="flex items-center border border-gray-200 rounded-full p-0.5 text-xs font-semibold">
        <span className="px-2.5 py-1 rounded-full bg-naano-dark text-white">EN</span>
        <span className="px-2.5 py-1 text-gray-400">FR</span>
      </div>

      <div className="relative" ref={notifRef}>
        <button
          onClick={() => {
            setNotifOpen((v) => !v);
            setMenuOpen(false);
            setUnread(false);
          }}
          className="relative w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
        >
          <IconBell />
          {unread && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
        </button>

        {notifOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-20">
            <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Notifications</p>
            {notifications.map((n) => (
              <div key={n.id} className="px-4 py-2.5 hover:bg-gray-50">
                <p className="text-sm font-semibold text-naano-dark">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => {
            setMenuOpen((v) => !v);
            setNotifOpen(false);
          }}
          className="flex items-center gap-1"
        >
          <span className="relative w-9 h-9 rounded-full bg-naano-dark text-white flex items-center justify-center text-xs font-semibold">
            {user?.email?.[0]?.toUpperCase() ?? "?"}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </span>
          <IconChevronDown />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-lg py-1.5 z-20">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-naano-dark truncate">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user?.role === "CREATOR" ? "Creator" : "Brand"} account</p>
            </div>
            <Link
              to={profileTo}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-naano-dark"
            >
              View profile
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-naano-dark"
            >
              <IconLogout />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
