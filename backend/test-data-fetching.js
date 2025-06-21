#!/usr/bin/env node

/**
 * Test script for data fetching functionality
 * Run with: node test-data-fetching.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testDataFetching() {
  console.log('🧪 Testing PriceValve Data Fetching API\n');

  try {
    // Test 1: Get health status
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', health.data.message);
    console.log('');

    // Test 2: Get data sources status
    console.log('2. Testing data sources status...');
    const status = await axios.get(`${BASE_URL}/data/status`);
    console.log('✅ Data sources status:', {
      steam: status.data.data.steam.available,
      steamSpy: status.data.data.steamSpy.available,
      cacheSize: status.data.data.cache.size
    });
    console.log('');

    // Test 3: Fetch Counter-Strike 2 data (App ID: 730)
    console.log('3. Fetching Counter-Strike 2 data (App ID: 730)...');
    const cs2Data = await axios.get(`${BASE_URL}/data/game/730`, {
      params: {
        includeReviews: true,
        includePlayerCount: true,
        includeSalesHistory: true
      }
    });
    
    if (cs2Data.data.success) {
      const game = cs2Data.data.data;
      console.log('✅ CS2 Data fetched successfully:');
      console.log(`   Name: ${game.name}`);
      console.log(`   Price: $${game.price}`);
      console.log(`   Developer: ${game.developer}`);
      console.log(`   Review Score: ${game.reviewScore}`);
      console.log(`   Owners: ${game.owners}`);
      console.log(`   Tags: ${game.tags.slice(0, 5).join(', ')}...`);
      console.log(`   Sales History Points: ${game.salesHistory.length}`);
      console.log(`   Sources: Steam=${cs2Data.data.sources.steam}, SteamSpy=${cs2Data.data.sources.steamSpy}`);
    } else {
      console.log('❌ Failed to fetch CS2 data:', cs2Data.data.error);
    }
    console.log('');

    // Test 4: Fetch multiple games
    console.log('4. Fetching multiple games data...');
    const multipleGames = await axios.post(`${BASE_URL}/data/games`, {
      appIds: [730, 570, 440], // CS2, Dota 2, Team Fortress 2
      includeReviews: true,
      includeSalesHistory: true
    });
    
    if (multipleGames.data.success) {
      const result = multipleGames.data.data;
      console.log('✅ Multiple games fetched successfully:');
      console.log(`   Total requested: ${result.summary.total}`);
      console.log(`   Successful: ${result.summary.successful}`);
      console.log(`   Failed: ${result.summary.failed}`);
      
      result.games.forEach(game => {
        console.log(`   - ${game.name} (${game.appId}): $${game.price}, Score: ${game.reviewScore}`);
      });
    } else {
      console.log('❌ Failed to fetch multiple games:', multipleGames.data.error);
    }
    console.log('');

    // Test 5: Get trending games
    console.log('5. Fetching trending games...');
    const trending = await axios.get(`${BASE_URL}/data/trending`, {
      params: { limit: 5 }
    });
    
    if (trending.data.success) {
      console.log('✅ Trending games fetched successfully:');
      trending.data.data.games.forEach((game, index) => {
        console.log(`   ${index + 1}. ${game.name} (${game.appId})`);
      });
    } else {
      console.log('❌ Failed to fetch trending games:', trending.data.error);
    }
    console.log('');

    // Test 6: Get cache statistics
    console.log('6. Getting cache statistics...');
    const cacheStats = await axios.get(`${BASE_URL}/data/cache/stats`);
    
    if (cacheStats.data.success) {
      console.log('✅ Cache statistics:');
      console.log(`   Cache size: ${cacheStats.data.data.size} entries`);
      console.log(`   Oldest entry: ${Math.max(...cacheStats.data.data.entries.map(e => e.age))}ms old`);
    } else {
      console.log('❌ Failed to get cache stats:', cacheStats.data.error);
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📊 API Endpoints tested:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/data/status');
    console.log('   GET  /api/data/game/:appId');
    console.log('   POST /api/data/games');
    console.log('   GET  /api/data/trending');
    console.log('   GET  /api/data/cache/stats');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running:');
      console.log('   cd backend && npm run dev');
    }
    
    if (error.response) {
      console.log('Response data:', error.response.data);
    }
  }
}

// Run the tests
testDataFetching(); 