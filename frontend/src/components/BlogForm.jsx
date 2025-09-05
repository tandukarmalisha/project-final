

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";



const BlogForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    image: null,
    content: "",
    categories: "",
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });

      if (file) {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    let imageUrl = "";

    try {
      if (form.image) {
        const imgData = new FormData();
        imgData.append("image", form.image);

        const uploadRes = await axios.post(
          "http://localhost:8000/api/upload",
          imgData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageUrl = uploadRes.data.imageUrl;
      }

      const res = await axios.post(
        "http://localhost:8000/api/blog",
        {
          title: form.title,
          image: imageUrl,
          content: form.content,
          categories: [form.categories],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    toast.success("✅ Blog published successfully!");
    navigate("/profile");
      console.log(res.data);

      setForm({
        title: "",
        image: null,
        content: "",
        categories: "",
      });
      setPreview(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
    toast.error("❌ Something went wrong while publishing!");
    }
  };

  // Inline styles
  const styles = {
    formContainer: {
      maxWidth: 950,
      margin: " auto",
      padding: "28px",
      borderRadius: "20px",
      background: "linear-gradient(145deg, #ffffff 60%, #f1f5f9)",
      boxShadow:
        "0 8px 30px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.6)",
      fontFamily: "'Inter', sans-serif",
    },
    flexRow: {
      display: "flex",
      gap: "32px",
      alignItems: "flex-start",
    },
    leftSide: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      fontSize: "15px",
      background: "rgba(255,255,255,0.9)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
    },
    textarea: {
      width: "100%",
      height: 220,
      padding: "14px 16px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      resize: "none",
      fontSize: "15px",
      background: "rgba(255,255,255,0.9)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      fontSize: "15px",
      background: "rgba(255,255,255,0.9)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
    },
    button: {
      padding: "14px 0",
      background:
        "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
      color: "#fff",
      fontSize: "17px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      letterSpacing: "0.5px",
      boxShadow: "0 6px 16px rgba(37,99,235,0.35)",
      transition: "all 0.3s ease",
    },
    buttonHover: {
      background:
        "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(37,99,235,0.45)",
    },
    previewWrapper: {
      width: 260,
      height: 220,
      borderRadius: "16px",
      padding: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(135deg, #f8fafc, #e2e8f0)",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      boxShadow:
        "inset 0 2px 8px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
    },
    previewImage: {
      maxWidth: "100%",
      maxHeight: "100%",
      borderRadius: "12px",
      objectFit: "cover",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    previewText: {
      color: "#64748b",
      fontStyle: "italic",
      textAlign: "center",
      fontSize: 14,
    },
  };



  return (
    <form style={styles.formContainer} onSubmit={handleSubmit}>
      <div style={styles.flexRow}>
        <div style={styles.leftSide}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <select
            name="categories"
            value={form.categories}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Technology">Technology</option>
            <option value="Programming">Programming</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Music">Music</option>
            <option value="Movies">Movies</option>
            <option value="Sports">Sports</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Nature">Nature</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Bollywood">Bollywood</option>
            <option value="Fashion">Fashion</option>
            <option value="Personal">Personal</option>
            <option value="News">News</option>
          </select>

          <textarea
            name="content"
            placeholder="Write your blog content here..."
            value={form.content}
            onChange={handleChange}
            required
            style={styles.textarea}
          ></textarea>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            color="#fff"
          >
            Publish Blog
          </button>
        </div>

        <div style={styles.previewWrapper}>
          {preview ? (
            <img
              src={preview}
              alt="Selected preview"
              style={styles.previewImage}
            />
          ) : (
            <p style={styles.previewText}>Image preview will appear here</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
