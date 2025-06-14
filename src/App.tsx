import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import TaskPage from "./pages/task/Task";
import Calendar from "./pages/Calendar";
import SemesterUser from "./pages/Semester/SemesterUser";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Semester from "./pages/Semester/Semester";
import WeekPage from "./pages/Week/Week";
import WeekSidebar from "./pages/Week/WeekSidebar";
import WeekUserPage from "./pages/Week/Weekuser";
import TaskUserPage from "./pages/task/Taskuser";
import EmailSidebar from "./pages/Email/EmailSidebar";
import MatkulSidebar from "./pages/Matkul/MatkulSidebar";
import ProtectedRoute from "./protectroute";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Protected Routes inside Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route
            path="/semester"
            element={
              <ProtectedRoute>
                <Semester />
              </ProtectedRoute>
            }
          />
          <Route
            path="/week"
            element={
              <ProtectedRoute>
                <WeekSidebar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/week/:semesterId"
            element={
              <ProtectedRoute>
                <WeekPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task/:semesterId/:weekId"
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/email"
            element={
              <ProtectedRoute>
                <EmailSidebar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matkul"
            element={
              <ProtectedRoute>
                <MatkulSidebar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/semester-user"
            element={
              <ProtectedRoute>
                <SemesterUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/week-user/:semesterId"
            element={
              <ProtectedRoute>
                <WeekUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task-user/:semesterId/:weekId"
            element={
              <ProtectedRoute>
                <TaskUserPage />
              </ProtectedRoute>
            }
          />

          {/* Non-protected pages inside layout */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
