
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/login.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await API.post("/user/register", form);

      if (response.data.success) {
        setSuccess("Registration successful! Please login.");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setError(response.data.message);
      }

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>SmartCommerce</h1>

        <h2>Create Account</h2>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        {success && (
          <p className="register-success">
            {success}
          </p>
        )}

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">
              User
            </option>

            <option value="seller">
              Seller
            </option>

            <option value="admin">
              Admin
            </option>
          </select>

          <button type="submit">
            Create Account
          </button>

        </form>

        <p className="register-link">
          Already registered?{" "}
          <span onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>

      </div>

    </div>
  );
}

export default Register;

