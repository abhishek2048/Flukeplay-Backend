import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userslice";

export default function SignIn() {
    const [formdata, setFormData] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, error, loading} = useSelector((state) => state.user);
    // console.log(formdata);
    console.log("currentUser: ", currentUser);
    const handleChange = (e) => {
        setFormData({...formdata, [e.target.id]: e.target.value.trim()});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formdata.email || !formdata.password){
            return dispatch(signInFailure("Please fill out all the details!"));
        }
        try {
            dispatch(signInStart());
            const res = await fetch("/admin/login", {
                method : "POST",
                headers : {"Content-Type": "application/json"},
                body: JSON.stringify(formdata),
            });
            const data = await res.json(); 
            if(data.success === false){
                dispatch(signInFailure(data.message));
            }
            console.log("data: ", data);
            if(res.ok){
                dispatch(signInSuccess(data));
                navigate("/");
              }
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    }
    return (
        <div className="min-h-screen mt-20 font-poppins">
            <div className="flex flex-col items-center justify-center mb-10 ">
                <Link to='/' className='text-3xl md:text-4xl font-bold font-poppins' >
                    <span className='p-1 text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl'>Wellness</span>
                    <span >Warriors</span>
                </Link>
                <p className="text-sm mt-5 max-w-[80%]">
                    A one stop destination for all your Wellness Warriors App. This is a website especially designed for the Admins.
                </p>
            </div>
            <hr className="h-px my-8 bg-teal-300 border-0 w-[60%] mx-auto"></hr>
            <div className="flex flex-col md:flex-row md:items-center max-w-[60%] mx-auto gap-8">
                
                {/* div for left side */}
                <div className="flex-1">
                    <img src="../6300959.jpg" alt="" className="w-[80%] h-[80%] shadow-xl rounded-2xl" />
                </div>

                {/* div for right side */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                        <div>
                            <Label value="Email"/>
                            <TextInput 
                                type="email"
                                placeholder="abc@gmail.com"
                                id="email"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value="Password"/>
                            <TextInput 
                                type="password"
                                placeholder="********"
                                id="password"
                                onChange={handleChange}
                            />
                        </div>
                        <Button gradientDuoTone={"purpleToPink"} type="submit" disabled={loading}>
                            {
                                loading ? (
                                    <>
                                        <Spinner size='sm'/>
                                        <span className="">Loading...</span>
                                    </>
                                ) : "Sign In"
                            }
                        </Button>
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Do not have an account?</span>
                        <Link to="/sign-up" className="text-blue-500">
                            Sign Up
                        </Link>
                    </div>
                    {
                        error && (
                            <Alert className="mt-5" color="failure">
                                {error}
                            </Alert>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
