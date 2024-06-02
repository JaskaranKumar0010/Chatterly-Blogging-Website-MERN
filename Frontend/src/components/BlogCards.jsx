import dp from "./images/dp.png";
import '../css/BlogCards.css'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import FilterBar from './FilterBar'
import LogInPrompt from "./LogInPrompt";
import '../css/Pagination.css'
import { FaCommentDots } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
import { fetchblogs, fetchprofiledata, likeBlog, unlikeBlog } from "../API/endpoint";
// import { getBlogs } from "../Redux/actions/blog";
import { Bars } from "react-loader-spinner";


const BlogCards = () => {

    const navigate = useNavigate();
    // const dispatch = useDispatch();
    // const { allblogs, loading, error } = useSelector((state) => state.blogs)
    const [blogs, setBlogs] = useState([])
    // const [blogs, setBlogs] = useState([allblogs])
    const [profiles, setProfiles] = useState({});
    const [likedBlogs, setLikedBlogs] = useState([]);
    const [showLogInPrompt, setShowLogInPrompt] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [token, setToken] = useState(1);

    const blogsPerPage = 9;

    const totalPages = Math.ceil(blogs.length / blogsPerPage);


    const handleCreateBlogClick = () => {
        if (!token) {
            setShowLogInPrompt(true);
        } else {
            navigate("/create-blog");
        }
    };

    const handleCardClick = (blogId) => {
        if (!token) {
            setShowLogInPrompt(true);
        } else {
            navigate(`/view-blog-card/${blogId}`);
        }
    };

    const getBlogs = async () => {
        try {
            const response = await fetchblogs();
            setBlogs(response.data)
        }
        catch (error) {
            console.error("Error fetching blogs:", error);
        }
    }

    const getProfileData = async (ownerId) => {
        try {
            if (!profiles[ownerId]) {
                const response = await fetchprofiledata(ownerId);
                setProfiles(prev => ({ ...prev, [ownerId]: response.data.user }));
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        getBlogs()
    }, []);

    useEffect(() => {
        blogs.forEach(blog => getProfileData(blog.owner));
    }, [blogs]);


    // Function to handle liking a blog
    const handleLike = async (blogId) => {
        if (!token) {
            setShowLogInPrompt(true);
        } else {
        try {
            // Check if the blog is already liked by the user
            if (likedBlogs.includes(blogId)) {
                console.log('Blog already liked');
                return; // Exit the function if the blog is already liked
            }
            // Make API request to like the blog
            await likeBlog(blogId);
            // Update likedBlogs state to reflect the like
            setLikedBlogs((prevLikedBlogs) => [...prevLikedBlogs, blogId]);
        } catch (error) {
            console.error('Error liking blog:', error);
        }
    }
    };

    // Function to handle unliking a blog
    const handleUnlike = async (blogId) => {
        try {
            // Make API request to unlike the blog
            await unlikeBlog(blogId);
            // Update likedBlogs state to reflect the unlike
            setLikedBlogs((prevLikedBlogs) => prevLikedBlogs.filter((id) => id !== blogId));
        } catch (error) {
            console.error('Error unliking blog:', error);
        }
    };

    // useEffect(() => {
    //     setBlogs(allblogs);
    // }, [allblogs]);

    // useEffect(() => {
    //     dispatch(getBlogs());
    // }, []);


    const handleSearch = (filteredBlogs) => {
        setBlogs(filteredBlogs);
    };

    const formattedDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${day} ${months[monthIndex]} ${year}`;
    };

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <FilterBar allblogs={blogs} onSearch={handleSearch} />
            {/* <FilterBar /> */}
            <div className="card-section d-flex justify-content-center align-items-centers">
                <div className="body-text">
                    <h2>Blog Posts</h2>
                    <div className="create-blog-button-container">
                        <button onClick={handleCreateBlogClick} className="btn">
                            Create Blog
                        </button>
                    </div>
                </div>
                {/* Card Holder */}
                <div className="card-holder">
                    <div className="row" style={{ justifyContent: "space-evenly", width: "100%", flexWrap: "wrap" }}>
                        {/* Card */}
                        {(blogs.length == '0') && (
                            <div className="default-no-blog">
                                <Bars
                                    height="100"
                                    width="100"
                                    color="#2596be"
                                    ariaLabel="bars-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                />
                            </div>
                        )}
                        {currentBlogs.map((blog, _id) => {
                                const profile = profiles[blog.owner] || {};
                                return (
                                    <div className="card" style={{ width: "18rem" }} key={_id}>

                                        <div className="Link" onClick={() => handleCardClick(blog._id)} >
                                            <div className="card-image">
                                                <img src={`https://chatterly-server.onrender.com/${blog.image}`} alt="Card Image" />
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-text">
                                                    {blog.title.length > 22 ? blog.title.substring(0, 22) + "..." : blog.title}
                                                </h5>
                                                <p className="card-text">
                                                    {blog.description && blog.description.length > 60 ? blog.description.substring(0, 57) + "..." : blog.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            <div className="cf-dp">
                                                <img src={profile.profilephoto ? `http://localhost:5000/${profile.profilephoto}` : dp} alt="" />
                                            </div>
                                            <div className="cf-name">
                                                <p style={{ margin: 0 }}>{profile.userName || "Loading..."}</p>
                                                <p style={{ fontSize: 12, margin: 0, color: "gray" }}>{formattedDate(blog.date)}</p>
                                            </div>
                                            <div className="heart-icon" style={{ minWidth: 30, color: likedBlogs.includes(blog._id) ? 'red' : '#A5A5A5' }}>
                                                {/* Render heart icon with like count */}
                                                <FaHeart onClick={() => (likedBlogs.includes(blog._id) ? handleUnlike(blog._id) : handleLike(blog._id))} />
                                                <label htmlFor="" style={{ fontSize: 11, color: '#A5A5A5' }}>
                                                    &nbsp;{blog.likes}
                                                </label>
                                            </div>
                                            <div className="comment-icon footer-icons" style={{ minWidth: 25, color: "#A5A5A5" }}>
                                                <FaCommentDots />&nbsp;
                                                <label htmlFor="" style={{ fontSize: 11, color: "#A5A5A5" }}>{blog.comments.length}</label>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev.
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <span id="page-number"
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={currentPage === i + 1 ? "active" : ""}
                            >
                                {i + 1}
                            </span>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>


                </div>
            </div>
            {showLogInPrompt && <LogInPrompt onClose={() => setShowLogInPrompt(false)} />}
        </>
    );
};

export default BlogCards;
