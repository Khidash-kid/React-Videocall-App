import React from "react";
import '../styles/footer.css'; // Assuming you have a CSS file for styling

export default function Footer() {
    return (
        <div className="footer-component ">
            <div className="footer-content">
                <p>© 2025 Zoom Communications, Inc. All rights reserved.</p>
                <a href="https://www.zoom.com/en/trust/resources/">Privacy & Legal Policies</a>
            </div>
        </div>
    );
}