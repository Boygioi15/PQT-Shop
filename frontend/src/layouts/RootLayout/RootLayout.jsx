import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
export default function RootLayout(){
    return (
        <div className = "RootLayout">
            <TopNav />
            <Outlet />
        </div>
    )
}