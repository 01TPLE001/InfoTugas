import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import TaskPage from "./pages/Task/task";
import Calendar from "./pages/Calendar";
import SemesterUser from "./pages/Semester/SemesterUser";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Semester from "./pages/Semester/Semester";
import WeekPage from "./pages/Week/Week";
import WeekSidebar from "./pages/Week/WeekSidebar";
import WeekUserPage from "./pages/Week/Weekuser";
import TaskUserPage from "./pages/Task/Taskuser";
import EmailSidebar from "./pages/Email/EmailSidebar";
import MatkulSidebar from "./pages/Matkul/MatkulSidebar";
import ProtectedRoute from "./protectroute";
import EmailSidebarUser from "./pages/Email/EmailSidebarUser";
import MatkulSidebarUser from "./pages/Matkul/MatkulSIdebarUser";

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
          <Route path="/email-user" element={<EmailSidebarUser />} />
          
          {/* Admin Routes */}
          <Route
            path="/semester"
            element={
              <ProtectedRoute role="admin">
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
              <ProtectedRoute role="admin">
                <WeekPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task/:semesterId/:weekId"
            element={
              <ProtectedRoute role="admin">
                <TaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/email"
            element={
              <ProtectedRoute role="admin">
                <EmailSidebar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matkul"
            element={
              <ProtectedRoute role="admin">
                <MatkulSidebar />
              </ProtectedRoute>
            }
          />
          
          {/* User Routes */}
          <Route
            path="/semester-user"
            element={
              <ProtectedRoute role="user">
                <SemesterUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/week-user/:semesterId"
            element={
              <ProtectedRoute role="user">
                <WeekUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task-user/:semesterId/:weekId"
            element={
              <ProtectedRoute role="user">
                <TaskUserPage />
              </ProtectedRoute>
            }
          />

                    <Route
            path="/matkul-user"
            element={
              <ProtectedRoute role="user">
                <MatkulSidebarUser />
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