import React, { useState } from "react";
import './HospitalDashboard.css';


const SignUpModal = ({ onClose, onSignUpSubmit, hospitalName }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let errors = {};
  
    if (!formData.name.trim()) errors.name = "Name is required";
  
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!formData.email.includes("@") ) {
      errors.email = "Invalid email format";
    }
  
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
  
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    const requestData = { ...formData, hospitalName }; 
    console.log(requestData); 
    console.log(hospitalName);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_CMS_APP_URL}/cms/api/users/signup`,
        requestOptions
      );
      const result = await response.json();

      if (response.ok) {
        console.log("Signup Successful:", result);
        onSignUpSubmit(requestData); // Send merged data
        onClose();
      } else {
        console.error("Signup Failed:", result);
        alert(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="POC (Point of Contact)"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="actions">
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="backdrop"></div>
    </>
  );
};

export default SignUpModal;
