import React from "react";
import DashboardCard from "../../../component/admin/dashBoard/DashBoardCard";
import IconTotalUser from "../../../assets/IconTotalUser.png";
import IconTotalOrder from "../../../assets/IconTotalOrder.png";
import IconTotalSales from "../../../assets/IconTotalSales.png";
import IconTotalPending from "../../../assets/IconTotalPending.png";
import SaleChart from "../../../component/admin/dashBoard/chart/SaleChart";
import InventoryChart from "../../../component/admin/dashBoard/chart/InventoryChart";
import MemberOrderChart from "../../../component/admin/dashBoard/chart/MemberOrderChart";
import PaymentMethodChart from "../../../component/admin/dashBoard/chart/PaymentMethodChart";
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
