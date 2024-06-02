import { useEffect, useState, useRef } from 'react';
import '../css/Header.css';
import { useNavigate } from 'react-router-dom';
import { fetchprofiledata } from '../API/endpoint';
import dp from "./images/dp.png";
import mainlogo from "./images/main-logo.png";
import SigningOutPrompt from './SigningOutPrompt';

const Header = ({ id }) => {
  const navigate = useNavigate();
  const [showusermenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const [profiledata, setProfileData] = useState({});
  const [token, setToken] = useState(null);

  const [isSigningOut, setisSigningOut] = useState(false);


  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token])

  const handleSignout = () => {
    setisSigningOut(true);

    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userID');
      setProfileData({}); // Clear profile data
      setToken(null); // Clear token
      setShowUserMenu(false); // Close user menu if open
      setisSigningOut(false);
      navigate('/'); // Navigate to home page
    }, 500);
  };

  const onLogoClick = () => {
    navigate('/');
  };

  const gotoChangePassword = () => {
    navigate('/change-password');
  };

  const handleProfile = () => {
    navigate(`/profile-page`);
  };

  const toggleMenu = () => {
    setShowUserMenu(prevState => !prevState); // Toggle the state value
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getdata = async () => {
    if (id) {
      try {
        const userData = await fetchprofiledata(id);
        setProfileData(userData.data.user);
      }
      catch (error) {
        console.error("Error fetching user ID:", error);
      }
    }
  };

  useEffect(() => {
    getdata();
  }, [id]);

  return (
    <>
      <div className="header">
        <div className="upper-section">
          <div className="upper-section-left" onClick={onLogoClick}>
            <img src={mainlogo} alt="" />
          </div>
          {token ? (
            <div className="upper-section-right">
              <div className="profile">
                <img className="profile-img" src={`http://localhost:5000/${profiledata.profilephoto || dp}`} alt="" />
              </div>
              <div className="name" onClick={toggleMenu}>
                {profiledata.userName}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={14}
                  height={12}
                  fill="black"
                  style={{ marginLeft: 2 }}
                  className="bi bi-caret-down-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                </svg>
                {showusermenu && (
                  <div className="user-menu" ref={menuRef}>
                    <ul>
                      <li onClick={handleProfile}>My Profile</li>
                      <li onClick={gotoChangePassword}>Change Password</li>
                      <li onClick={handleSignout}>Sign Out</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="upper-section-right create-blog-button-container">
              <button className="btn" onClick={() => navigate('/login')}>Log In / Sign Up</button>
            </div>
          )}
        </div>
      </div>


      {isSigningOut && <SigningOutPrompt />}

    </>
  );
};

export default Header;
