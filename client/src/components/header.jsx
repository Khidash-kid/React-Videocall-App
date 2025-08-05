import React from "react";
import '../styles/Header.css'; 
// import ProfileDropdown from "./profile"; // Importing the ProfileDropdown component

export default function Header()
{
    return(
    <header>
            <div className="header header-panel">
                <div className="header zoom-icon">
                    <img src="https://us05st1.zoom.us/static/6.3.39099/image/new/topNav/Zoom_logo.svg"></img>
                </div>
                <div className="header header-sec">
                    <p className="p1"><a href="">Reason</a></p>
                    <p className="p1"><a href="">Resources</a></p>
                </div>
                <div className="header header-third">
                    <p className="p3 remove">Schedule</p>
                    <p className="p3 remove">Join</p>
                    <p className="p3 remove">Host</p>
                    <div className="header profile-icon">
                      <button className="btn"><i class="fa-solid fa-user" ></i></button>
                    </div>
                    {/* <ProfileDropdown /> */}
                </div>
        
            </div>
    </header>
    )
}