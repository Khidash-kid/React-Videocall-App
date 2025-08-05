import React, { use } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/SignUpComponent.css';

export default function SignUpComponent() {

    const [formData,setformData]=useState({email:"",password:""});
    const [action,setAction]=useState("signup"); 
    const navigate=useNavigate();
    
    const handleSubmit=async(e)=>
    {
        e.preventDefault();
        const endpoint=action==="signup" ? "/signup" : "/login";
        console.log(e.target);
        try{
            const res=await axios.post(`http://localhost:3000${endpoint}`,formData);
            if(res.data=="Email already exists. Try logging in.")
            {
                alert(`${res.data}`);
            }
            else if(res.data=="successfull")
            {
                alert(`${action==="signup" ? "Sign up" : "Login"} successful!`);
                navigate("/Main-Page");
                console.log(res.data);
            }
            else{
            alert(`${action==="signup" ? "Sign up" : "Login"} successful!`);
            navigate("/Main-Page");
            console.log(res.data);
            }
        }catch(err)
        {
            alert(`${action==="signup" ? "Sign up" : "Login"} failed!`);
            console.error(err);
        }
    };

    const change=(e)=>
    {
        const {name,value}=e.target;
        setformData((prevValue)=>
        {
            if(name=="email")
            {
            return{
                // email:value,
                // password:prevValue.password
                ...prevValue,
                [name]:value
             };
            }
            else if(name=="password")
                {
                    return{
                        // email:prevValue.email,
                        // password:value
                        ...prevValue,
                        [name]:value,
                        
                    };
                }
            
        }
    )
    }

    return(
        <div className="SignUp">
            <div className="left">
                <img src="https://file-paa.zoom.us/veZrEn9WR0WD4mgXpyounQ/MS4zLmtoFVlwqgG33Pz3tBOaFUp4B8-WFpl51MaHirr73mMp/d7ec41b5-ef8e-4b99-8234-7668b391cfed.png"></img>
            </div>
            <div className="right">
                <div className="style">
                  <div className="heading">
                    <h1>Sign in</h1>
                  </div>
                  <div className="input-field">
                    <form onSubmit={handleSubmit}>
                      <input onChange={change} name="email" type="email" value={formData.email} className="input-email" placeholder="Email or phone number"></input>
                      <input onChange={change} name="password" type="password" value={formData.password} className="input-password" placeholder="Password"></input>
                      <button type="submit" onClick={()=>setAction('signup')}  className="btn-sign">Sign</button>
                      <button type="submit" onClick={()=>setAction('login')} className="btn-sign">Login</button>
                    </form>
                    {/* <p className="sign-p">Or Sign in with</p> */}
                   
                  </div>
                </div>

                <div className="footer">
                    <div className="footer-panel">
                        <p><a href="https://www.zoom.com/en/trust/terms/?ampDeviceId=f10d655f-9419-4c80-b062-c12e4d82ec50&ampSessionId=1752860430747">Help</a></p>
                        <p><a href="https://www.zoom.com/en/trust/terms/?ampDeviceId=f10d655f-9419-4c80-b062-c12e4d82ec50&ampSessionId=1752860430747">Terms</a></p>
                        <p><a href="https://www.zoom.com/en/trust/privacy/privacy-statement/?ampDeviceId=f10d655f-9419-4c80-b062-c12e4d82ec50&ampSessionId=1752860430747">Privacy</a></p>
                    </div>
                    <div className="footer-copyright">
                        <p>Zoom is protected by reCAPTCHA and the <a href="https://policies.google.com/privacy">Privacy Policy</a>  and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
                    </div>
            </div>
        </div>
        </div>

    )
}
