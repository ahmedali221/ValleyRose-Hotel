require('dotenv').config();
const { connect } = require('../setup/db');
const Meal = require('../modules/meal/meal.model');
const WeeklyMenu = require('../modules/weeklyMenu/weeklyMenu.model');

async function ensureIndexes() {
  try {
    console.log('🔌 Connecting to database...');
    await connect();
    
    console.log('\n🔍 Ensuring indexes are created...');
    
    // Ensure indexes for Meal model
    console.log('   - Creating indexes for Meal collection...');
    await Meal.createIndexes();
    const mealIndexes = await Meal.collection.getIndexes();
    console.log(`   ✅ Meal indexes:`, Object.keys(mealIndexes));
    
    // Ensure indexes for WeeklyMenu model
    console.log('   - Creating indexes for WeeklyMenu collection...');
    await WeeklyMenu.createIndexes();
    const weeklyMenuIndexes = await WeeklyMenu.collection.getIndexes();
    console.log(`   ✅ WeeklyMenu indexes:`, Object.keys(weeklyMenuIndexes));
    
    console.log('\n✨ All indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error ensuring indexes:', error);
    process.exit(1);
  }
}

ensureIndexes();

