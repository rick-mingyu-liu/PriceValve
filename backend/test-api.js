const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

// Test data
const testAppId = 730; // Counter-Strike 2
const testQuery = 'portal';

async function testAPI() {
  console.log('🧪 Testing PriceValve API Integrations...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', health.data.message);
    console.log('   Version:', health.data.version);
    console.log('   Timestamp:', health.data.timestamp);
    console.log('');

    // Test 2: Steam Data
    console.log('2. Testing Steam API Integration...');
    try {
      const steamData = await axios.get(`${API_BASE}/steam/${testAppId}`);
      console.log('✅ Steam Data Retrieved');
      console.log('   Game:', steamData.data.data.name);
      console.log('   Price:', steamData.data.data.price);
      console.log('   Developer:', steamData.data.data.developer);
      console.log('   Genres:', steamData.data.data.genres.join(', '));
    } catch (error) {
      console.log('❌ Steam API Error:', error.response?.data?.error || error.message);
    }
    console.log('');

    // Test 3: SteamSpy Data
    console.log('3. Testing SteamSpy API Integration...');
    try {
      const steamSpyData = await axios.get(`${API_BASE}/steamspy/${testAppId}`);
      console.log('✅ SteamSpy Data Retrieved');
      console.log('   Game:', steamSpyData.data.data.name);
      console.log('   Owners:', steamSpyData.data.data.owners);
      console.log('   Positive Reviews:', steamSpyData.data.data.positive);
      console.log('   Average Playtime:', steamSpyData.data.data.averageForever, 'minutes');
    } catch (error) {
      console.log('❌ SteamSpy API Error:', error.response?.data?.error || error.message);
    }
    console.log('');

    // Test 4: Search Games
    console.log('4. Testing Game Search...');
    try {
      const searchResults = await axios.get(`${API_BASE}/search?query=${testQuery}&limit=5`);
      console.log('✅ Search Results Retrieved');
      console.log('   Query:', searchResults.data.data.query);
      console.log('   Results:', searchResults.data.data.total);
      searchResults.data.data.games.slice(0, 3).forEach(game => {
        console.log(`   - ${game.name} (${game.appId}) - $${game.price / 100}`);
      });
    } catch (error) {
      console.log('❌ Search Error:', error.response?.data?.error || error.message);
    }
    console.log('');

    // Test 5: Featured Games
    console.log('5. Testing Featured Games...');
    try {
      const featuredGames = await axios.get(`${API_BASE}/featured`);
      console.log('✅ Featured Games Retrieved');
      console.log('   Count:', featuredGames.data.data.length);
      featuredGames.data.data.slice(0, 3).forEach(game => {
        console.log(`   - ${game.name} (${game.appId}) - $${game.price / 100}`);
      });
    } catch (error) {
      console.log('❌ Featured Games Error:', error.response?.data?.error || error.message);
    }
    console.log('');

    // Test 6: Top Games
    console.log('6. Testing Top Games...');
    try {
      const topGames = await axios.get(`${API_BASE}/top-games?criteria=top100in2weeks`);
      console.log('✅ Top Games Retrieved');
      console.log('   Count:', topGames.data.data.length);
      topGames.data.data.slice(0, 3).forEach(game => {
        console.log(`   - ${game.name} (${game.appId}) - ${game.genre}`);
      });
    } catch (error) {
      console.log('❌ Top Games Error:', error.response?.data?.error || error.message);
    }
    console.log('');

    // Test 7: Comprehensive Analysis
    console.log('7. Testing Comprehensive Analysis...');
    try {
      const analysis = await axios.post(`${API_BASE}/analyze`, {
        appId: testAppId
      });
      console.log('✅ Comprehensive Analysis Retrieved');
      console.log('   Game:', analysis.data.data.name);
      console.log('   Steam Data:', analysis.data.data.steamData ? '✅' : '❌');
      console.log('   SteamSpy Data:', analysis.data.data.steamSpyData ? '✅' : '❌');
      console.log('   ITAD Data:', analysis.data.data.itadData ? '✅' : '❌');
      console.log('   Price Analysis:', analysis.data.data.priceAnalysis ? '✅' : '❌');
      
      if (analysis.data.data.priceAnalysis) {
        const priceAnalysis = analysis.data.data.priceAnalysis;
        console.log('   Current Price: $' + priceAnalysis.currentPrice / 100);
        console.log('   Recommended Price: $' + priceAnalysis.recommendedPrice / 100);
        console.log('   Confidence: ' + priceAnalysis.priceConfidence + '%');
        console.log('   Market Trend: ' + priceAnalysis.marketTrend);
        console.log('   Recommendations:', priceAnalysis.recommendations.length);
      }
    } catch (error) {
      console.log('❌ Analysis Error:', error.response?.data?.error || error.message);
    }
    console.log('');

    // Test 8: Batch Analysis
    console.log('8. Testing Batch Analysis...');
    try {
      const batchAnalysis = await axios.post(`${API_BASE}/analyze/batch`, {
        appIds: [730, 570, 440] // CS2, Dota 2, Team Fortress 2
      });
      console.log('✅ Batch Analysis Retrieved');
      console.log('   Total:', batchAnalysis.data.summary.total);
      console.log('   Successful:', batchAnalysis.data.summary.successful);
      console.log('   Failed:', batchAnalysis.data.summary.failed);
      
      batchAnalysis.data.data.forEach(result => {
        console.log(`   - ${result.name} (${result.appId}): ${result.success ? '✅' : '❌'}`);
      });
    } catch (error) {
      console.log('❌ Batch Analysis Error:', error.response?.data?.error || error.message);
    }
    console.log('');

    console.log('🎉 API Testing Complete!');
    console.log('\n📝 Notes:');
    console.log('- Some APIs may require API keys (ITAD)');
    console.log('- Rate limiting may affect some requests');
    console.log('- Network issues may cause timeouts');
    console.log('- Check the console for detailed error messages');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: npm run dev');
    console.log('2. Check if the server is on port 5001');
    console.log('3. Verify your .env file is configured');
    console.log('4. Check network connectivity');
  }
}

// Run the test
testAPI(); 