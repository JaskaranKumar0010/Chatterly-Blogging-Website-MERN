import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/ProfilePage.css'
import Footer from "./Footer";
import { fetchprofiledata, updateprofiledata, updateprofilephoto } from "../API/endpoint";


const ProfilePage = ({ id }) => {

    const navigate = useNavigate();
    const [profiledata, setProfileData] = useState({
        userName: "",
        email: "",
        phonenumber: "",
        address: "",
        profilephoto: ""
    })

    const [profilepic, setProfilepic] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showList, setList] = useState(false);

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const cancelEditProfile = () => {
        setIsEditing(false);
    };

    const gotoHomepage = () => {
        navigate('/');
    };

    const getuserdata = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const userData = await fetchprofiledata(id)
                setProfileData(userData.data.user)
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
    };

    useEffect(() => {
        getuserdata();
    }, [id]);

    const updateProfilePhoto = async () => {
    
        if(profilepic == null){
            alert('Please select any picture to upload')
            return
        }

        const formData = new FormData();
        formData.append("profilephoto", profilepic);
    
        try {
            await updateprofilephoto(id, formData);
            getuserdata();
            setList(!showList);
            setProfilepic(null)
            alert("Profile photo is updated");
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateProfileData = async () => {
        try {
            await updateprofiledata(id, profiledata)
            alert("Profile Details updated successfully")
            getuserdata()
            setIsEditing(false)
        } catch (err) {
            console.log(err)
        }
    }

    const toggleList = () => {
        setList(!showList);
    };

    const cancelUpdatePhoto = () => {
        setList(!showList);
    };

    return (
        <>
            <div className="profile-header">
                <div className="body-text">
                    <h2>User Profile</h2>
                    <div className="create-blog-button-container">
                        <button onClick={gotoHomepage} className="btn">
                            Go to Homepage
                        </button>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-image">
                    <img src={`http://localhost:5000/${profiledata.profilephoto}`} alt="Profile" />
                    {!showList &&
                        <div className="create-blog-button-container">
                            <button
                                className="btn"
                                style={{ marginTop: "20px", width: "100%", justifyContent: "center" }}
                                onClick={toggleList}
                            >
                                Update Picture
                            </button>
                        </div>}

                    {showList && <div className="fileupload">
                        <input
                            type="file"
                            onChange={(e) => setProfilepic(e.target.files[0])}
                            style={{
                                marginTop: "20px",
                                width: "100%",
                                padding: "10px",
                                fontSize: "16px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                justifyContent: "center"
                            }}
                        />
                        < div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div className="create-blog-button-container" style={{ marginTop: "20px", width: "58%", justifyContent: "center" }}>
                                <button
                                    className="btn"
                                    onClick={updateProfilePhoto}
                                >
                                    Save Picture
                                </button>
                            </div >
                            <div className="create-blog-button-container" style={{ marginTop: "20px", width: "38%", justifyContent: "center" }}>
                                <button
                                    className="btn"
                                    onClick={cancelUpdatePhoto}
                                >
                                    Cancel
                                </button>
                            </div >
                        </div >
                    </div>}
                </div>




                {isEditing && (
                    <div className="profile-details">

                        <div className="profile-detail-item">
                            <p className='editingenabledlabel'>Username : </p>
                            <input
                                type="text"
                                value={profiledata.userName}
                                onChange={(e) => setProfileData({ ...profiledata, userName: e.target.value })}
                            />
                        </div>

                        <div className="profile-detail-item">
                            <p className='editingenabledlabel'>Email : </p>
                            <input
                                type="email"
                                value={profiledata.email}
                                onChange={(e) => setProfileData({ ...profiledata, email: e.target.value })}
                            />
                        </div>

                        <div className="profile-detail-item">
                            <p className='editingenabledlabel'>Phone No. : </p>
                            <input
                                type="tel"
                                value={profiledata.phonenumber}
                                onChange={(e) => setProfileData({ ...profiledata, phonenumber: e.target.value })}
                            />
                        </div>

                        <div className="profile-detail-item">
                            <p className='editingenabledlabel'>Address : </p>
                            <input
                                type="text"
                                value={profiledata.address}
                                onChange={(e) => setProfileData({ ...profiledata, address: e.target.value })}
                            />
                        </div>
                        <div className="editing-btns">
                            <div className="create-blog-button-container" style={{ marginRight: "12px" }}>
                                <button className='btn' onClick={() => updateProfileData()}>Save</button>
                            </ div>
                            <div className="create-blog-button-container">
                                <button className='btn' onClick={() => cancelEditProfile()}>Cancel</button>
                            </ div>
                        </div>
                    </ div>
                )}
                {!isEditing && (
                    <div className="profile-details">
                        <p>Username : {profiledata.userName}</p>
                        <p>Email : {profiledata.email}</p>
                        <p>Phone No. : {profiledata.phonenumber}</p>
                        <p>Address : {profiledata.address}</p>
                        <div className="create-blog-button-container">
                            <button className="btn" onClick={handleEditProfile}>Edit Profile</button>
                        </div>
                    </div>
                )}


            </div>

            <Footer></Footer>
        </>
    )
}

export default ProfilePage