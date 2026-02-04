require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const sampleEvents = [
  {
    title: "Sydney Summer Music Festival 2026",
    description: "The biggest summer music festival featuring top Australian and international artists. Three days of non-stop entertainment with multiple stages, food trucks, and camping options.",
    dateTime: new Date('2026-02-15T18:00:00'),
    venue: { name: "Sydney Olympic Park", address: "1 Olympic Blvd, Sydney Olympic Park NSW 2127" },
    city: "Sydney",
    category: "Music",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    sourceWebsite: "Manual Entry",
    originalUrl: "https://www.eventbrite.com.au",
    status: "new"
  },
  {
    title: "Sydney Food & Wine Festival",
    description: "Taste the best of Sydney's culinary scene with top chefs, premium wines from across Australia, and cooking demonstrations.",
    dateTime: new Date('2026-02-20T12:00:00'),
    venue: { name: "The Rocks Markets", address: "George Street, The Rocks NSW 2000" },
    city: "Sydney",
    category: "Food",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    sourceWebsite: "Manual Entry",
    originalUrl: "https://www.timeout.com/sydney",
    status: "new"
  },
  {
    title: "Contemporary Art Exhibition",
    description: "Explore cutting-edge contemporary art from local and international artists.",
    dateTime: new Date('2026-02-25T10:00:00'),
    venue: { name: "Museum of Contemporary Art", address: "140 George St, The Rocks NSW 2000" },
    city: "Sydney",
    category: "Arts",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
    sourceWebsite: "Manual Entry",
    originalUrl: "https://www.timeout.com/sydney",
    status: "new"
  },
  {
    title: "Sydney Harbour Fireworks",
    description: "A spectacular fireworks display over Sydney Harbour with live music and entertainment.",
    dateTime: new Date('2026-03-05T20:00:00'),
    venue: { name: "Circular Quay", address: "Circular Quay, Sydney NSW 2000" },
    city: "Sydney",
    category: "Entertainment",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    sourceWebsite: "Manual Entry",
    originalUrl: "https://www.eventbrite.com.au",
    status: "new"
  },
  {
    title: "Tech Startup Workshop",
    description: "Learn from successful entrepreneurs and network with Sydney's startup community.",
    dateTime: new Date('2026-02-18T09:00:00'),
    venue: { name: "Fishburners Startup Hub", address: "11 York St, Sydney NSW 2000" },
    city: "Sydney",
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    sourceWebsite: "Manual Entry",
    originalUrl: "https://www.eventbrite.com.au",
    status: "new"
  },
  {
    title: "Bondi Beach Sunset Yoga",
    description: "Rejuvenating yoga session on Bondi Beach at sunset. All levels welcome!",
    dateTime: new Date('2026-02-12T18:30:00'),
    venue: { name: "Bondi Beach", address: "Bondi Beach, Bondi NSW 2026" },
    city: "Sydney",
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800",
    sourceWebsite: "Manual Entry",
    originalUrl: "https://www.timeout.com/sydney",
    status: "new"
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!');
    console.log('📝 Adding events...');
    await Event.insertMany(sampleEvents);
    console.log(`✅ Successfully added ${sampleEvents.length} events!`);
    console.log('\n📅 Events added:');
    sampleEvents.forEach((e, i) => console.log(`${i+1}. ${e.title}`));
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();