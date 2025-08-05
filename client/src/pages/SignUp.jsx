import React from "react";
// import { useState } from "react";
import Header from "../components/header";
import SignUpComponent from "../components/signUpComponent";
import '../styles/signUp.css'; // Assuming you have a CSS file for styling

export default function SignUp() {

    return (
        <div>
          <Header />
          <SignUpComponent />
        </div>
    );
}