require('dotenv').config();
const { connect } = require('../setup/db');
const Meal = require('../modules/meal/meal.model');
const WeeklyMenu = require('../modules/weeklyMenu/weeklyMenu.model');

async function cleanupMeals() {
  try {
    console.log('🔌 Connecting to database...');
    await connect();
    
    console.log('\n📊 Checking current data...');
    const mealCount = await Meal.countDocuments();
    const weeklyMenuCount = await WeeklyMenu.countDocuments();
    
    console.log(`   - Meals: ${mealCount}`);
    console.log(`   - Weekly Menu entries: ${weeklyMenuCount}`);
    
    if (mealCount === 0 && weeklyMenuCount === 0) {
      console.log('\n✅ Database is already empty. Nothing to delete.');
      process.exit(0);
    }
    
    console.log('\n🗑️  Starting cleanup...');
    
    // Delete all weekly menu entries first (they reference meals)
    if (weeklyMenuCount > 0) {
      console.log('   - Deleting weekly menu entries...');
      const weeklyMenuResult = await WeeklyMenu.deleteMany({});
      console.log(`   ✅ Deleted ${weeklyMenuResult.deletedCount} weekly menu entries`);
    }
    
    // Delete all meals
    if (mealCount > 0) {
      console.log('   - Deleting meals...');
      const mealResult = await Meal.deleteMany({});
      console.log(`   ✅ Deleted ${mealResult.deletedCount} meals`);
    }
    
    // Verify deletion
    console.log('\n🔍 Verifying deletion...');
    const remainingMeals = await Meal.countDocuments();
    const remainingWeeklyMenus = await WeeklyMenu.countDocuments();
    
    if (remainingMeals === 0 && remainingWeeklyMenus === 0) {
      console.log('   ✅ All data successfully deleted!');
      console.log('\n✨ Database cleanup completed successfully!');
      console.log('   You can now re-add meals using the seed scripts or through the dashboard.');
    } else {
      console.log(`   ⚠️  Warning: Some data may still exist (Meals: ${remainingMeals}, Weekly Menus: ${remainingWeeklyMenus})`);
    }
    
  } catch (error) {
    console.error('\n❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    // Close database connection
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
    process.exit(0);
  }
}

// Run the cleanup
cleanupMeals();

