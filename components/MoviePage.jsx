import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import toastConfig from "../utils/toast";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { Context } from "../src/App";
export default function MoviePage() {
	const { movieId } = useParams();
	const [inWatchlist, setInWatchlist] = useState(false);
	const [countries, setCountries] = useState("");
	const [genres, setGenres] = useState("");
	const [movie, setMovie] = useState([{}]);
	const { watchlist, addToWatchlist, token } = useContext(Context);
	const navigate = useNavigate();
	useEffect(() => {
		const fetchMovie = async () => {
			const url = `http://localhost:3000/movies/${movieId}`;
			try {
				const response = await axios.get(url);
				setMovie(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchMovie();
	}, []);
	useEffect(() => {
		function getInfo() {
			if (movie && movie.genres && movie.production_countries) {
				let genres = movie.genres.map((genre) => genre.name).join(", ");
				let countries = movie.production_countries
					.map((country) => country.name)
					.join(", ");

				setGenres(genres);
				setCountries(countries);
			}
		}
		function checkWatchlist() {
			if (token && movie && watchlist.length > 0) {
				// console.log(watchlist)
				watchlist.forEach((element) => {
					if (element.id === movie.id) {
						setInWatchlist(true);
						return;
					}
				});
			}
		}

		getInfo();
		checkWatchlist();
	}, [movie]);

	function handleAddToWatchlist() {
		if (!token) {
			navigate("/login");
			return;
		}
		addToWatchlist(movie, navigate);
		toast.success("Added to watchlist", toastConfig);
		setInWatchlist(true)
	}
	return (
		<div className="movie-container">
			<ToastContainer theme="dark" />
			<div className="movie-poster">
				{movie && (
					<img
						src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
					/>
				)}
			</div>
			<div className="movie-desc">
				{movie && (
					<>
						<h2>{movie.title}</h2>
						<p>{movie.overview}</p>
						<ul>
							{movie.runtime && (
								<li>
									<span>Runtime: </span>
									{`${Math.floor(movie.runtime / 60)} hr ${
										movie.runtime % 60
									} min`}
								</li>
							)}
							{movie.release_date && (
								<li>
									<span>Release Date:</span>{" "}
									{movie.release_date}
								</li>
							)}
							{movie.genres && movie.genres.length > 0 && (
								<li>
									<span>Genre:</span> {genres}
								</li>
							)}
							{movie.spoken_languages &&
								movie.spoken_languages.length > 0 && (
									<li>
										<span>Languages:</span>{" "}
										{movie.spoken_languages[0].name}
									</li>
								)}
							{movie.production_countries &&
								movie.production_countries.length > 0 && (
									<li>
										<span>Country:</span> {countries}
									</li>
								)}
						</ul>
						{inWatchlist ? (
							<button className="addBtn">
								{/* <svg
									xmlns="http://www.w3.org/2000/svg"
									height="16"
									width="14"
									viewBox="0 0 512 400"
								>
									<path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
								</svg> */}
								Added to watchlist
							</button>
						) : (
							<button
								className="addBtn"
								onClick={handleAddToWatchlist}
							>
								Add to watchlist
							</button>
						)}
					</>
				)}
			</div>
		</div>
	);
}
