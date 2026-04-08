import { useState } from "react";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration submitted!");
  };

  return (
    <div style={{ width: "300px", margin: "40px auto", textAlign: "center" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          Register
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <a href="/loginpagetest" style={{ color: "blue" }}>
          Login
        </a>
      </p>
    </div>
  );
}

export default RegisterPage;
