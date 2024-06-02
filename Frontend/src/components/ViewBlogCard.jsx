import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../css/ViewBlogCard.css";
import { useNavigate } from "react-router-dom";
import { fetchblogonclick, addCommentToPost, deleteCommentFromPost, editCommentFromBlog, fetchprofiledata, fetchCommentOwnersData } from "../API/endpoint";
import { deleteblog } from "../API/endpoint";
import { IoArrowBack } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import dp from "./images/dp.png";
import { BsThreeDotsVertical } from "react-icons/bs";

const ViewBlogCard = ({ userid }) => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [showcomment, setShowcomment] = useState([]);
    const [newComment, setNewComment] = useState(null);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [profiledata, setProfileData] = useState({});
    const [comment, setComment] = useState({
        text: "",
        owner: userid
    });
    const [owner, setowner] = useState()
    const [showtdotMenu, setShowTDotMenu] = useState({});
    const [commentOwners, setCommentOwners] = useState({});
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        setComment({text:"", owner: userid})
    }, []);

    const handleUpdate = () => {
        navigate(`/update-blog/${id}`);
    };

    const getOwner = async () => {
        try {
            if(blog){
                const res = await fetchprofiledata(blog.owner);
                setowner(res.data.user)
            }
        }
        catch (error) {
            console.error("Error fetching user ID:", error);
        }
    }

    useEffect(() => {
        getOwner()
    }, [blog]);

    const goBackHome = () => {
        navigate("/");
    };

    const handleDelete = async () => {
        try {
            await deleteblog(id);
            alert("Blog Deleted Successfully");
            navigate("/");
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowTDotMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetchblogonclick(id);
                setBlog(response.data);
                setShowcomment(response.data.comments.reverse());
                if(response.data.comments.length !== 0){
                    fetchCommentOwners(response.data.comments);
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };
        fetchBlog();
    }, [id, comment]);

    const fetchCommentOwners = async (comments) => {
        const userIds = comments.map((comment) => comment.owner);
        try {
            const response = await fetchCommentOwnersData(userIds.join(','));
            setCommentOwners(response.data);
        } catch (error) {
            console.error("Error fetching comment owners:", error);
        }
    };

    const getuserdata = async () => {
        try {
            const userData = await fetchprofiledata(userid);
            setProfileData(userData.data.user);
        }
        catch (error) {
            console.error("Error fetching user ID:", error);
        }
    };

    useEffect(() => {
        getuserdata()
    }, []);

    const toggleMenu = (commentId) => {
        setShowTDotMenu((prevState) => ({
            ...prevState,
            [commentId]: !prevState[commentId],
        }));
    };

    const isOwner = () => {
        return userid === blog.owner;
    };

    const isCommentOwner = (cOwner) => {
        return userid === cOwner;
    };

    const postComment = async () => {
        if (comment.text.trim() === "") {
            return;
        }
        try {
            await addCommentToPost(id, comment);
            setNewComment(comment); // Store the new comment
            setComment({...comment, text: "" });

            const response = await fetchblogonclick(id);
            setShowcomment([comment, ...response.data.comments.reverse()]); // Prepend the new comment

            // Trigger animation
            setShouldAnimate(true);

            // Reset animation after 1.5 seconds
            setTimeout(() => {
                setShouldAnimate(false);
            }, 1500);
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    const handleDeleteComment = async (selectedCommentId) => {
        try {
            // Set a flag for the comment being deleted
            setShowcomment((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === selectedCommentId
                        ? { ...comment, deleting: true }
                        : comment
                )
            );

            // Call the API to delete the comment
            await deleteCommentFromPost(id, selectedCommentId);

            // Filter out the deleted comment after a short delay
            setTimeout(() => {
                setShowcomment((prevComments) =>
                    prevComments.filter((comment) => comment._id !== selectedCommentId)
                );
            }, 500); // Adjust the delay time as needed
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleEditComment = async (selectedCommentId, newText) => {
        if (newText.trim() === "") {
            return;
        }
        try {
            await editCommentFromBlog(id, selectedCommentId, { text: newText });
            const updatedComments = showcomment.map((comment) => {
                if (comment._id === selectedCommentId) {
                    return { ...comment, text: newText };
                }
                return comment;
            });
            setShowcomment(updatedComments);
            setComment({ text: "" }); // Clear the input field after editing
            setEditingCommentId(null); // Reset editing state
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };

    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default behavior of form submission
            if (editingCommentId) {
                handleEditComment(editingCommentId, comment.text);
            } else {
                postComment(); // Call the postComment function
            }
        }
    };

    const formattedDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `(${day} ${months[monthIndex]}, ${year})`;
    };

    return (
        <>
            {blog && (
                <div className="cardsection d-flex justify-content-center align-items-centers">
                    <div className="cardholder" style={{ flexWrap: "wrap" }}>
                        <div className="back">
                            <IoArrowBack onClick={goBackHome} className="back-icon" />
                            <p>Back</p>
                        </div>
                        <div className="blog-image">
                            <div className="blog-pic">
                                <img src={`http://localhost:5000/${blog.image}`} alt="Blog" />
                            </div>

                            <div className="owner-details" style={{ height: "90px" }}>
                                <div className="owner-dp">
                                    <img src={owner && owner.profilephoto && `http://localhost:5000/${owner.profilephoto}`} alt="" />
                                </div>
                                <div className="owner-name">
                                    <p style={{ margin: 0 }}>{owner && owner.userName ? owner.userName : "Loading..."}</p>
                                    <p style={{ fontSize: 12, margin: 0, color: "gray" }}>Published on: {formattedDate(blog.date)}</p>
                                </div>

                                {isOwner() && <div className="blog-manage-options">
                                    <div className="Edit-icon">
                                        <FaEdit className="manage-icon" onClick={handleUpdate} />
                                        <p>Edit Blog</p>
                                    </div>
                                    <div className="Delete-icon">
                                        <MdDelete className="manage-icon" onClick={handleDelete} style={{ color: "brown" }} />
                                        <p>Delete Blog</p>
                                    </div>
                                </div>
                                }

                            </div>
                        </div>
                        <div className="blog-content">
                            <h2>Title : {blog.title}</h2>
                            <p><strong>Description :</strong> {blog.description.substring(0, 1200)}</p>
                        </div>
                        <div className="blog-content-overflow">
                            <p>{blog.description.substring(1200, 7000)}</p>
                        </div>
                    </div>

                    <div className="comment-section">
                        <h4 style={{ marginLeft: "6px", marginBottom: "10px" }}>Comment Section</h4>
                        <div className="post-comment">
                            <input
                                type="text"
                                id="write-comment"
                                placeholder="Add Comment"
                                value={comment.text}
                                onChange={(e) => setComment({ ...comment, text: e.target.value })}
                                onKeyDown={handleEnterKeyPress}
                                ref={inputRef} // Add ref to access input field
                            />
                            &nbsp;
                            <button onClick={editingCommentId ? () => handleEditComment(editingCommentId, comment.text) : postComment} id="submit-comment">
                                {editingCommentId ? 'Save comment' : 'Post comment'}
                            </button>
                        </div>
                        <div className="comment-scroll">
                            {showcomment.length === 0 ? (
                                <div className="default-no-comment">
                                    <h3 style={{ margin: '0px' }}>Be First To Comment !</h3>
                                </div>
                            ) : (
                                showcomment.map((c, index) => (
                                    <div
                                        className={`single-comment ${c.deleting ? "deleting-comment" : ""
                                            } ${shouldAnimate ? "slide-in" : ""} ${newComment === c ? "new-comment" : ""
                                            }`}
                                        key={c._id}
                                    >
                                        {/* <div className="profile-pic">
                                            {commentOwners.data && commentOwners.data.find(owner => owner._id === c.owner) ? (
                                                <img className="dp-img" src={`http://localhost:5000/${commentOwners.data.find(owner => owner._id === c.owner).profilephoto}`} alt="Profile" />
                                            ) : (
                                                <img className="dp-img" src={dp} alt="Profile" />
                                            )}
                                        </div> */}
                                        <div className="profile-pic">
                                            {commentOwners.data && commentOwners.data.find(owner => owner._id === c.owner) ? (
                                                <img className="dp-img" src={`http://localhost:5000/${commentOwners.data.find(owner => owner._id === c.owner).profilephoto}`} alt="Profile" />
                                            ) : (
                                                <img className="dp-img" src={dp} alt="Profile" />
                                            )}
                                        </div>

                                        <div className="comment-text">
                                            <h6> {c.text.length > 120 ? c.text.substring(0, 120) + "..." : c.text}</h6>
                                            {commentOwners.data && commentOwners.data.find(owner => owner._id === c.owner) ? (
                                                <p style={{ fontWeight: "normal" }}>{commentOwners.data.find(owner => owner._id === c.owner).userName} {formattedDate(c.createdAt)}</p>
                                            ) : (
                                                <p style={{ fontWeight: "normal" }}>Loading... {formattedDate(c.createdAt)}</p>
                                            )}

                                            {isCommentOwner(c.owner) && <BsThreeDotsVertical className="three-dots" onClick={() => toggleMenu(c._id)} />}
                                            {showtdotMenu[c._id] && (
                                                <div className="three-dots-menu" ref={menuRef}>
                                                    <ul>
                                                        <li onClick={() => handleDeleteComment(c._id)}>Delete Comment</li>
                                                        <li onClick={() => {
                                                            setEditingCommentId(c._id);
                                                            setComment({ text: c.text }); // Populate input field with comment text
                                                            inputRef.current.focus();
                                                            setShowTDotMenu({}); // Close the three dots menu
                                                        }}>Edit comment</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewBlogCard;
