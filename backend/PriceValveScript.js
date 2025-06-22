const fs = require('fs');

class Game
{
    constructor(appID){
      this.appID = appID;
      this.name ;
      this.price ;
      this.quantitySold;
      this.cluster;
    }
}

class GameList 
{
  constructor(filePath){
  this.filePath = filePath;
  this.data = [];
  this.load(); }//end constructor
  
  load(){
      const fileContent = fs.readFileSync(this.filePath, 'utf-8');
      this.data = JSON.parse(fileContent);
  }
  
  getAll(){return this.data;}
  
  getById(appID)
    {
        return this.data.find(obj => obj.appID === appID);
    }
  
  getSimilarGames(game){
    let similarGames = [];
    
    for ( let i = 0 ; i < this.data.length; i++ )
       { if (game.cluster === this.data[i].cluster ){
               similarGames.push(this.data[i]);}
           }
    return similarGames;
   }

  /**
   * Pick a game by appID and set it as the selected game
   * @param {number} appID - The app ID of the game to pick
   * @returns {Game|null} - The selected game or null if not found
   */
  pickGame(appID) {
    // Find the game in the data array
    const foundGame = this.data.find(game => game.appID === appID);
    
    if (foundGame) {
      // Create a new Game instance with the found data
      const selectedGame = new Game(foundGame.appID);
      selectedGame.name = foundGame.name;
      selectedGame.price = foundGame.price;
      selectedGame.quantitySold = foundGame.quantitySold;
      selectedGame.cluster = foundGame.cluster;
      
      console.log(`✅ Game picked: ${selectedGame.name} (ID: ${selectedGame.appID})`);
      return selectedGame;
    } else {
      console.log(`❌ Game with appID ${appID} not found`);
      return null;
    }
  }

  /**
   * Pick a game by name (alternative method)
   * @param {string} gameName - The name of the game to pick
   * @returns {Game|null} - The selected game or null if not found
   */
  pickGameByName(gameName) {
    // Find the game in the data array by name
    const foundGame = this.data.find(game => game.name === gameName);
    
    if (foundGame) {
      // Create a new Game instance with the found data
      const selectedGame = new Game(foundGame.appID);
      selectedGame.name = foundGame.name;
      selectedGame.price = foundGame.price;
      selectedGame.quantitySold = foundGame.quantitySold;
      selectedGame.cluster = foundGame.cluster;
      
      console.log(`✅ Game picked by name: ${selectedGame.name} (ID: ${selectedGame.appID})`);
      return selectedGame;
    } else {
      console.log(`❌ Game with name "${gameName}" not found`);
      return null;
    }
  }
}//end class

// Create an instance of GameList to load the data from 'game.json'
const gameData = new GameList('game.json');

// You can now access the loaded data. For example, to get all games:
const allGames = gameData.getAll();
console.log(`Loaded ${allGames.length} games.`);

// Example usage of the new pickGame method
console.log('\n=== Example Usage ===');
const selectedGame = gameData.pickGame(367520); // Pick game by appID
if (selectedGame) {
  console.log(`Selected game: ${selectedGame.name}`);
  console.log(`Price: ${selectedGame.price}`);
  console.log(`Quantity Sold: ${selectedGame.quantitySold}`);
  console.log(`Cluster: ${selectedGame.cluster}`);
}

// Example usage of pickGameByName method
console.log('\n=== Pick by Name Example ===');
const gameByName = gameData.pickGameByName("Hollow Knight");
if (gameByName) {
  console.log(`Found game by name: ${gameByName.name} (ID: ${gameByName.appID})`);
}



