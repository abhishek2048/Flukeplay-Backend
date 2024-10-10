import { Button, Label, TextInput } from "flowbite-react";


export default function DashSessions() {
  return (
    <div className=" w-full">
        <h1 className="font-poppins font-semibold py-7 text-center text-3xl">Sessions of Patient</h1>
        <div className="flex mx-auto items-start gap-24 w-full pl-24">
            <div>
                <form className="flex items-center gap-2 mt-20">
                    <Label value="Enter Patient ID : "/>
                    <TextInput 
                        type="text"
                        placeholder="ex - 65d5a21fb1"
                        id="userId"
                        className="shadow-xl"
                    />   
                </form>
                <Button gradientDuoTone={"purpleToBlue"} className="w-full mt-5">
                    Find
                </Button>

            </div>   
            <div className="w-[60%]">
                <img src="../278279-P672ML-499.jpg" alt="" className="w-[100%] h-[100%] object-contain mt-10"/>           
            </div>  
            
        </div>
    </div>
  )
}
