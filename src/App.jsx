import React, { createContext, useContext, useEffect, useState } from "react";
import "./index.scss";
import MainContent from "../components/MainContent";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Route, Routes } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
import MoviePage from "../components/MoviePage";
import Watchlist from "../components/Watchlist";
import Login from "../components/Login";
import toastConfig from "../utils/toast";
import { isFirstRender } from "../utils/isFirstRender";

export const Context = createContext();

function App() {
	const [token, setToken] = useState('df');
	const [watchlist, setWatchlist] = useState([{}]);
	const [searchQuery, setSearchQuery] = useState('')

	const addToWatchlist = (movie) => {
		setWatchlist((prev) => {
			return [...prev, movie];
		});
	};

	const firstRender = isFirstRender();

	useEffect(() => {
		if (firstRender) return;
		let obj = {
			watchlist: watchlist,
			token: token
		}
		axios
			.post("http://localhost:3000/api/updateWatchlist", obj)
			.then((response) => {
				console.log(response.data);
			})
			.catch((err) => console.log("Error: ", err));
	}, [watchlist]);

	useEffect(() => {
		if(!token) return 
		async function fetchWatchlist(){
			const response = await axios.get(`http://localhost:3000/api/getWatchlist/${token}`)
			setWatchlist(response.data)
		}
		fetchWatchlist()
	}, [token])

	function handleLogout() {
		setToken(null);
		toast.success("Logged out", toastConfig);
	}

	useEffect(() => console.log(searchQuery), [searchQuery])
	return (
		<Context.Provider
			value={{ watchlist, setWatchlist, addToWatchlist, token, setToken }}
		>
			<div id="navbar">
				<ul>
					<Link to="/">Home</Link>
					<Link to="/top_rated">Top Rated</Link>
					<Link to="/popular">Popular</Link>
					<Link to="/upcoming">Upcoming</Link>
				</ul>
				<ul>
					<input type="search" placeholder="Search" onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery}/>
					<Link to="/watchlist" className="nav-btn">
						Watchlist <i class="fa-solid fa-clapperboard"></i>
					</Link>
					{token ? (
						<button className="nav-btn" onClick={handleLogout}>
							Log out
						</button>
					) : (
						<Link to="/login" className="nav-btn">
							Log in
						</Link>
					)}
				</ul>
			</div>
			<ToastContainer theme="dark" />

			<Routes>
				<Route path="/movies/:movieId" element={<MoviePage />} />
				<Route path="/" element={<MainContent searchQuery={searchQuery} subpath="" />} />
				<Route
					path="/popular"
					element={<MainContent searchQuery={searchQuery} subpath="popular" />}
				/>
				<Route
					path="/top_rated"
					element={<MainContent searchQuery={searchQuery} subpath="top_rated" />}
				/>
				<Route
					path="/upcoming"
					element={<MainContent searchQuery={searchQuery} subpath="upcoming" />}
				/>
				<Route path="/watchlist" element={<Watchlist />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</Context.Provider>
	);
}

export default App;
