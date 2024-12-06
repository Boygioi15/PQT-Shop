import { Route, Routes, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/homePage";
//import AuthPage from "./pages/authPage/index"
import RootLayout from "./layouts/RootLayout/RootLayout";
export const routeHandler = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, 
        element: <HomePage />
      },
      {
        path: "auth",
        //element: <AuthPage />
      }
    ]
  }
])
