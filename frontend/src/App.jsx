import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import PregnancyTracker from "./pages/PregnancyTracker";
import Children from "./pages/Children";
import ChildDetail from "./pages/ChildDetail";
import Learn from "./pages/Learn";
import ChildNutrition from "./pages/ChildNutrition";
import FamilyPlanning from "./pages/FamilyPlanning";
import MamaCareAI from "./pages/MamaCareAI";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pregnancy"
        element={
          <ProtectedRoute>
            <PregnancyTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/children"
        element={
          <ProtectedRoute>
            <Children />
          </ProtectedRoute>
        }
      />
      <Route
        path="/children/:id"
        element={
          <ProtectedRoute>
            <ChildDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            <Learn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nutrition"
        element={
          <ProtectedRoute>
            <ChildNutrition />
          </ProtectedRoute>
        }
      />
      <Route
        path="/family-planning"
        element={
          <ProtectedRoute>
            <FamilyPlanning />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <MamaCareAI />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
