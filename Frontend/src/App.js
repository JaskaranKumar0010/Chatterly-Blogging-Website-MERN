import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, matchPath } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateBlog from "./components/CreateBlog";
import UpdateBlog from "./components/UpdateBlog";
import ViewBlogCard from "./components/ViewBlogCard";
import ProfilePage from "./components/ProfilePage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ChangePassword from "./components/ChangePassword";
// import {Provider} from "react-redux";
// import { store } from "./Redux/store";

function App1() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userid, setUserID] = useState(null);

  const [hideHF, setHideHF] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setUserID(localStorage.getItem("userID"));
  }, [token]);

  useEffect(() => {
    if (token) {
      navigate(`/`);
    }
  }, [token]);

  useEffect(() => {
    const isProfilePage = location.pathname.includes("/profile-page");
    setHideHF(
      location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/forgotpassword" ||
        location.pathname === "/change-password" ||
        location.pathname.startsWith("/resetpassword/") || 
        isProfilePage
    );
  }, [location]);


  return (
    <>
      {hideHF == false && <Header id={userid} />}
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-blog" element={<CreateBlog userid={userid}/>} />
        <Route path="/view-blog-card/:id" element={<ViewBlogCard userid={userid} />} />
        <Route path="/update-blog/:id" element={<UpdateBlog />} />
        <Route path="/profile-page" element={<ProfilePage id={userid} />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword userid={userid} />} />
        <Route path="/resetpassword/:email" element={<ResetPassword />} />
      </Routes>
      {hideHF == false && <Footer />}
    </>
  );
}
function App() {
  return (
    // <Provider store={store}>
      <BrowserRouter>
        <App1></App1>
      </BrowserRouter>
      // </Provider>
  );
}

export default App;
