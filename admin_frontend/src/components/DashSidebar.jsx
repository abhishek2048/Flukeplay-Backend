/* eslint-disable no-unused-vars */
import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {HiArrowSmRight, HiBookOpen, HiDocument, HiOutlineUserGroup, HiUpload, HiUser, HiUserAdd, HiUserCircle, HiUserGroup, HiUserRemove, HiUsers} from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userslice";

export default function DashSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const [tab, setTab] = useState("");
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        if(tabFromUrl){
            setTab(tabFromUrl);
        }
    },[location.search]);
    const handleSignOut = async () => {
        try {
          const res = await fetch('/admin/signout',{
            method: "POST",
          });
          const data = await res.json();
          if(!res.ok){
            console.log(data.message);
          }else{
            dispatch(signoutSuccess());
          }
        } catch (error) {
          console.log(error.message);
        }
      }

    return (
        <Sidebar className="w-full md:w-72 rounded-2xl">
            <Sidebar.Items className=" bg-gray-50 rounded-xl h-full">
                <Sidebar.ItemGroup className="rounded-xl flex flex-col gap-1">
                    <Link to="/dashboard?tab=profile" >
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"Admin"} labelColor="dark"  className={`bg-slate-200 cursor-pointer ${tab === 'profile' ? 'active' : ''}`}>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    
                    <Link to="/dashboard?tab=users" >
                        <Sidebar.Item active={tab === 'users'} icon={HiUserGroup}  className={`bg-slate-200 cursor-pointer ${tab === 'users' ? 'active' : ''}`}>
                            Users
                        </Sidebar.Item>
                    </Link>

                    <Link to="/dashboard?tab=psycs" >
                        <Sidebar.Item active={tab === 'psycs'} icon={HiUserGroup}  className={`bg-slate-200 cursor-pointer ${tab === 'psycs' ? 'active' : ''}`}>
                            Psychologist
                        </Sidebar.Item>
                    </Link>

                    <Link to="/dashboard?tab=bookings" >
                        <Sidebar.Item active={tab === 'bookings'} icon={HiBookOpen}  className={`bg-slate-200 cursor-pointer ${tab === 'bookings' ? 'active' : ''}`}>
                            Bookings
                        </Sidebar.Item>
                    </Link>

                    <Link to="/dashboard?tab=sessions" >
                        <Sidebar.Item active={tab === 'sessions'} icon={HiDocument}  className={`bg-slate-200 cursor-pointer ${tab === 'sessions' ? 'active' : ''}`}>
                            Sessions
                        </Sidebar.Item>
                    </Link>

                    <Sidebar.Item icon={HiArrowSmRight}  className='bg-slate-200 cursor-pointer' onClick={handleSignOut} >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}
