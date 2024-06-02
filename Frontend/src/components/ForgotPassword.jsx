import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import startimg from "./images/start-img.jpg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/ForgotPassword.css'; // Import the CSS file for styling
import { forgotpassword } from '../API/endpoint';

const ForgotPassword = () => {
    
    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            toast.error("Email is Required");
        } else if (!emailRegex.test(email)) {
            toast.error("Invalid Email");
        } else {
            setIsLoading(true); // Set loading state to true
            try {
                const res = await forgotpassword({ email });
                if (res.status === 200) {
                    toast.success("Password reset email sent successfully");
                    setEmail("");
                } else if (res.status === 201) {
                    toast.error("Email not registered");
                }
            } catch (error) {
                if (error.response && error.response.status === 500) {
                    toast.error("Failed to send password reset email");
                } else {
                    console.error('Error:', error);
                }
            } finally {
                setIsLoading(false); // Reset loading state to false after API call completes
            }
        }
    };

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    return (
        <>
            <div className="main-page">
                <ToastContainer position="top-right" />
                <div className="left-half">
                    <img src={startimg} alt="" />
                </div>
                <div className="right-half">
                    <div className="form">
                        <h1>Forgot Password</h1>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                        />
                        <button onClick={handleSendMail} disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Email"}
                        </button>
                        <a href="/"><h5>Already have an account? Log in</h5></a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
