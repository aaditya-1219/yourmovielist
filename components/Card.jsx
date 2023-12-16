import React from "react";
import { Link } from "react-router-dom";

function Card({ title, img, rating, movieId }) {
	return (
		<div className="card">
			<Link to={`/movies/${movieId}`}>
					<img src={img} />
			</Link>
			<div className="card-desc">
				<div className="movie-title">{title}</div>
				<div className="rating">{rating?.toFixed(1)}</div>
			</div>
		</div>
	);
}

export default Card;
