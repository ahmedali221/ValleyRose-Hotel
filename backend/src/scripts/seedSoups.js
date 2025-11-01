require('dotenv').config();
const { connect } = require('../setup/db');
const Meal = require('../modules/meal/meal.model');

const soupsData = [
  { name_de: "Alt Wiener Suppentopf", name_en: "Old Viennese Soup Pot" },
  { name_de: "Apfel-Selleriesuppe", name_en: "Apple and Celery Soup" },
  { name_de: "Backerbsensuppe", name_en: "Baked Pea Soup (Broth with Fried Dough Balls)" },
  { name_de: "Serbische Bohnensuppe", name_en: "Serbian Bean Soup" },
  { name_de: "Broccolicremesuppe", name_en: "Cream of Broccoli Soup" },
  { name_de: "Champignoncremesuppe", name_en: "Cream of Mushroom Soup" },
  { name_de: "Eierschwammerl-Suppe", name_en: "Chanterelle Mushroom Soup" },
  { name_de: "Eierstichsuppe", name_en: "Egg Custard Soup" },
  { name_de: "Erbsen-Karotten-Suppe", name_en: "Pea and Carrot Soup" },
  { name_de: "Estragon-Ragout-Suppe", name_en: "Tarragon Ragout Soup" },
  { name_de: "Fisolensuppe", name_en: "Green Bean Soup" },
  { name_de: "Frittatensuppe", name_en: "Pancake Strip Soup" },
  { name_de: "Gemüsecremesuppe", name_en: "Cream of Vegetable Soup" },
  { name_de: "Grießnockerlsuppe", name_en: "Semolina Dumpling Soup" },
  { name_de: "Gulaschsuppe", name_en: "Goulash Soup" },
  { name_de: "Ingwer-Karotten-Suppe", name_en: "Ginger and Carrot Soup" },
  { name_de: "Junge Erbsensuppe", name_en: "Young Pea Soup" },
  { name_de: "Karfiolcremesuppe", name_en: "Cream of Cauliflower Soup" },
  { name_de: "Karotten-Ingwer-Suppe", name_en: "Carrot and Ginger Soup" },
  { name_de: "Karotten-Kartoffel-Suppe", name_en: "Carrot and Potato Soup" },
  { name_de: "Sellerrie-kartoffel-Suppe", name_en: "Celery and Potato Soup" },
  { name_de: "Kartoffelsuppe", name_en: "Potato Soup" },
  { name_de: "Käsecremesuppe", name_en: "Cream of Cheese Soup" },
  { name_de: "Klare Gemüsesuppe", name_en: "Clear Vegetable Soup (Broth)" },
  { name_de: "Klare Hühnersuppe", name_en: "Clear Chicken Soup (Broth)" },
  { name_de: "Knoblauchcremesuppe", name_en: "Cream of Garlic Soup" },
  { name_de: "Krautsuppe", name_en: "Cabbage Soup" },
  { name_de: "Kürbiscremesuppe", name_en: "Cream of Pumpkin Soup" },
  { name_de: "Kürbis-Curry-Suppe", name_en: "Pumpkin and Curry Soup" },
  { name_de: "Kürbis-Paprika-Cremesuppe", name_en: "Cream of Pumpkin and Bell Pepper Soup" },
  { name_de: "Lauchcremesuppe", name_en: "Cream of Leek Soup" },
  { name_de: "Leberknödelsuppe", name_en: "Liver Dumpling Soup" },
  { name_de: "Linsensuppe", name_en: "Lentil Soup" },
  { name_de: "Maronicremesuppe", name_en: "Cream of Chestnut Soup" },
  { name_de: "Minestrone", name_en: "Minestrone" },
  { name_de: "Nudelsuppe", name_en: "Noodle Soup" },
  { name_de: "Rindsuppe mit Spinatnockerl", name_en: "Beef Broth with Spinach Dumplings" },
  { name_de: "Rollgerstensuppe", name_en: "Barley Soup" },
  { name_de: "Rote Rüben Suppe", name_en: "Red Beet Soup" },
  { name_de: "Selleriecremesuppe", name_en: "Cream of Celery Soup" },
  { name_de: "Spargelcremesuppe", name_en: "Cream of Asparagus Soup" },
  { name_de: "Speck-Kartoffel-Suppe", name_en: "Bacon and Potato Soup" },
  { name_de: "Spinatcremesuppe", name_en: "Cream of Spinach Soup" },
  { name_de: "Stracciatella-Suppe", name_en: "Stracciatella Soup" },
  { name_de: "Süßkartoffelsuppe", name_en: "Sweet Potato Soup" },
  { name_de: "Tiroler Knödelsuppe", name_en: "Tyrolean Dumpling Soup" },
  { name_de: "Tomatencremesuppe", name_en: "Cream of Tomato Soup" },
  { name_de: "Zucchinicremesuppe", name_en: "Cream of Zucchini Soup" },
  { name_de: "Zwiebelsuppe", name_en: "Onion Soup" },
  { name_de: "Blumenkohlsuppe (Karfiol)", name_en: "Cauliflower Soup" },
  { name_de: "Bratwurstelsuppe", name_en: "Sausage Soup (Small Bratwurst)" },
  { name_de: "Specknockerlsuppe", name_en: "Bacon Dumpling Soup" },
  { name_de: "Bärlauchcremesuppe", name_en: "Cream of Wild Garlic Soup" },
  { name_de: "Sellerrie-Karotten-Suppe", name_en: "Celery and Carrot Soup" },
];

async function seedSoups() {
  try {
    await connect();
    console.log('Connected to database');

    let created = 0;
    let skipped = 0;

    for (const soup of soupsData) {
      // Check if soup already exists (by name_de or name_en)
      const existing = await Meal.findOne({
        type: 'Soup',
        $or: [
          { name_de: soup.name_de },
          { name_en: soup.name_en }
        ]
      });

      if (existing) {
        console.log(`Skipping "${soup.name_de}" - already exists`);
        skipped++;
        continue;
      }

      await Meal.create({
        name_de: soup.name_de,
        name_en: soup.name_en,
        type: 'Soup',
        isRecommended: false,
      });
      created++;
      console.log(`Created: ${soup.name_de} / ${soup.name_en}`);
    }

    console.log(`\nSeed completed!`);
    console.log(`Created: ${created} soups`);
    console.log(`Skipped: ${skipped} soups (already exist)`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding soups:', error);
    process.exit(1);
  }
}

seedSoups();

