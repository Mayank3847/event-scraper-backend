const puppeteer = require('puppeteer');
const Event = require('../models/Event');

async function scrapeEventbrite() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    const url = 'https://www.eventbrite.com.au/d/australia--sydney/events/';
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const events = await page.evaluate(() => {
      const eventElements = document.querySelectorAll('[data-testid="search-result-card"]');
      const results = [];
      
      eventElements.forEach(element => {
        try {
          const titleEl = element.querySelector('h2, h3, [class*="title"]');
          const dateEl = element.querySelector('[class*="date"], time');
          const venueEl = element.querySelector('[class*="venue"], [class*="location"]');
          const linkEl = element.querySelector('a[href*="eventbrite"]');
          const imgEl = element.querySelector('img');
          
          if (titleEl && linkEl) {
            results.push({
              title: titleEl.textContent.trim(),
              dateTime: dateEl?.textContent.trim() || 'Date TBD',
              venue: venueEl?.textContent.trim() || 'Venue TBD',
              imageUrl: imgEl?.src || '',
              originalUrl: linkEl.href
            });
          }
        } catch (err) {
          console.log('Error parsing event:', err.message);
        }
      });
      
      return results;
    });
    
    console.log(`Scraped ${events.length} events from Eventbrite`);
    
    // Process and save events
    for (const eventData of events) {
      await processEvent({
        ...eventData,
        description: `Event from Eventbrite: ${eventData.title}`,
        city: 'Sydney',
        sourceWebsite: 'Eventbrite',
        venue: {
          name: eventData.venue,
          address: 'Sydney, Australia'
        }
      });
    }
    
  } catch (error) {
    console.error('Eventbrite scraping error:', error.message);
  } finally {
    await browser.close();
  }
}

async function processEvent(eventData) {
  try {
    // Check if event exists
    const existingEvent = await Event.findOne({
      originalUrl: eventData.originalUrl
    });
    
    if (existingEvent) {
      // Check if event details changed
      const hasChanged = 
        existingEvent.title !== eventData.title ||
        existingEvent.venue.name !== eventData.venue.name;
      
      if (hasChanged) {
        existingEvent.status = 'updated';
        existingEvent.lastScraped = new Date();
        Object.assign(existingEvent, eventData);
        await existingEvent.save();
        console.log(`Updated event: ${eventData.title}`);
      } else {
        existingEvent.lastScraped = new Date();
        await existingEvent.save();
      }
    } else {
      // Create new event
      const parsedDate = parseEventDate(eventData.dateTime);
      
      await Event.create({
        ...eventData,
        dateTime: parsedDate,
        status: 'new'
      });
      console.log(`Created new event: ${eventData.title}`);
    }
  } catch (error) {
    console.error('Error processing event:', error.message);
  }
}

function parseEventDate(dateString) {
  // Simple date parser - customize based on actual format
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // If parsing fails, set to 7 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    return futureDate;
  }
  return date;
}

module.exports = { scrapeEventbrite };