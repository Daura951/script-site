import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import MainPage from "./pages/MainPage";
import RootLayout from "./layouts/RootLayout";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./context/AuthProvider";
import AboutPage from "./pages/AboutPage";
import TeamPage from "./pages/TeamPage";
import ScriptsPage from "./pages/ScriptsPage";
import ScriptPage from "./pages/ScriptPage";
import ScriptSubmissionPage from "./pages/ScriptSubmissionPage";
import ScriptEditPage from "./pages/ScriptEditPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/team",
        element: <TeamPage />,
      },
      {
        path: "/scripts",
        element: <ScriptsPage />,
      },
      {
        path: "/scripts/:scriptId",
        element: <ScriptPage />,
      },
      {
        path: "/scripts/submit",
        element: <ScriptSubmissionPage />,
      },
      {
        path: "/scripts/edit/:scriptId",
        element: <ScriptEditPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
