const puppeteer = require('puppeteer');
const Event = require('../models/Event');

async function scrapeTimeoutSydney() {
 const browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
  headless: chromium.headless,
});
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    const url = 'https://www.timeout.com/sydney/things-to-do/events-in-sydney';
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const events = await page.evaluate(() => {
      const eventCards = document.querySelectorAll('article, [class*="event"], [class*="card"]');
      const results = [];
      
      eventCards.forEach(card => {
        try {
          const titleEl = card.querySelector('h2, h3, [class*="title"]');
          const descEl = card.querySelector('p, [class*="description"]');
          const linkEl = card.querySelector('a[href]');
          const imgEl = card.querySelector('img');
          
          if (titleEl && linkEl) {
            const href = linkEl.href;
            if (href.includes('timeout.com')) {
              results.push({
                title: titleEl.textContent.trim(),
                description: descEl?.textContent.trim() || 'Check out this event',
                imageUrl: imgEl?.src || '',
                originalUrl: href
              });
            }
          }
        } catch (err) {
          console.log('Error parsing event:', err.message);
        }
      });
      
      return results.slice(0, 20); // Limit to 20 events
    });
    
    console.log(`Scraped ${events.length} events from Timeout Sydney`);
    
    for (const eventData of events) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
      
      await processTimeoutEvent({
        ...eventData,
        dateTime: futureDate,
        city: 'Sydney',
        sourceWebsite: 'Timeout Sydney',
        category: 'Entertainment',
        venue: {
          name: 'Various Locations',
          address: 'Sydney, Australia'
        }
      });
    }
    
  } catch (error) {
    console.error('Timeout Sydney scraping error:', error.message);
  } finally {
    await browser.close();
  }
}

async function processTimeoutEvent(eventData) {
  try {
    const existingEvent = await Event.findOne({
      originalUrl: eventData.originalUrl
    });
    
    if (!existingEvent) {
      await Event.create({
        ...eventData,
        status: 'new'
      });
      console.log(`Created new event: ${eventData.title}`);
    } else {
      existingEvent.lastScraped = new Date();
      await existingEvent.save();
    }
  } catch (error) {
    console.error('Error processing Timeout event:', error.message);
  }
}

module.exports = { scrapeTimeoutSydney };