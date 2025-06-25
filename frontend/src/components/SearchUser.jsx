import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // ✅ Needed for outside click detection

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `http://localhost:8000/api/user/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResults(res.data.users);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleSelect = (userId) => {
    setQuery("");
    setResults([]);
    navigate(`/user/${userId}`);
  };

  // ✅ Hide dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ margin: "20px", position: "relative" }} ref={dropdownRef}>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "8px", width: "250px", borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{ padding: "8px 12px", borderRadius: 4, border: "none", backgroundColor: "#4f46e5", color: "#fff" }}
        >
          Search
        </button>
      </form>

      {results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "10px",
            marginTop: "4px",
            zIndex: 999,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {results.map((user) => (
            <p
              key={user._id}
              onClick={() => handleSelect(user._id)}
              style={{ cursor: "pointer", color: "#4f46e5", margin: "8px 0" }}
            >
              {user.name} ({user.email})
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
