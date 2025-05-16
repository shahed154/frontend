import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
///////////////////////////////////////////////////////
//////////////// GAME API SERVICES //////////////////
////////////////////////////////////////////////////

export const gameService = 
{

  getTrendingGames: async (page = 1) =>
     {
    try {
    
      const response = await api.get(`/api/games/recommendations?page=${page}`)


      console.log(`RAWG response: ${response.status}, games: ${response.data.length}`)
      
 //// *** ADD MORE LATER ON HERE FOR GAME DETS

      const gamesWithFullData = await Promise.all
      (
        response.data.map(async (game) => 
          {
          if (game.screenshots && game.screenshots.length > 0) 
            {
            return game;
          }
          
          try 
          {
            return await gameService.getGameDetails(game.id);
          } catch (err) {
            console.error(`Failedd to load full details for game ${game.id}`)
            return game
          }
        })
      )
      
      return gamesWithFullData
    } catch (error) {


      console.error('Error gettng trending games:', error);

      throw error
    }
  },

  getGameDetails: async (gameId) => {
    try {

      const response = await api.get(`/api/games/${gameId}`)

      console.log(`RECEIVED screenshots?: ${response.data.screenshots ? 'Yes' : 'No'}`)
      
      return response.data
    } catch (error) {
      console.error(`Error getting game details for ID ${gameId}:`, error);
      throw error
    }
  },

  saveGamePreference: async (gameId, liked, userId) => {
    try {

      console.log(`Saving prefarences: Game ${gameId}, Liked: ${liked}, User: ${userId}`)

      const response = await api.post('/api/users/preference', 

        {
        gameId,
        liked,
        userId
      })
      return response.data
    } catch (error) 
    {

      console.error('Error saving game preference:', error);

      throw error
    }
  },

  getUserLikedGames: async (userId) => {
    try
     {
      console.log(`GETTING LIKD GAMES FOR USER ${userId}`);

      const response = await api.get(`/api/games/user/${userId}/liked`)

      console.log(`Liked games : ${response.data.length}`);
      
      const gamesWithFullData = await Promise.all(
        response.data.map(async (game) => {
          if (game.screenshots && game.screenshots.length > 0) {
            return game
          }
          
          try 
          
          {
            return await gameService.getGameDetails(game.id)
          } catch (err) 
          {
          
            console.error(`Failed to load  details ${game.id}`)
            return game
          }
        })
      )
      
      return gamesWithFullData
    } catch (error) {
      console.error('Error gettinh liked games:', error);
      throw error
    }
  },

  loginOrCreateUser: async (username) => {
    try {
   
      const response = await api.post('/api/users/login-or-create', { username });

      return response.data;

    } catch (error) {
      console.error('Error logging in / creating user:', error)
      throw error
    }
  },
  
/////// FIX LATER 

  removeLikedGame: async (gameId, userId) => {
    try {

      console.log(`Removing game ${gameId} from user ${userId}'s liked games!!`);

      const response = await api.delete(`/api/users/liked-game/${userId}/${gameId}`);

      return response.data

    } catch (error) 

    {

      console.error('Error removing liked game:', error);
      throw error
    }
  }

}