import React, { useState } from 'react';
import '../css/ForgotPassword.css'; // Import the CSS file for styling
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetpassword } from '../API/endpoint';

const ResetPassword = () => {
    const { email } = useParams();
    const navigate = useNavigate()
    const [formdata, setFormData] = useState({
        newpassword: "",
        confirmnewpassword: "",
    });
    const [errors, setErrors] = useState()
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        const newErrors = {};

        if (!formdata.newpassword.trim()) {
            newErrors.newpassword = "New Password is Required";
        }
        if (!formdata.confirmnewpassword.trim()) {
            newErrors.confirmnewpassword = "Confirm Password is Required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Object.values(newErrors).forEach(error => {
                toast.error(error);
            });
            return;
        }

        else {
            setIsLoading(true)
            try {
                const res = await resetpassword(email, formdata);
                if (res.status === 200) {
                    toast.success("Password updated successfully");
                    setTimeout(() => {
                        navigate('/');
                    }, 2000); // Navigate after 2 seconds
                }
                else if (res.status === 201) {
                    toast.error("New passwords do not match");
                }

            } catch (error) {
                console.error('Error:', error);
            }
            finally {
                setIsLoading(false); // Reset loading state to false after API call completes
            }
        }
    }

    const cancelPaswordReset = () => {
        navigate('/')
    }

    const handleInputChange = (e) => {
        setFormData({ ...formdata, [e.target.name]: e.target.value });
    };

    const setShowPassword = () => {
        var x = document.getElementById("newpassword");
        var y = document.getElementById("confirmnewpassword");
        if ((x.type && y.type) === "password") {
            x.type = "text";
            y.type = "text";
        } else {
            x.type = "password";
            y.type = "password";
        }
    };

    return (
        <div className="cardsection d-flex justify-content-center align-items-centers">
            <div className="profile-header">
                <div className="body-text">
                    <h2>Reset Password</h2>
                    <div className="create-blog-button-container">
                        <button onClick={cancelPaswordReset} className="btn">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            <div className="cardholder" style={{ flexWrap: "wrap" }}>
                <ToastContainer style={{ marginTop: "30px" }}></ToastContainer>
                <div className="forgot-password-container" >
                    {/* <h2>Change Password</h2> */}
                    <div className="form-group" style={{ marginBottom: "10px" }}>
                        <label style={{ marginBottom: "7px" }}>New Password</label>
                        <input
                            type="password"
                            id="newpassword"
                            name="newpassword"
                            value={formdata.newpassword}
                            onChange={handleInputChange}
                            placeholder="Enter new password"
                            required
                        />
                        <label style={{ marginBottom: "7px" }}>Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmnewpassword"
                            name="confirmnewpassword"
                            value={formdata.confirmnewpassword}
                            onChange={handleInputChange}
                            placeholder="Re-enter new password"
                            required
                        />

                    </div>
                    <div className="checkbox" style={{ margin: "0px 0px 10px 10px" }}>
                        <input type="checkbox" onClick={() => setShowPassword()} /> Show Password
                    </div>
                    {/* <button onClick={handleResetPassword} >Update Password</button> */}
                    <button onClick={handleResetPassword} className="submit-btn" disabled={isLoading}>{isLoading ? "Updating Password..." : "Update Password"}
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ResetPassword;
