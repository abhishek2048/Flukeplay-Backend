import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
    const [formdata, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    // console.log(formdata);
    const handleChange = (e) => {
        setFormData({...formdata, [e.target.id]: e.target.value.trim()});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formdata.username || !formdata.email || !formdata.password){
            return setErrorMessage("Please fill out all the details!")
        }
        try {
            setLoading(true);
            setErrorMessage(null);
            setSuccessMessage("");
            const res = await fetch("/admin/register", {
                method : "POST",
                headers : {"Content-Type": "application/json"},
                body: JSON.stringify(formdata),
            });
            const data = await res.json(); 
            if(!res.ok){
                setErrorMessage(data.msg);
            }
            setSuccessMessage(data.message);
            setLoading(false);
        } catch (error) {
            setErrorMessage(error.message);
            setLoading(false);
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
            <div className="flex flex-col md:flex-row md:items-center max-w-[60%] mx-auto gap-5">
                
                {/* div for left side */}
                <div className="flex-1">
                    <img src="../Wavy_Gen-01_Single-07.jpg" alt="" className="w-[80%] h-[80%] shadow-xl rounded-2xl" />
                </div>

                {/* div for right side */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <Label value="Username"/>
                            <TextInput 
                                type="text"
                                placeholder="Username"
                                id="username"
                                onChange={handleChange}
                            />
                        </div>
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
                                ) : "Sign Up"
                            }
                        </Button>
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Have an account?</span>
                        <Link to="/sign-in" className="text-blue-500">
                            Sign In
                        </Link>
                    </div>
                    {
                        errorMessage && (
                            <Alert className="mt-5" color="failure">
                                {errorMessage}
                            </Alert>
                        )
                    }
                    {
                        successMessage && (
                            <>
                                <Alert className="mt-5" color="success">
                                    {successMessage}
                                </Alert>
                                <Link to="https://www.google.com/intl/en_in/gmail/about/" className="text-blue-500 justify-start">
                                    Verify by clicking 
                                </Link>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
