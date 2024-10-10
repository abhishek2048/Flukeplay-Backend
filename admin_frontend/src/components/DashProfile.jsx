import { Button, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux"
import { signoutSuccess } from "../redux/user/userslice";

export default function DashProfile() {
  const {currentUser} = useSelector(state=>state.user);
  const dispatch = useDispatch();
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
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-10 text-center font-poppins font-semibold text-3xl uppercase">Profile</h1>
      <form className="flex flex-col gap-5">
        <div className="w-32 h-32 self-center cursor-pointer shadow-2xl overflow-hidden rounded-full">
          <img src={currentUser.imagePath} alt="Admin_pic" className="rounded-full w-full h-full object-cover border-4 border-[lightgray] " />
        </div>
        <TextInput 
          type="text"
          placeholder="Username"
          id="username"
          defaultValue={currentUser.name}
          className="mt-5"
        />
        <TextInput 
          type="email"
          placeholder="Email"
          id="email"
          defaultValue={currentUser.email}
        />
        <TextInput 
          type="password"
          placeholder="********"
          id="password"
        />
        <Button type="submit" gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 mt-5 flex justify-between">
        <span className="cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}
