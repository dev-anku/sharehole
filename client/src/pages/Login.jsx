import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
      navigate("/");
    } else {
      const err = await res.json().catch(() => { });
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="text"
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-gray-700"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-6 p-3 rounded bg-gray-800 text-white border border-gray-700"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-green-800 text-white py-3 px-6 rounded-md shadow-lg hover:from-teal-600 hover:to-green-700"
        >
          Login
        </button>
        <p className="text-gray-400 text-sm mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
