import React from "react";
import OrderDashboard from "../../../component/admin/dashBoard/chart/OrderDashboard";
import UserDashboard from "../../../component/admin/dashBoard/chart/UserDashboard";

const DashBoard = () => {
  return (
    <main className="flex-1">
      <OrderDashboard />
      <UserDashboard />
    </main>
  );
};

export default DashBoard;
