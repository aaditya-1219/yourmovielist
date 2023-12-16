import React from 'react';
import "./index.scss"
import MainContent from '../components/MainContent';
import { Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';
import MoviePage from '../components/MoviePage';
import Watchlist from '../components/Watchlist';
function App() {
  return (
    <>
      <div id="navbar" className=''>
          <ul>
              <Link to='/'>Home</Link>
              <Link to='/top_rated'>Top Rated</Link>
              <Link to='/popular'>Popular</Link>
              <Link to='/upcoming'>Upcoming</Link>
          </ul>
          <ul>
            <input type="search" placeholder='Search'/>
					  <Link to='/watchlist' id='watchlist-btn'>Watchlist <i class="fa-solid fa-clapperboard"></i></Link>
          </ul>
      </div>
      
      <Routes>
        <Route path='/movies/:movieId' element={<MoviePage />} />
        <Route path='/' element={<MainContent subpath='' />}/>
        <Route path='/popular' element={<MainContent subpath='popular' />}/> 
        <Route path='/top_rated' element={<MainContent subpath='top_rated' />}/> 
        <Route path='/upcoming' element={<MainContent subpath='upcoming' />}/> 
        <Route path='/watchlist' element={<Watchlist />}/> 
      </Routes>
    </> 
  );
}

export default App;