import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const debounceTimeout = useRef(null);

  const fetchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `http://localhost:8000/api/user/search?query=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data.users.slice(0, 4)); // LIMIT TO 8 USERS
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => fetchUsers(value), 300);
  };

  const handleSelect = (userId) => {
    setQuery("");
    setResults([]);
    navigate(`/user/${userId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      style={{ position: "relative", width: "360px", marginRight: "1rem" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#f3f4f6",
          borderRadius: "9999px",
          padding: "0.4rem 0.8rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          height: "36px",
        }}
      >
        <FaSearch style={{ color: "#6b7280", marginRight: "8px" }} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search users..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            flex: 1,
            fontSize: "0.95rem",
            color: "#374151",
            height: "100%", // match input height to container
            paddingTop: "29px",
          }}
        />
      </div>

      {results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            maxHeight: "280px",
            overflowY: "auto",
            zIndex: 1000,
            padding: "0.5rem 0",
            animation: "fadeIn 0.15s ease-in-out",
          }}
        >
          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelect(user._id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                padding: "0.6rem 1rem",
                cursor: "pointer",
                transition: "all 0.2s",
                borderRadius: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fafb";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    color: "#111827",
                  }}
                >
                  {user.name}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "#6b7280",
                  }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from {opacity: 0; transform: translateY(-5px);}
            to {opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default SearchUser;
