import { BrowserRouter as Router, Routes, Route } from "react-router";
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

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route index path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
          <Route path="/semester" element={<Semester />} />
            <Route path="/week" element={<WeekSidebar />} />
            <Route path="/week/:semesterId" element={<WeekPage />} />
            <Route path="/task/:semesterId/:weekId" element={<TaskPage />} />
            <Route path="/email" element={<EmailSidebar />} />
            <Route path="/matkul" element={<MatkulSidebar />} />

            {/* User Test */}
            <Route path="/semester-user" element={<SemesterUser />} />
            <Route path="/week-user/:semesterId" element={<WeekUserPage />} />
            <Route
              path="/task-user/:semesterId/:weekId"
              element={<TaskUserPage />}
            />

            {/* Dashboard */}

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Ui Elements */}
          </Route>

          {/* Auth Layout */}
          {/* <Route index path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}