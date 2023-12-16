import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function MoviePage() {
	const { movieId } = useParams();
	const [countries, setCountries] = useState("");
	const [genres, setGenres] = useState("");
	const [movieData, setMovieData] = useState([{}]);
	useEffect(() => {
		const fetchMovie = async () => {
			const url = `http://localhost:3000/movies/${movieId}`;
			try {
				const response = await axios.get(url);
				// console.log(response.data);
				setMovieData(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchMovie();
	}, []);
    useEffect(() => {
		function getInfo() {
			while (
				!movieData ||
				!movieData.genres ||
				!movieData.production_countries
			){ return }
			let genres = movieData.genres;
			let countries = movieData.production_countries;

			let str1 = "";
			genres.forEach((obj, index) => {
				str1 += obj.name;
				if (index !== genres.length - 1) {
					str1 += ", ";
				}
			});
			setGenres(str1);

			let str2 = "";
			countries.forEach((obj, index) => {
				str2 += obj.name;
				if (index !== countries.length - 1) {
					str2 += ", ";
				}
			});
			setCountries(str2);
		}
		getInfo();
    }, [movieData])
	return (
		<div className="movie-container">
			<div className="movie-poster">
				<img
					src={`https://image.tmdb.org/t/p/original/${movieData.poster_path}`}
				/>
			</div>
			<div className="movie-desc">
				{movieData && (
					<>
						<h2>{movieData.title}</h2>
						<p>{movieData.overview}</p>
						<ul>
							{movieData.runtime && (
								<li>
									<span>Runtime:</span> {movieData.runtime} minutes
								</li>
							)}
							{movieData.release_date && (
								<li>
									<span>Release Date:</span>{" "}
									{movieData.release_date}
								</li>
							)}
							{movieData.genres &&
								movieData.genres.length > 0 && (
									<li>
										<span>Genre:</span> {genres}
									</li>
								)}
							{movieData.spoken_languages &&
								movieData.spoken_languages.length > 0 && (
									<li>
										<span>Languages:</span>{" "}
										{movieData.spoken_languages[0].name}
									</li>
								)}
							{movieData.production_countries &&
								movieData.production_countries.length > 0 && (
									<li>
										<span>Country:</span> {countries}
									</li>
								)}
						</ul>
					</>
				)}
                <button className="addBtn">
                    Add to watchlist
                </button>
			</div>
		</div>
	);
}
