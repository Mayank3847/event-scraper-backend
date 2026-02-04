const cron = require('node-cron');

// Placeholder scraper function
async function runAllScrapers() {
  console.log('Scraper placeholder - will implement actual scrapers later');
  console.log('For now, the server is running without scraping.');
}

// Schedule scraping
function startScheduler() {
  console.log('Scraper scheduler initialized (placeholder mode)');
  
  // Comment out the actual scheduling for now
  // cron.schedule('0 */6 * * *', () => {
  //   console.log('Running scheduled scrape');
  //   runAllScrapers();
  // });
}

module.exports = { startScheduler, runAllScrapers };