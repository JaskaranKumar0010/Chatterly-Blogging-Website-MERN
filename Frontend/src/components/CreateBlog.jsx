import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/CreateBlog.css';
import { createblog } from "../API/endpoint";
import { MdDelete } from "react-icons/md";

const CreateBlog = ({ userid }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    owner: userid
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const gotoHomepage = () => {
    navigate('/');
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
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('owner', formData.owner);

        // Only append image data if uploaded by the user
        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }

        const res = await createblog(formDataToSend);
        if (res.status === 200) {
          alert("Blog Posted Successfully");
          navigate('/');
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
    const file = e.target.files[0]; // Get the first file from the input
    setFormData({ ...formData, image: file }); // Set the file object in formData
  };

  const handleClearImage = () => {
    setFormData({ ...formData, image: null });
    document.getElementById('imageInput').value = '';
  };


  return (
    <div className="card-section d-flex justify-content-center align-items-centers">
      <div className="body-text">
        <h2>Create Your Own Blog</h2>
        <div className="create-blog-button-container">
          <button onClick={gotoHomepage} className="btn">Go to Home Page</button>
        </div>
      </div>

      <div className="card-holder">
        <div className="row" style={{ justifyContent: "center", width: "100%", flexWrap: "wrap" }}>
          <div className="form">
            <input
              type="text"
              id=""
              placeholder="Blog Title"
              value={formData.title}
              onChange={(e) => {
                setErrors({ ...errors, title: '' });
                setFormData({ ...formData, title: e.target.value });
              }}
            />
            {errors.title && <div className="error-container"><span>{errors.title}</span></div>}


            <textarea style={{ marginTop: "10px" }}
              id=""
              cols="40"
              rows="3"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => {
                setErrors({ ...errors, description: '' });
                setFormData({ ...formData, description: e.target.value });
              }}
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
                {formData.image ? formData.image.name : "Choose a file"}
              </label>
              {formData.image && (
                <span onClick={handleClearImage} className="delete-icon">
                  <MdDelete style={{ width: "25px", height: "25px", color: "white" }} />
                </span>
              )}
            </div>




            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
