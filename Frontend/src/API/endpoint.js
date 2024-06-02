import axios from "axios";

const token = localStorage.getItem("token");

// const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://chatterly-server.onrender.com";


const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    // "Content-Type": "application/json",
  },
});


export const authlogin = (logindata) => API.post( "/auth/login", logindata);
export const signup = (signupdata) => API.post("/auth/signup", signupdata);
export const changepassword = (formData) => API.post("/auth/changepassword", formData);
export const resetpassword = (email, formData) => API.post(`/auth/resetpassword/${email}`, formData);
export const createblog = (createblogdata) => API.post('/blog/create-blog',createblogdata)
export const fetchblogs = () => API.get('/blog/fetchblogs')
export const fetchblogonclick = (id) => API.get(`/blog/${id}`)
export const updateblog = (id, formDataToSend) => API.put(`/blog/updateblog/${id}`, formDataToSend);
export const deleteblog = (id) => API.delete(`/blog/deleteblog/${id}`); 

export const blogsearch = (keyword) => {return API.get(`/blog/blogsearch`, {params: {keyword: keyword}});};
export const filterBlogs = (selectedTitle, publishedDate) => {return API.get(`/blog/filterBlogs`, { params: { selectedTitle, publishedDate } });};

export const addCommentToPost = (id, commentdata) => API.post(`/blog/${id}/comment`, commentdata);
export const  deleteCommentFromPost = (blogid, commentid) => API.delete(`/blog/${blogid}/${commentid}`)
export const editCommentFromBlog = (blogid, commentid, newtext) => API.patch(`/blog/${blogid}/${commentid}`, newtext)

export const fetchprofiledata= (userID) => API.get(`/auth/profiledata/${userID}`)
export const fetchCommentOwnersData= (userIds) => API.get(`/auth/fetchCommentOwnersData?userIds=${userIds}`);
export const updateprofiledata= (userID, formData) => API.put(`/auth/updateprofiledata/${userID}`, formData)
export const updateprofilephoto= (userID, formData) => API.put(`/auth/updateprofilephoto/${userID}`, formData)

export const likeBlog =(id)=>API.post(`blog/${id}/like`)
export const unlikeBlog =(id)=>API.post(`blog/${id}/unlike`)

export const forgotpassword = (email) => API.post(`/auth/forgotpassword`, email);