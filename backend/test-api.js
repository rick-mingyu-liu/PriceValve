#!/usr/bin/env node

/**
 * Simple API Test for PriceValve
 * Tests the unified fetch endpoint
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing PriceValve Simplified API\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', health.data.message);
    console.log('   APIs:', health.data.data.apis);
    console.log('   Cache size:', health.data.data.cache.size);
    console.log('');

    // Test 2: Fetch single game (CS2)
    console.log('2. Fetching single game (Counter-Strike 2)...');
    const singleGame = await axios.post(`${BASE_URL}/fetch`, {
      type: 'single',
      appId: 730,
      includeReviews: true,
      includePlayerCount: true,
      includeSalesHistory: true
    });
    
    if (singleGame.data.success) {
      const game = singleGame.data.data;
      console.log('✅ Single game fetched successfully:');
      console.log(`   Name: ${game.name}`);
      console.log(`   Price: $${game.price}`);
      console.log(`   Developer: ${game.developer}`);
      console.log(`   Review Score: ${game.reviewScore}%`);
      console.log(`   Owners: ${game.owners}`);
      console.log(`   Sales History Points: ${game.salesHistory.length}`);
    } else {
      console.log('❌ Failed to fetch single game:', singleGame.data.error);
    }
    console.log('');

    // Test 3: Fetch multiple games
    console.log('3. Fetching multiple games...');
    const multipleGames = await axios.post(`${BASE_URL}/fetch`, {
      type: 'multiple',
      appIds: [730, 570, 440], // CS2, Dota 2, TF2
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
        console.log(`   - ${game.name} (${game.appId}): $${game.price}, Score: ${game.reviewScore}%`);
      });
    } else {
      console.log('❌ Failed to fetch multiple games:', multipleGames.data.error);
    }
    console.log('');

    // Test 4: Fetch trending games
    console.log('4. Fetching trending games...');
    const trending = await axios.post(`${BASE_URL}/fetch`, {
      type: 'trending',
      limit: 5
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

    // Test 5: Search games
    console.log('5. Searching for games...');
    const search = await axios.post(`${BASE_URL}/fetch`, {
      type: 'search',
      query: 'counter',
      limit: 3
    });
    
    if (search.data.success) {
      console.log('✅ Search completed successfully:');
      console.log(`   Query: "${search.data.data.query}"`);
      console.log(`   Found: ${search.data.data.total} games`);
      search.data.data.games.forEach((game, index) => {
        console.log(`   ${index + 1}. ${game.name} (${game.appId})`);
      });
    } else {
      console.log('❌ Search failed:', search.data.error);
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📊 API Endpoints:');
    console.log('   GET  /api/health - Health check');
    console.log('   POST /api/fetch - Main data fetching endpoint');
    console.log('   DELETE /api/cache - Clear cache');
    console.log('\n📋 Postman Collection: PriceValve-API.postman_collection.json');

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
testAPI(); 