import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ActivateAccount = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Activating your account...");
  const [error, setError] = useState("");

  useEffect(() => {
    const activate = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/auth/activate",
          { token }
        );
        setMessage(res.data.message);
      } catch (err) {
        setError(err.response?.data?.message || "Activation failed.");
      }
    };
    activate();
  }, [token]);

  return (
    <div className="activation-container">
      <h2>Account Activation</h2>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>{message}</p>}
    </div>
  );
};

export default ActivateAccount;
