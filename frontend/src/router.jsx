import { Route, Routes, createBrowserRouter } from "react-router-dom";

import RootLayout from "./layouts/RootLayout/RootLayout";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";

import HomePage from "./pages/HomePage/HomePage";
import ProductPage from "./pages/productPage";
import {SignUpPage_Init, SignUpPage_Verify, SignUpPage_VerifySucessful} from "./pages/AuthPages/SignUpPage";
import { SignInPage_Email } from "./pages/AuthPages/SignInPage";

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
        path: "/product",
        element: <ProductPage />
      }
    ]
  },
  {
    path:"/auth",
    element: <AuthLayout/>,
    children: [
      {
        path:"sign-up",
        element: <SignUpPage_Init 
          returnLink="/" 
          loginLink="/auth/sign-in" 
          nextLink="/auth/sign-up/verify-code/"
        />
      },
      {
        path:"sign-up/verify-code/:method",
        element: <SignUpPage_Verify returnLink="/auth/sign-up" nextLink={"/auth/sign-up/verify-successful"}/>
      },
      {
        path:"sign-up/verify-successful",
        element: <SignUpPage_VerifySucessful nextLink="/"/>
      },
      {
        path:"sign-in",
        element: <SignInPage_Email signUpLink="/auth/sign-up" homePageLink="/" />
      },
      {
        path:"forgot-password",
        element: <SignUpPage_Init />
      }
    ]
  }
])
