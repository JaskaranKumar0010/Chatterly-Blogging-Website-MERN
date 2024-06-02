import { useState } from "react";
import { useNavigate } from "react-router-dom";
import startimg from "./images/start-img.jpg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authlogin } from "../API/endpoint";
import LoggingInPrompt from "./LoggingInPrompt";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isLoggingIn, setisLoggingIn] = useState(false);

    const handleLogin = async () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) {
            newErrors.email = "Email is Required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid Email";
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password is Required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Object.values(newErrors).forEach(error => {
                toast.error(error); // Display error as toast notification
            });
            return;

        }
        try {
            const res = await authlogin(formData);
            if (res.status === 200) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userID', res.data.existinguser._id);
                setisLoggingIn(true);
                setTimeout(() => {
                    setisLoggingIn(false);
                    navigate('/')
                }, 1000);
            }
            else if (res.status === 204) {
                toast.error("User doesn't exist");
            } else if (res.status === 201) {
                toast.error("Invalid password");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const setShowPassword = () => {
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }

    return (
        <>
            <div className="main-page">
                <ToastContainer position="top-left" />
                <div className="left-half">
                    <img src={startimg} alt="" />
                </div>
                <div className="right-half">
                    <div className="form">
                        <h1>Login</h1>
                        <input
                            type="text"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => {
                                setErrors({ ...errors, email: '' });
                                setFormData({ ...formData, email: e.target.value });
                            }}
                        />


                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => {
                                setErrors({ ...errors, password: '' });
                                setFormData({ ...formData, password: e.target.value });
                            }}
                        />

                        <div className="checkbox">
                            <input type="checkbox" onClick={() => setShowPassword()} /> Show Password
                        </div>

                        <button onClick={handleLogin}>LOG IN</button>
                        <a href="/forgotpassword"><h5>Forgot Password?</h5></a>
                        <a href="/signup"><h5>Don't have an account? Sign up</h5></a>
                    </div>
                </div>
            </div>

            {isLoggingIn && <LoggingInPrompt />}
        </>
    )
}

export default Login