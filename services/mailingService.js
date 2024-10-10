const nodemailer = require('nodemailer');
const { mail } = require("../utils/nodemailerConfig");

//for psyc
const sendMailPsyc = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: mail.emailUser,
                pass: mail.emailPassword
            },
            tls: {
                rejectUnauthorized: false, // Disable SSL verification
            },
        });
        const mailOptions = {
            from : mail.emailUser,
            to : email,
            subject: "For reset Password",
            html: `<p> 
                        Hii ${name}, <br/> <br />  
                        You requested to reset your Password. 
                        <br /> <br />  
                        Please, use the OTP below to reset your password.
                        <br /> <br />  
                        OTP : ${token}
                        <br /> <br />
                        Hope you have Good Day dear ${name}💕
                    </p>`
        }
        console.log("check1");
        transporter.sendMail(mailOptions, (error, information) => {
            if(error){
                console.log("error: ",error);
            }else{
                console.log('Mail has been sent. Info: ', information.response);
            }
        });
        console.log("check2");
    } catch (error) {
        console.log("Error: ", error);
    }
};

//for user
const sendMailUser = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: mail.emailUser,
                pass: mail.emailPassword
            },
            tls: {
                rejectUnauthorized: false, // Disable SSL verification
              },
        });
        const mailOptions = {
            from : mail.emailUser,
            to : email,
            subject: "For reset Password",
            html: `<p> 
                        Hii ${name}, <br/> <br />  
                        You requested to reset your Password. 
                        <br /> <br />  
                        Please, use the OTP below to reset your password.
                        <br /> <br />  
                        OTP : ${token}
                        <br /> <br />
                        Hope you have Good Day dear ${name}💕
                    </p>`
        }
        console.log("check1");
        transporter.sendMail(mailOptions, (error, information) => {
            if(error){
                console.log("error: ",error);
            }else{
                console.log('Mail has been sent. Info: ', information.response);
            }
        });
        console.log("check2");
    } catch (error) {
        console.log("Error: ", error);
    }
};

//for email verification : 
const SendMailVerifyEmail = async (name, email, token) => {
    try{
        const transporter =nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: mail.emailUser,
                pass: mail.emailPassword,
            },
            tls: {
                rejectUnauthorized: false, // Disable SSL verification
              },
        });
        const mailOptions = {
            from : mail.emailUser,
            to: email,
            subject: "Email Verification",
            html: `<p> 
                        Hii ${name}, <br/> <br />  
                        You requested to register in Fluke. 
                        <br /> <br />  
                        Please, use the OTP below to verify you email.
                        <br /> <br />  
                        OTP : ${token}
                        <br /> <br />
                        Hope you have Good Day dear ${name}💕
                    </p>`
        }
        transporter.sendMail(mailOptions, (error, information)=>{
            if(error){
                console.log("error: ", error);
            }else{
                console.log("Mail has been sent. Info: ", information.response);
            }
        })
    }catch(error){
        console.log("Error: ",error);
    }
}

//for admin email verification:
//for email verification : 
const SendAdminVerifyEmail = async (name, email, token) => {
    try{
        const transporter =nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: mail.emailUser,
                pass: mail.emailPassword,
            },
            tls: {
                rejectUnauthorized: false, // Disable SSL verification
              },
        });
        const mailOptions = {
            from : mail.emailUser,
            to: email,
            subject: "Email Verification",
            html: `<p> 
                        Hii ${name}, <br/> <br />  
                        You requested to register in Fluke. 
                        <br /> <br />  
                        Please, use the Link below to verify you email.
                        <br /> <br />  
                        Link : <a href="http://localhost:5173/verify?token=${token}&email=${email}" > Email verifiaction Link </a> 
                        <br /> <br />
                        Hope you have Good Day dear ${name}💕
                    </p>`
        }
        transporter.sendMail(mailOptions, (error, information)=>{
            if(error){
                console.log("error: ", error);
            }else{
                console.log("Mail has been sent. Info: ", information.response);
            }
        })
    }catch(error){
        console.log("Error: ",error);
    }
}

//for otp verification for delete request
const SendOtpDelete = async (email, token) => {
    try{
        const transporter =nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: mail.emailUser,
                pass: mail.emailPassword,
            },
            
            tls: {
                rejectUnauthorized: false, // Disable SSL verification
              },
        });
        const mailOptions = {
            from : mail.emailUser,
            to: email,
            subject: "Email Verification for delete request",
            html: `<p> 
                        Hello, <br/> <br />  
                        You requested to delete you data in Fluke. 
                        <br /> <br />
                        Please, use the OTP below to verify you email.
                        <br /> <br />  
                        OTP : ${token}
                        <br /> <br />
                        Hope you have Good Day💕
                    </p>`
        }
        transporter.sendMail(mailOptions, (error, information)=>{
            if(error){
                console.log("error: ", error);
            }else{
                console.log("Mail has been sent. Info: ", information.response);
            }
        })
    }catch(error){
        console.log("Error: ",error);
    }
}


module.exports = { sendMailPsyc, sendMailUser , SendMailVerifyEmail, SendAdminVerifyEmail, SendOtpDelete};