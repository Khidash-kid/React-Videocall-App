import React from "react";
import '../styles/Main-comp.css';
import { useNavigate } from "react-router-dom"; // Assuming you have a CSS file for styling

export default function Maincomp() {

    const navigate = useNavigate();
    function gotoHost() {
        navigate("/host-Page");
    }
    function gotoJoin() {
        navigate("/join-page");
    }

    return (
        <div className="main-component">
            <div className="centre-div">
                <div className="btn-host">
                    <button className="btn-host-now" onClick={gotoHost} >Host</button>
                    <p>Host</p>
                </div>
                <div className="btn-join">
                    <button className="btn-join-now" onClick={gotoJoin}>Join</button>
                    <p>Join</p>
                </div>
                <i class="fa-light fa-message-plus"></i>
            </div>
        </div>
    );
}
