import { Alert, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Verify() {
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    const [verified, setVerified] = useState(false);
    console.log(token)
    console.log(email)
    const location = useLocation();
    useEffect(()=>{                                      // to change the searchterm based on the text entered in the URL 
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');
        if(tokenFromUrl){
          setToken(tokenFromUrl);
        }
        const emailFromUrl = urlParams.get('email');
        if(emailFromUrl){
          setEmail(emailFromUrl);
        }
      }, []);

      useEffect(()=>{
        const verifyAdmin = async()=>{
            const res = await fetch(`/admin/verify?token=${token}&email=${email}`);
            const data = await res.json();
            console.log("data: ", data)
            if(res.ok){
               setVerified(true); 
            }
        };
        verifyAdmin();
      })
    
    return (
        <div className="min-h-screen flex flex-col ml-[15%] items-center justify-center md:flex-row">
            {verified ? (
                <>
                    <div className="max-w-full md:max-w-[60%]">
                    <Alert className="max-w-[100%]">
                        <span>Your Account has been verified succesfully! Please Login</span>
                        <br />
                        <Button gradientDuoTone="purpleToPink" className="mx-auto mt-3 p-0" type="submit">
                            <Link to="/sign-in">
                                Sign In
                            </Link>
                        </Button>
                    </Alert>
                    </div>
                    <div className="max-w-full md:max-w-[60%]">
                        <img 
                            src="../Wavy_Bus-24_Single-10.jpg" 
                            alt="image" 
                            className="h-[80%] w-[80%] object-cover "    
                        />
                    </div>
                </>
            ): (
                <h1>please verify first</h1>
            )
            }
            
        </div>
    )
}
