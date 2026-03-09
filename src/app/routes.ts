import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { JobsPage } from "./components/JobsPage";
import CourseRecommendationPage from "./components/CourseRecommendationPage";
import { InterviewSelectPage } from "./components/Interviewselectpage";
import { InterviewQuizPage } from "./components/Interviewquizpage";
import { Layout } from "./components/Layout";
import ProfilePage from "./components/ProfilePage";
import MessagesPage from "./components/MessagesPage";
import { ApplicationTrackerPage } from "./components/Applicationtrackerpage";
// It must be imported exactly like this in routes.ts:
import { AnalyticsDashboardpage } from "./components/Analyticsdashboardpage";



export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignUpPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    Component: Layout,
    children: [
      { path: "/jobs",            Component: JobsPage },
      { path: "/courses",         Component: CourseRecommendationPage },
      { path: "/interview",       Component: InterviewSelectPage },
      { path: "/interview/quiz",  Component: InterviewQuizPage },
      { path: "/profile",         Component: ProfilePage },
      { path: "/messages",        Component: MessagesPage },
      { path: "/tracker",         Component: ApplicationTrackerPage },
      { path: "/analytics",       Component: AnalyticsDashboardpage },
    ],
  },
]);