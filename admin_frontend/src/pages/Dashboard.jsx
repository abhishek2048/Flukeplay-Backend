/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashUsers from "../components/DashUsers";
import DashPsycs from "../components/DashPsycs";
import DashBookings from "../components/DashBookings";
import DashSessions from "../components/DashSessions";

export default function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState("");
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if(setTab){
            setTab(tabFromUrl);
        }
    },[location.search]);
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-72">
                {/* Sidebar  */}
                <DashSidebar />
            </div>

            {/* Profile */}
            {tab === 'profile' && <DashProfile />}

            {/* Users */}
            {tab === 'users' && <DashUsers />}

            {/* Psycs */}
            {tab === 'psycs' && <DashPsycs />}

            {/* Bookings */}
            {tab === 'bookings' && <DashBookings />}

            {/* Sessions */}
            {tab === 'sessions' && <DashSessions />}
        </div>
    )
}
