import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import BrandOnboarding from "./pages/BrandOnboarding";
import CreatorLayout from "./components/CreatorLayout";
import Overview from "./pages/creator/Overview";
import MyCard from "./pages/creator/MyCard";
import Analytics from "./pages/creator/Analytics";
import Opportunities from "./pages/creator/Opportunities";
import Collaborations from "./pages/creator/Collaborations";
import Community from "./pages/creator/Community";
import Earnings from "./pages/creator/Earnings";
import Affiliate from "./pages/creator/Affiliate";
import Messages from "./pages/creator/Messages";
import BrandLayout from "./components/BrandLayout";
import BrandOverview from "./pages/brand/Overview";
import BrandCreators from "./pages/brand/Creators";
import BrandCampaigns from "./pages/brand/Campaigns";
import CampaignNew from "./pages/brand/CampaignNew";
import CampaignDetail from "./pages/brand/CampaignDetail";
import BrandCollaborations from "./pages/brand/Collaborations";
import BrandResults from "./pages/brand/Results";
import BrandBilling from "./pages/brand/Billing";

function RequireAuth({ children, role }: { children: React.ReactNode; role?: "CREATOR" | "COMPANY" }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "CREATOR" ? "/creator/overview" : "/brand/overview"} replace />;
  }
  return <>{children}</>;
}

function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  if (user) return <Navigate to={user.role === "CREATOR" ? "/creator/overview" : "/brand/overview"} replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/register"
            element={
              <RedirectIfAuthed>
                <Register />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <Login />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/onboarding"
            element={
              <RequireAuth role="CREATOR">
                <Onboarding />
              </RequireAuth>
            }
          />
          <Route
            path="/creator"
            element={
              <RequireAuth role="CREATOR">
                <CreatorLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="card" element={<MyCard />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="collaborations" element={<Collaborations />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="community" element={<Community />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="affiliate" element={<Affiliate />} />
            <Route path="messages" element={<Messages />} />
          </Route>
          <Route
            path="/brand-onboarding"
            element={
              <RequireAuth role="COMPANY">
                <BrandOnboarding />
              </RequireAuth>
            }
          />
          <Route
            path="/brand"
            element={
              <RequireAuth role="COMPANY">
                <BrandLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<BrandOverview />} />
            <Route path="creators" element={<BrandCreators />} />
            <Route path="campaigns" element={<BrandCampaigns />} />
            <Route path="campaigns/new" element={<CampaignNew />} />
            <Route path="campaigns/:id" element={<CampaignDetail />} />
            <Route path="collaborations" element={<BrandCollaborations />} />
            <Route path="results" element={<BrandResults />} />
            <Route path="messages" element={<Messages />} />
            <Route path="billing" element={<BrandBilling />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
