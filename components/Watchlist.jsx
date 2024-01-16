import React, { useEffect, useContext } from "react";
import { Context } from "../src/App.jsx";
import Divider from "./Divider.jsx";
import axios from "axios";

const Watchlist = () => {
	const { watchlist, setWatchlist, token } = useContext(Context);

	useEffect(() => {
		if(!token) return 
		async function fetchWatchlist(){
			const response = await axios.get(`http://localhost:3000/api/getWatchlist/${token}`)
			setWatchlist(response.data)
		}
		fetchWatchlist()
	}, [])

	const handleRemove = (movieId) => {
		setWatchlist(watchlist.filter(ele => ele.id !== movieId))
	}
	return (
		<>
			{token && watchlist.length > 0 ? (
				<div className="watchlist-container">
					<h2>Your Watchlist</h2>
					<ul>
						{watchlist.map((movie, index) => (
							<>
								<div className="list-card" key={index}>
									<img
										src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
									/>
									<div className="list-desc">
										<h4>
											{index + 1}. {movie.title}
										</h4>
										<div className="spans">
											<span>
												{movie.release_date && movie.release_date.slice(0,4)}
											</span>
											<span>{`${Math.floor(
												movie.runtime / 60
											)} hr ${
												movie.runtime % 60
											} min`}</span>
										</div>
										<div className="orange-text rating">
											{movie.vote_average?.toFixed(1)}
										</div>
									</div>
									<button className="removeBtn" onClick={() => handleRemove(movie.id)}>X</button>
								</div>
								{index !== watchlist.length - 1 && <Divider />}
								{/* {console.log(movie)} */}
							</>
						))}
					</ul>
				</div>
			) : (
				<div className="empty-container">
					<span>
						{token
							? "Your watchlist is empty"
							: "Log in to view your watchlist"}
					</span>
				</div>
			)}
		</>
	);
};

export default Watchlist;
