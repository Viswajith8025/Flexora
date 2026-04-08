import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login submitted!");
  };

  return (
    <div style={{ width: "300px", margin: "40px auto", textAlign: "center" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "black",
            color: "white",
            marginTop: "10px",
          }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Don't have an account?{" "}
        <a href="/registerpagetest" style={{ color: "blue" }}>
          Register
        </a>
      </p>
    </div>
  );
}

export default LoginPage;
