import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { JobsPage } from "./components/JobsPage";
import CourseRecommendationPage from "./components/CourseRecommendationPage"; // NEW
import InterviewPrepPage from "./components/InterviewPrepPage";               // NEW
import { Layout } from "./components/Layout"
import ProfilePage from "./components/ProfilePage";
import MessagesPage from "./components/MessagesPage";                                // NEW


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
      { path: "/jobs",      Component: JobsPage },
      { path: "/courses",   Component: CourseRecommendationPage },
      { path: "/interview", Component: InterviewPrepPage },
      { path: "/profile",   Component: ProfilePage },
      { path: "/messages",  Component: MessagesPage },

    ],
  },
]);