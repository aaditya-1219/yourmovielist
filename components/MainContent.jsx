import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
export default function MainContent({ subpath }) {
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
	return (
		<div className="card-container">
			{movieData.map((obj, index) => (
				<Card
					key={index}
					img={`https://image.tmdb.org/t/p/original/${obj.poster_path}`}
					title={obj.title}
					movieId={obj.id}
					rating={obj.vote_average}
				/>
			))}
		</div>
	);
}
