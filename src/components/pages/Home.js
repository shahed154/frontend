import React, { useState, useEffect, useContext } from 'react';
import { gameService } from '../../services/api';
import { UserContext } from '../../context/UserContext';
import GameCard from '../ui/GameCard';
import "./Home.css";

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser, isAuthenticated } = useContext(UserContext);

  useEffect(function loadGames() {
    let isMounted = true;
    
    async function fetchGames() {
      try {
        setLoading(true);
        setError("");
        
        const gamesData = await gameService.getTrendingGames(1);
        
        if (!isMounted) return;
        
        setGames(gamesData);
      } catch (error) {
        if (!isMounted) return;
        console.error('Error getting games:', error);
        setError("Failed to load games");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchGames();
    
    return function cleanup() {
      isMounted = false;
    };
  }, []);

  const handleLike = async (gameId) => {
    if (!isAuthenticated) {
      alert('Create an account to save your preferences');
      return;
    }
    try {
      await gameService.saveGamePreference(gameId, true, currentUser._id);
    } catch (error) {
      console.error('Error saving like:', error);
    }
  };

  const handleDislike = async (gameId) => {
    if (!isAuthenticated) {
      alert('Create an account to save your preferences');
      return;
    }
    try {
      await gameService.saveGamePreference(gameId, false, currentUser._id);
    } catch (error) {
      console.error('Error saving dislike:', error);
    }
  };

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
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading games...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
            </div>
          ) : (
            <div className="games-grid">
              {games.map(game => (
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
  );
};

export default Home;