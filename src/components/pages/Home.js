import React, { useState, useEffect, useContext } from 'react';
import { gameService } from '../../services/api'
import { UserContext } from '../../context/UserContext'
import GameCard from '../ui/GameCard';
import "./Home.css";

const Home = () =>
{
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { currentUser, isAuthenticated } = useContext(UserContext);

    ///// FETCH RECENT POPULAR GAMES //////

    useEffect(() => 
      {
      const fetchGames = async () => 
        {
        try {
          setLoading(true)
          setError("")
          
          const gamesData = await gameService.getTrendingGames(1)

          console.log("Games fetched:", gamesData);
          
          setGames(gamesData);
          
        } catch (error) 
        {
          console.error('Error gettiung games:', error)

          setError("Failed to load games");

        } finally
        {
          setLoading(false)
        }
      }

      fetchGames()

    }, [])


    ////// HANDLE PREFERENCES ////

    const handleLike = async (gameId) => {
      if (!isAuthenticated)
         {
        alert('Create ann account to save your preferences');
        return;
      }
      try {
        await gameService.saveGamePreference(gameId, true, currentUser._id);


      } catch (error)
       {
        console.error('Error saving like:', error);
      }
    }

    const handleDislike = async (gameId) => {
      if (!isAuthenticated)
         {
         alert('Create an account to save your preferences');
        return;
      }

      try {
        await gameService.saveGamePreference(gameId, false, currentUser._id)
      } catch (error)
       {
        console.error(`Error saving dislike:`, error)
      }
    }

    return (

      <div className="home-container">
        <div className="container">
          <div className="main-section">
            <h1 className="main-title">Find Your Next Game!</h1>
            <p className="main-subtitle">
              Popular releases from the last 60 days
            </p>
          </div>

          <section className="trending-section">
            <h2 className="section-title">Trending Games</h2>
            
            {loading 
            ? 
            (
              <div className="loading-container">
                 {/* ------------------ADD LOADING ANIM LATER ON ------------------*/}
                <div className="spinner"></div>
                <p>Loading games...</p>
              </div>
            ) 
            : 
            error 
            ? 
            (
              <div className="error-container">
                <p>{error}</p>
              </div>
            ) 
            :
            (
              <div className="games-grid">
                {games.map(game => 
                (
                  <div key={game.id} className="game-card-wrapper">
                    <GameCard 
                      game={game}
                      onLike={handleLike}
                      onDislike={handleDislike}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    )
}

export default Home