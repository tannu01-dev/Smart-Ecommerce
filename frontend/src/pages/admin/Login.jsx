import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/user/login", {
        email: email,
        password: password
      });

      const data = response.data;

      console.log("LOGIN RESPONSE:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        if (data.user.role === "admin") {
  navigate("/admin");
} else if (data.user.role === "seller") {
  navigate("/seller");
} else {
  navigate("/products");
}
      } else {
        setError(data.message);
      }

    } catch (error) {
      console.log("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>Smart Commerce</h1>

        <h2>Login</h2>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>
          <p className="register-link">
  Not registered?{" "}
  <span onClick={() => navigate("/register")}>
    Register here
  </span>
</p>

        </form>

      </div>

    </div>
  );
}

export default Login;