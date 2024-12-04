import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/homePage";
import LoginPage from "./pages/user/loginPage";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./component/theme/masterLayout";
const renderUserRouter = () => {
  const userRouters = [
    {
      path: ROUTERS.USER.HOME,
      component: <HomePage />,
    },
    {
      path: ROUTERS.USER.LOGIN, // Thêm đường dẫn cho LOGIN
      component: <LoginPage />, // Thêm component cho LOGIN
    },
    {
      path: ROUTERS.USER.LOGIN_PHONE,
      component: <LoginPage loginMethod="phone"/>,
    },
    {
      path: ROUTERS.USER.LOGIN_EMAIL,
      component: <LoginPage loginMethod="email"/>,
    },
  ];
  return (
    <MasterLayout>
      <Routes>
        {userRouters.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterLayout>
  );
};

const RouterCustom = () => {
  return renderUserRouter();
};

export default RouterCustom;
