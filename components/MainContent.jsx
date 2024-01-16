import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
export default function MainContent({ searchQuery, subpath }) {
	const [movieData, setMovieData] = useState([{}]);
	useEffect(() => {
		const fetchList = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/${subpath}`
				);
				setMovieData(response.data.results);
			} catch (err) {
				console.log(err);
			}
		};
		fetchList();
	}, [subpath]);
	const [filteredMovies, setFilteredMovies] = useState([]);
	useEffect(() => {
		setFilteredMovies(movieData);
	}, [movieData]);
	useEffect(() => {
		if (movieData) {
			if (searchQuery === "") {
				setFilteredMovies(movieData)
				return;
			}
			axios
				.get(`http://localhost:3000/api/searchMovie/${searchQuery}`)
				.then(response => {
					setFilteredMovies(response.data.results)
				})	
				.catch(err => console.log("Error: ", err))
			// let list = movieData.filter(
			// 	(movie) => {
			// 		let mainString = movie.original_title.toLowerCase();
			// 		let subString = searchQuery.toLowerCase();
			// 		return mainString.includes(subString)
			// 	}
			// );
			// setFilteredMovies(list);
		}
		// console.log(filteredMovies);
	}, [searchQuery]);
	return (
		<div className="card-container">
			{filteredMovies.map((obj, index) => {
				return (
					<Card
						key={index}
						img={`https://image.tmdb.org/t/p/original/${obj.poster_path}`}
						title={obj.title}
						movieId={obj.id}
						rating={obj.vote_average}
					/>
				);
			})}
		</div>
	);
}
