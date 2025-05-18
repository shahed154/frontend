import React, { useState, useContext } from 'react';
import { gameService } from '../../services/api';
import { UserContext } from "../../context/UserContext";
import GameCard from '../ui/GameCard';
import './GameSwipe.css';

const GameSwipe = () => {
  const [currentGame, setCurrentGame] = useState(null);
  const [nextGames, setNextGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [initialized, setInitialized] = useState(false);
  const { currentUser, isAuthenticated } = useContext(UserContext);

  const initializeGames = async () => {
    if (initialized) return;
    
    try {
      setLoading(true);
      setError("");
      
      const gamesData = await gameService.getTrendingGames(page);
      
      if (gamesData && gamesData.length > 0) {
        setCurrentGame(gamesData[0]);
        setNextGames(gamesData.slice(1));
      } else {
        setError("No game available");
      }
      
      setInitialized(true);
    } catch (error) {
      console.error('Error getting games:', error);
      setError("Failed to load games.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreGames = async () => {
    try {
      const nextPage = page + 1;
      setPage(nextPage);
      
      const moreGames = await gameService.getTrendingGames(nextPage);
      
      if (moreGames && moreGames.length > 0) {
        setNextGames(prevGames => [...prevGames, ...moreGames]);
      }
    } catch (error) {
      console.error("Error loading more games:", error);
    }
  };

  const moveToNextGame = () => {
    if (nextGames.length > 0) {
      setCurrentGame(nextGames[0]);
      setNextGames(prevGames => prevGames.slice(1));
      
      if (nextGames.length <= 2) {
        loadMoreGames();
      }
    } else {
      loadMoreGames();
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to save your preferences');
      moveToNextGame();
      return;
    }

    try {
      if (currentGame) {
        await gameService.saveGamePreference(
          currentGame.id, 
          true, 
          currentUser._id
        );
        moveToNextGame();
      }
    } catch (error) {
      console.error("Error saving like:", error);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      alert('Please login to save your preferences');
      moveToNextGame();
      return;
    }

    try {
      if (currentGame) {
        await gameService.saveGamePreference(
          currentGame.id, 
          false, 
          currentUser._id
        );
        moveToNextGame();
      }
    } catch (error) {
      console.error("Error saving dislike:", error);
    }
  };

  if (!initialized && !loading) {
    initializeGames();
  }

  return (
    <div className="game-swipe-container">
      <div className="container">
        <h1 className="swipe-title">Find Your Next Game</h1>
        <p className="swipe-subtitle">
          Swipe through games and save your preferences
        </p>

        <div className="swipe-area">
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
            <>
              {currentGame ? (
                <div className="swipe-card-container">
                  <div className="swipe-card">
                    <GameCard 
                      game={currentGame}
                      showActions={false}
                    />
                  </div>
                  
                  <div className="swipe-actions">
                    <button 
                      className="swipe-button dislike-button"
                      onClick={handleDislike}
                    >
                      👎
                    </button>
                    
                    <button 
                      className="swipe-button like-button"
                      onClick={handleLike}
                    >
                      👍
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-games-message">
                  <h3>No more games to show</h3>
                  <p>Come back later for more recommendations!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSwipe;