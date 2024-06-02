import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../css/CreateBlog.css';
import { MdDelete } from "react-icons/md";
import { fetchblogonclick, updateblog } from "../API/endpoint";

const UpdateBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: null
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await fetchblogonclick(id);
                const blogData = response.data;
                const originalFileName = extractOriginalFileName(blogData.image);

                setFormData({
                    title: blogData.title,
                    description: blogData.description,
                    image: blogData.image,  // Assuming you don't want to update the image by default
                    imgname: originalFileName

                });

            } catch (error) {
                console.error("Error fetching blog data:", error);
            }
        };

        fetchBlogData();
    }, [id]);

    const extractOriginalFileName = (storedFileName) => {
        const OriginalFileName = storedFileName;
        if (OriginalFileName.startsWith('./images/default_card_thumbnail/default_card-thumbnail')) {
            return "Default Thumbnail";
        }
        else {
            const parts = OriginalFileName.split('\\').pop();
            return parts.slice(14);
        }

    };

    const cancelupdation = () => {
        navigate(`/view-blog-card/${id}`);
    };

    const handleSubmit = async () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is Required";
        }
        if (!formData.description.trim()) {
            newErrors.description = "Description is Required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const formDataToSend = new FormData();
                formDataToSend.append("title", formData.title);
                formDataToSend.append("description", formData.description);
                formDataToSend.append("image", formData.image); // Append the image file

                const res = await updateblog(id, formDataToSend); // Send formDataToSend instead of updatedFormData
                if (res.status === 200) {
                    alert("Blog Updated Successfully");
                    navigate('/home');
                }
            } catch (error) {
                if (error.response && error.response.status === 500) {
                    alert("Internal Server Error");
                } else {
                    console.error('Error:', error);
                }
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file, imgname: file ? file.name : null });
    };

    const handleClearImage = () => {
        setFormData({ ...formData, image: null });
        document.getElementById('imageInput').value = '';
    };

    return (
        <div className="card-section d-flex justify-content-center align-items-centers">
            <div className="body-text">
                <h2>Update Your Blog</h2>
                <div className="create-blog-button-container">
                    <button onClick={cancelupdation} className="btn">Cancel</button>
                </div>
            </div>

            <div className="card-holder">
                <div className="row" style={{ justifyContent: "center", width: "100%", flexWrap: "wrap" }}>
                    <div className="form">
                        <input
                            type="text"
                            placeholder="Blog Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        {errors.title && <div className="error-container"><span>{errors.title}</span></div>}

                        <textarea
                            cols="40"
                            rows="3"
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        {errors.description && <div className="error-container"><span>{errors.description}</span></div>}

                        <div className="file-input-wrapper">
                            <input
                                id="imageInput"
                                className="imgupload"
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="imageInput" className={formData.image ? "chosen" : ""}>
                                {formData.image ? formData.imgname : "Choose a file"}
                            </label>
                            {formData.image && (
                                <span onClick={handleClearImage} className="delete-icon">
                                    <MdDelete style={{ width: "25px", height: "25px", color: "white" }} />
                                </span>
                            )}
                        </div>

                        <button onClick={handleSubmit}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBlog