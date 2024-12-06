import { Route, Routes, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
//import AuthPage from "./pages/authPage/index"
import RootLayout from "./layouts/RootLayout/RootLayout";
import ProductPage from "./pages/productPage";
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
      },
      {
        path: "/product",
        element: <ProductPage />
      }
    ]
  }
])
