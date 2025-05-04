import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";

const SignUp = () => {
  let urlObj = new URL(window.location.href); //get the current URL
  let newEmail = urlObj.searchParams.get("email"); //get the email from the URL
  const [email, setEmail] = useState(newEmail || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //get the signup function from store
  const { signup } = useAuthStore();

  const handleSignup = (e) => {
    e.preventDefault();
    signup({ email, username, password });
  };
  return (
    <div className="h-screen w-full hero-bg">
      <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/">
          <img src="/netflix-logo.png" alt="logo" className="w-52" />
        </Link>
      </header>

      <div className="flex justify-center items-center mt-20 mx-3">
        <div className="w-sm p-8 space-y-6 bg-black/45 rounded-lg shadow-md">
          <h1 className="text-center text-white font-bold text-2xl mb-4">
            Sign Up
          </h1>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300 block"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                required
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-300 block"
              >
                Username
              </label>
              <input
                type="text"
                placeholder="john doe"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300 block"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="********"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                required
              />
            </div>
            <button className="w-full bg-red-500 text-white p-2 font-semibold rounded-md hover:bg-red-600">
              Sign up
            </button>
          </form>
          <div className="text-center text-gray-400 mt-4">
            Already a member?{" "}
            <Link to={"/login"} className="text-red-500 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
