import React, { useState } from 'react';
import '../css/ForgotPassword.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changepassword } from '../API/endpoint';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const ChangePassword = ({ userid }) => {

    const navigate = useNavigate()
    const [formdata, setFormData] = useState({
        userId: userid,
        currentpassword: "",
        newpassword: "",
        confirmnewpassword: ""
    });
    const [errors, setErrors] = useState()

    const handleChangePassword = async () => {
        const newErrors = {};

        if (!formdata.currentpassword.trim()) {
            newErrors.currentpassword = "Current Password is Required";
        }
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

        try {
            const res = await changepassword(formdata);
            if (res.status === 200) {
                toast.success("Password updated successfully");
                setFormData({
                    ...formdata,
                    currentpassword: "",
                    newpassword: "",
                    confirmnewpassword: ""
                })
            }
            else if (res.status === 201) {
                toast.error("You entered incorrect current password");
            }
            else if (res.status === 202) {
                toast.error("New passwords do not match");
            }
            else if (res.status === 203) {
                toast.error("New password can't be same as current password");
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const gotoHomepage = () => {
        navigate('/');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formdata, [e.target.name]: e.target.value });
    };

    const setShowPassword = () => {
        var x = document.getElementById("currentpassword");
        var y = document.getElementById("newpassword");
        var z = document.getElementById("confirmnewpassword");
        if ((x.type && y.type && z.type) === "password") {
            x.type = "text";
            y.type = "text";
            z.type = "text";
        } else {
            x.type = "password";
            y.type = "password";
            z.type = "password";
        }
    };

    return (
        <>
            <div className="cardsection d-flex justify-content-center align-items-centers">
                <div className="profile-header">
                    <div className="body-text">
                        <h2>Change Password</h2>
                        <div className="create-blog-button-container">
                            <button onClick={gotoHomepage} className="btn">
                                Go to Homepage
                            </button>
                        </div>
                    </div>
                </div>
                <div className="cardholder" style={{ flexWrap: "wrap" }}>
                    <ToastContainer style={{ marginTop: "60px" }}></ToastContainer>
                    <div className="forgot-password-container" >
                        {/* <h2>Change Password</h2> */}
                        <div className="form-group" style={{ marginBottom: "10px" }}>
                            <label style={{ marginBottom: "7px" }}>Current Password</label>
                            <input
                                type="password"
                                id="currentpassword"
                                name="currentpassword"
                                value={formdata.currentpassword}
                                onChange={handleInputChange}
                                placeholder="Enter current password"
                                required
                            />
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
                        <button onClick={handleChangePassword} className="submit-btn">Update Password</button>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ChangePassword;
