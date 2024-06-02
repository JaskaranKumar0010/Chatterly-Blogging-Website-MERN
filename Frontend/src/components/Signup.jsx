import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import startimg from "./images/start-img.jpg"
import { signup } from "../API/endpoint";

const Signup = () => {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSignup = async () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.userName.trim()) {
            newErrors.userName = "Username is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is Required";
        }
        else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid Email";
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm Password is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Object.values(newErrors).forEach(error => {
                toast.error(error); // Display error as toast notification
            });
            return;
        }

        try {
            const res = await signup(formData);
            if (res.status === 200) {
                navigate('/');
                toast.success("Signup Successful");
                
            }
            else if (res.status === 204) {
                toast.error("User already exist");
            } else if (res.status === 201) {
                toast.error("Passwords do not match");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleInputChange = (e) => {
        setErrors({ ...errors, [e.target.name]: '' });
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const setShowPassword = () => {
        var x = document.getElementById("password");
        var y = document.getElementById("confirmpassword");
        if ((x.type && y.type) === "password") {
            x.type = "text";
            y.type = "text";
        } else {
            x.type = "password";
            y.type = "password";
        }
    };

    return (
        <>
            <div className="main-page">
                <ToastContainer position="top-left" />
                <div className="left-half">
                    <img src={startimg} alt="" />
                </div>
                <div className="right-half">
                    <div className="form">
                        <h1>Sign Up</h1>
                        <input
                            type="text"
                            placeholder="Username"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                        />

                        <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />

                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />

                        <input
                            type="password"
                            id="confirmpassword"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />

                        <div className="checkbox">
                            <input type="checkbox" onClick={() => setShowPassword()} /> Show Password
                        </div>

                        <button onClick={handleSignup}>SIGN UP</button>
                        <a href="/login"><h5>Already have an account? Log in</h5></a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;

