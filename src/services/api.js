
import axios from 'axios'

const BASE_URL = 'https://gamebrowserapp.onrender.com';

export const gameService = {
  getTrendingGames: async (page = 1) => {
    try {
      const fullUrl = `${BASE_URL}/api/games/recommendations?page=${page}`;
      const response = await axios.get(fullUrl);
      
      const gamesWithFullData = await Promise.all(
        response.data.map(async (game) => {
          if (game.screenshots && game.screenshots.length > 0) {
            return game;
          }
          
          try {
            return await gameService.getGameDetails(game.id);
          } catch (err) {
            console.error(`Failed to load full details for game ${game.id}`);
            return game;
          }
        })
      );
      
      return gamesWithFullData;
    } catch (error) {
      console.error('Error getting trending games:', error);
      throw error;
    }
  },

  getGameDetails: async (gameId) => {
    try {
      const fullUrl = `${BASE_URL}/api/games/${gameId}`;
      const response = await axios.get(fullUrl);
      
      return response.data;
    } catch (error) {
      console.error(`Error getting game details for ID ${gameId}:`, error);
      throw error;
    }
  },

  saveGamePreference: async (gameId, liked, userId) => {
    try {
      const fullUrl = `${BASE_URL}/api/users/preference`;
      const response = await axios.post(fullUrl, {
        gameId,
        liked,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error saving game preference:', error);
      throw error;
    }
  },

  getUserLikedGames: async (userId) => {
    try {
      const fullUrl = `${BASE_URL}/api/games/user/${userId}/liked`;
      const response = await axios.get(fullUrl);
      
      const gamesWithFullData = await Promise.all(
        response.data.map(async (game) => {
          if (game.screenshots && game.screenshots.length > 0) {
            return game;
          }
          
          try {
            return await gameService.getGameDetails(game.id);
          } catch (err) {
            console.error(`Failed to load details ${game.id}`);
            return game;
          }
        })
      );
      
      return gamesWithFullData;
    } catch (error) {
      console.error('Error getting liked games:', error);
      throw error;
    }
  },

  loginOrCreateUser: async (username) => {
    try {
      const fullUrl = `${BASE_URL}/api/users/login-or-create`;
      const response = await axios.post(fullUrl, { username });
      return response.data;
    } catch (error) {
      console.error('Error logging in / creating user:', error);
      throw error;
    }
  },
  
  removeLikedGame: async (gameId, userId) => {
    try {
      const fullUrl = `${BASE_URL}/api/users/liked-game/${userId}/${gameId}`;
      const response = await axios.delete(fullUrl);
      return response.data;
    } catch (error) {
      console.error('Error removing liked game:', error);
      throw error;
    }
  }
}