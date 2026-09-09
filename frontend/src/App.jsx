import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewInvitation from "./pages/NewInvitation";
import InvitationCard from "./pages/InvitationCard";
import InviteFlow from "./pages/InviteFlow";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/invitations/new"
          element={
            <RequireAuth>
              <NewInvitation />
            </RequireAuth>
          }
        />
        <Route
          path="/invitations/:id"
          element={
            <RequireAuth>
              <InvitationCard />
            </RequireAuth>
          }
        />
        {/* Alıcı tarafı: auth gerektirmez */}
        <Route path="/i/:slug" element={<InviteFlow />} />
      </Routes>
    </Layout>
  );
}
