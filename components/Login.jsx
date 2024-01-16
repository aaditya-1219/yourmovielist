import React, { useContext, useEffect, useState } from "react";
import { Context } from "../src/App";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import toastConfig from "../utils/toast"
import { useNavigate } from "react-router";

function Login() {
	const { setToken } = useContext(Context)
	const [registered, setRegistered] = useState(true);
	const [userData, setUserData] = useState({
		username: "",
		password: "",
		watchlist: []
	});
	const navigate = useNavigate()
	function handleChange(event) {
		const { name, value } = event.target;
		setUserData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	}
	function handleSubmit(event) {
		event.preventDefault();
		// const { username, password } = userData;
		// console.log(`Username: ${username}`);
		// console.log(`Password: ${password}`);
		let endPoint = "register";
		if (registered) {
			endPoint = "login";
		}
		axios
			.post(`http://localhost:3000/${endPoint}`, userData)
			.then((response) => {
				toast.success(response.data.message, toastConfig);
				if(endPoint=="login"){
					// token is being received :) 
					// notes : don't store token in state, just have bool isLoggedIn instead
					// after login, the fresh token will be stored in localStorage and used from there henceforth 
					localStorage.setItem("token", response.data.accessToken)
					setToken(userData.username);
					navigate("/");
				}
			})
			.catch((error) => {
				if (error.response && error.response.status === 400) {
					toast.error(error.response.data, toastConfig);
				} 
			})
			.finally(() => {
				setUserData({ username: "", password: "" });
			});
	}

	return (
		<div className="login-container">
			<ToastContainer
				position="top-right"
				autoClose={3000}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				theme="dark"
			/>
			<form>
				{registered ? <h2>Login</h2> : <h2>Register</h2>}
				<input
					id="userField"
					type="text"
					name="username"
					onChange={handleChange}
					placeholder="Enter username"
					value={userData.username}
				/>
				<input
					type="text"
					name="password"
					onChange={handleChange}
					placeholder="Enter password"
					value={userData.password}
				/>
				{registered ? (
					<button type="submit" onClick={handleSubmit}>
						Login
					</button>
				) : (
					<button type="submit" onClick={handleSubmit}>
						Register
					</button>
				)}
				{registered ? (
					<p>
						Don't have an account?{" "}
						<a onClick={() => setRegistered(false)}>Register</a>
					</p>
				) : (
					<p>
						Already have an account?{" "}
						<a onClick={() => setRegistered(true)}>Login</a>
					</p>
				)}
			</form>
		</div>
	);
}

export default Login;
