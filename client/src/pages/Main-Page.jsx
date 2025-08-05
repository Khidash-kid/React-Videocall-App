import React from "react";
import Header from "../components/header";
import Maincomp from "../components/Main-comp";
import Footer from "../components/footer";
import '../styles/Main-page.css'; 
// Assuming you have a CSS file for styling



export default function MainPage() {
  return (
    <div>
        <Header />
        <Maincomp />
        <Footer />
    </div>
  );
}