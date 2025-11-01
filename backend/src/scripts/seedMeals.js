require('dotenv').config();
const { connect } = require('../setup/db');
const Meal = require('../modules/meal/meal.model');

const menu1Data = [
  { name_de: "Rind Schmorbraten mit Haschee Nudel", name_en: "Braised Beef with Chopped Meat Noodles (Hash Noodles)" },
  { name_de: "Backhendelsalat mit Gebäck", name_en: "Fried Chicken Salad with Bread" },
  { name_de: "Bauernpfanne mit Spiegelei und kaltem Krautsalat oder gr. Sa", name_en: "Farmer's Pan with Fried Egg and Cold Coleslaw or Green Salad" },
  { name_de: "Berner Würstel mit Pommes frites", name_en: "Berner Sausages (Cheese-filled, Bacon-wrapped) with French Fries" },
  { name_de: "Champignon-Gulasch mit Gebäck", name_en: "Mushroom Goulash with Bread" },
  { name_de: "Cremespinat mit Röstkartoffeln und Spiegelei", name_en: "Creamed Spinach with Roasted Potatoes and Fried Egg" },
  { name_de: "Eiernockerl mit grünem Salat", name_en: "Egg Dumplings with Green Salad" },
  { name_de: "Fusilli a la Thunfisch", name_en: "Tuna Fusilli" },
  { name_de: "Gebackene Champignons mit Sauce Tartar", name_en: "Fried Mushrooms with Tartar Sauce" },
  { name_de: "Gebackene Emmentaler mit Petersilienkartoffeln", name_en: "Fried Emmentaler Cheese with Parsley Potatoes" },
  { name_de: "Gebackene Kürbisschnitzel mit grünem Salat und Sauce Tartar", name_en: "Fried Pumpkin Cutlets with Green Salad and Tartar Sauce" },
  { name_de: "Gebackene Mozzarella auf Blattsalat", name_en: "Fried Mozzarella on Mixed Greens" },
  { name_de: "Gebackene Putenstreifen auf Blattsalat mit Gebäck & Sauce Tartar", name_en: "Fried Turkey Strips on Mixed Greens with Bread & Tartar Sauce" },
  { name_de: "Gebackene Zucchini mit Sauce Tartar", name_en: "Fried Zucchini with Tartar Sauce" },
  { name_de: "Gebackener Karfiol mit Sauce Tartar (frisch)", name_en: "Fried Cauliflower with Tartar Sauce (fresh)" },
  { name_de: "Gebackenes Gemüse mit Sauce Tartar", name_en: "Fried Vegetables with Tartar Sauce" },
  { name_de: "Gegrillter Leberkäse mit Spiegelei und Petersilienkartoffeln", name_en: "Grilled Meatloaf (Leberkäse) with Fried Egg and Parsley Potatoes" },
  { name_de: "Gefüllte Paprika mit Salzkartoffeln (Spitzpaprika)", name_en: "Stuffed Peppers (Pointed Peppers) with Boiled Potatoes" },
  { name_de: "Gemüseomlette mit Gebäck (leicht)", name_en: "Vegetable Omelet with Bread (light)" },
  { name_de: "Gemüsestrudel mit Knoblauchsauce und Petersilienkartoffeln", name_en: "Vegetable Strudel with Garlic Sauce and Parsley Potatoes" },
  { name_de: "Geröstete Knödel Eier mit grünem Salat", name_en: "Roasted Dumplings and Eggs with Green Salad" },
  { name_de: "Gnocchi mit Käse-Kräutersauce", name_en: "Gnocchi with Cheese and Herb Sauce" },
  { name_de: "Gnocchi quattro formaggi", name_en: "Gnocchi Four Cheese" },
  { name_de: "Grammelknödel mit Sauerkraut", name_en: "Greaves Dumplings with Sauerkraut" },
  { name_de: "Karfiol mit Butterbröseln", name_en: "Cauliflower with Buttered Breadcrumbs" },
  { name_de: "Kartoffelgulasch mit Pizzabrot", name_en: "Potato Goulash with Pizza Bread" },
  { name_de: "Käsekrainer mit Pommes frites", name_en: "Cheese Krainer Sausage with French Fries" },
  { name_de: "Käsespätzle mit grünem Salat", name_en: "Cheese Spätzle with Green Salad" },
  { name_de: "Krautfleckerl mit grünem Salat", name_en: "Cabbage and Pasta Squares (Fleckerl) with Green Salad" },
  { name_de: "Lasagne al forno mit grünem Salat", name_en: "Baked Lasagne with Green Salad" },
  { name_de: "Letscho mit Spiegelei und Bratkartoffeln", name_en: "Letscho (Pepper and Tomato Stew) with Fried Egg and Fried Potatoes" },
  { name_de: "Liwanzen mit Schlagobers gefüllt mit Topfen und frischen Früchten", name_en: "Liwanzen (Thick Pancakes) with Whipped Cream, filled with Quark and Fresh Fruit" },
  { name_de: "Moussaka mit grünem Salat", name_en: "Moussaka with Green Salad" },
  { name_de: "Penne amatriciana", name_en: "Penne all'Amatriciana" },
  { name_de: "Penne mit Putenstreifen und Kürbissauce", name_en: "Penne with Turkey Strips and Pumpkin Sauce" },
  { name_de: "Penne quattro formaggi", name_en: "Penne Four Cheese" },
  { name_de: "Profiteroles mit Schokoladen- und Vanillefüllung und Schlagobers", name_en: "Profiteroles with Chocolate and Vanilla Filling and Whipped Cream" },
  { name_de: "Schafskäse im Speckmantel auf Blattsalat", name_en: "Feta Cheese wrapped in Bacon on Mixed Greens" },
  { name_de: "Spaghetti Siciliana", name_en: "Spaghetti Siciliana" },
  { name_de: "Spaghetti Bolognese mit grünem Salat", name_en: "Spaghetti Bolognese with Green Salad" },
  { name_de: "Spaghetti Carbonara mit grünem Salat", name_en: "Spaghetti Carbonara with Green Salad" },
  { name_de: "Specklinsen mit Semmelknödel", name_en: "Bacon and Lentils with Bread Dumplings" },
  { name_de: "Spinatpalatschinken mit Käse überbacken", name_en: "Spinach Pancakes au Gratin with Cheese" },
  { name_de: "Tagliatelle funghi", name_en: "Tagliatelle with Mushrooms (Funghi)" },
  { name_de: "Tagliatelle salmone", name_en: "Tagliatelle with Salmon" },
  { name_de: "Topfenpalatschinken (3 Stück) mit Vanillesauce", name_en: "Quark Pancakes (3 pieces) with Vanilla Sauce" },
  { name_de: "Schinkenfleckerl mit grünem Salat", name_en: "Ham and Pasta Squares (Fleckerl) with Green Salad" },
  { name_de: "Kürbisgulasch mit Semmelknödeln", name_en: "Pumpkin Goulash with Bread Dumplings" },
  { name_de: "Gemüseteller mit Kartoffeln und Spiegelei", name_en: "Vegetable Plate with Potatoes and Fried Egg" },
  { name_de: "Kaiserschmarrn mit Zwetschkenröster", name_en: "Kaiserschmarrn (Shredded Pancake) with Plum Compote" },
  { name_de: "Speckbohnen mit Kartoffelknödeln", name_en: "Bacon and Green Beans with Potato Dumplings" },
  { name_de: "Kohlgemüse mit Spiegelei und Kartoffeln", name_en: "Cabbage Vegetables with Fried Egg and Potatoes" },
  { name_de: "Augsburger mit Kartoffelpüree und Zwiebelringe", name_en: "Augsburger Sausage with Mashed Potatoes and Onion Rings" },
  { name_de: "Gemüselasagne", name_en: "Vegetable Lasagne" },
  { name_de: "Wurstsalat mit Gebäck", name_en: "Sausage Salad with Bread" },
  { name_de: "Überbackener Kartoffelauflauf mit Salat", name_en: "Gratinated Potato Casserole with Salad" },
  { name_de: "Gemüselaibchen mit Kartoffelpüree", name_en: "Vegetable Patties with Mashed Potatoes" },
  { name_de: "Faschiertes Laibchen mit Kartoffelpüree", name_en: "Minced Meat Patty (Frikadelle) with Mashed Potatoes" },
  { name_de: "Melanzani Cordon Bleu mit Gurken-Rahmsalat", name_en: "Eggplant Cordon Bleu with Creamy Cucumber Salad" },
  { name_de: "Kürbisstrudel mit grünem Salat", name_en: "Pumpkin Strudel with Green Salad" },
  { name_de: "Bärlauch Nockerl mit grünem Salat", name_en: "Wild Garlic Dumplings (Nockerl) with Green Salad" },
  { name_de: "Gebackene Käse mit Sauce Tartar und Petersilienkartoffeln", name_en: "Fried Cheese with Tartar Sauce and Parsley Potatoes" },
  { name_de: "Gnocchi mit Kürbissauce und Hühnerstreifen", name_en: "Gnocchi with Pumpkin Sauce and Chicken Strips" },
  { name_de: "Gegrilltes Gemüse mit Spiegelei und Röstkartoffel", name_en: "Grilled Vegetables with Fried Egg and Roasted Potatoes" },
  { name_de: "Feiertag", name_en: "Public Holiday / Day Off (Placeholder)" },
];

const menu2Data = [
  { name_de: "Cordon Bleu mit Kartoffelsalat", name_en: "Cordon Bleu with Potato Salad" },
  { name_de: "Cornflakes Schnitzel (Schwein) mit Kartoffelsalat", name_en: "Cornflakes-Crusted Schnitzel (Pork) with Potato Salad" },
  { name_de: "Fiaker Schnitzel (Schwein) mit Kartoffelsalat", name_en: "Fiaker Schnitzel (Pork with Fried Egg, usually on top) with Potato Salad" },
  { name_de: "Hühnerschnitzel in Mandeln paniert mit Speckkartoffeln", name_en: "Chicken Schnitzel breaded in Almonds with Bacon Potatoes" },
  { name_de: "Montenegro Schnitzel (Schwein) mit grünem Salat", name_en: "Montenegro Schnitzel (Pork, often filled with cheese/ham) with Green Salad" },
  { name_de: "Pariser Schnitzel (Schwein/Pute) mit Reis / Risibisi", name_en: "Parisian Schnitzel (Pork/Turkey, in batter) with Rice / Rice and Peas (Risibisi)" },
  { name_de: "Putenschnitzel in Mandeln paniert mit Speckkartoffeln", name_en: "Turkey Schnitzel breaded in Almonds with Bacon Potatoes" },
  { name_de: "Wiener Schnitzel (Schwein) mit Pommes frites", name_en: "Wiener Schnitzel (Pork) with French Fries" },
  { name_de: "Champignonschnitzel (Schwein) mit Reis", name_en: "Mushroom Schnitzel (Pork) with Rice" },
  { name_de: "Kartoffelpuffer mit Knoblauchsauce und Salat", name_en: "Potato Pancakes (Latkes) with Garlic Sauce and Salad" },
  { name_de: "Cevapcici mit Bratkartoffeln / Pommes frites und Zwiebelsenf", name_en: "Cevapcici with Fried Potatoes / French Fries and Onion Mustard" },
  { name_de: "Fiakergulasch mit Semmelknödel", name_en: "Fiaker Goulash (often with sausages, pickles) with Bread Dumplings" },
  { name_de: "Rinderbraten mit Kartoffelknödel und Fisolen", name_en: "Roast Beef with Potato Dumplings and Green Beans" },
  { name_de: "Gekochtes Rindfleisch mit Cremespinat und Röstkartoffeln", name_en: "Boiled Beef with Creamed Spinach and Roasted Potatoes" },
  { name_de: "Gekochtes Rindfleisch mit Rahmfisolen und Röstkartoffeln", name_en: "Boiled Beef with Creamed Green Beans and Roasted Potatoes" },
  { name_de: "Rinderbraten mit Spiralennudeln", name_en: "Roast Beef with Spiral Pasta" },
  { name_de: "Rindsgulasch mit mit Semmelknödel", name_en: "Beef Goulash with Bread Dumplings" },
  { name_de: "Tafelspitz mit Cremespinat und Röstkartoffeln", name_en: "Tafelspitz (Boiled Beef Tip) with Creamed Spinach and Roasted Potatoes" },
  { name_de: "Tafelspitz mit Wurzelgemüse und Röstkartoffeln", name_en: "Tafelspitz (Boiled Beef Tip) with Root Vegetables and Roasted Potatoes" },
  { name_de: "Tagliatelle mit Champignon-Oberssauce und Hühnerstreifen", name_en: "Tagliatelle with Cream of Mushroom Sauce and Chicken Strips" },
  { name_de: "Hühner Stroganoff mit Reis", name_en: "Chicken Stroganoff with Rice" },
  { name_de: "Fleischpalatschinken mit grünem Salat", name_en: "Meat Pancakes (Crêpes) with Green Salad" },
  { name_de: "Gegrilltes Putenfilet überbacken mit Mozzarella und Risibis", name_en: "Grilled Turkey Fillet gratinated with Mozzarella and Rice and Peas (Risibisi)" },
  { name_de: "Gegrilltes Putensteak mit Kürbisragout und Reis", name_en: "Grilled Turkey Steak with Pumpkin Ragout and Rice" },
  { name_de: "Grillkotelett mit Gemüse und Bratkartoffeln", name_en: "Grilled Chop with Vegetables and Fried Potatoes" },
  { name_de: "Hirtenspieß mit Bratkartoffeln / Pommes frites", name_en: "Shepherd's Skewer with Fried Potatoes / French Fries" },
  { name_de: "Krautrouladen mit Salzkartoffeln", name_en: "Cabbage Rolls with Boiled Potatoes" },
  { name_de: "Krenfleisch mit Salzkartoffeln", name_en: "Horseradish Meat with Boiled Potatoes" },
  { name_de: "Letschokotelett mit Bratkartoffeln", name_en: "Letscho Chop (Pork Chop with Pepper/Tomato Stew) with Fried Potatoes" },
  { name_de: "Moussaka mit grünem Salat", name_en: "Moussaka with Green Salad" },
  { name_de: "Paprikahuhn mit Nockerl", name_en: "Chicken Paprikash with Dumplings (Nockerl)" },
  { name_de: "Piccata Milanese (Huhn) mit Spaghetti Pomodoro", name_en: "Piccata Milanese (Chicken) with Spaghetti Pomodoro" },
  { name_de: "Pute geschnetzelt auf Züricher Art mit Reis", name_en: "Sliced Turkey Swiss-Style (Zürcher Geschnetzeltes) with Rice" },
  { name_de: "Putensteak mit Kürbisragout und Reis", name_en: "Turkey Steak with Pumpkin Ragout and Rice" },
  { name_de: "Schweinemedaillons mit Gnocchi con gorgonzola", name_en: "Pork Medallions with Gnocchi with Gorgonzola" },
  { name_de: "Schweinsbraten mit Semmelknödel und Sauerkraut", name_en: "Roast Pork with Bread Dumplings and Sauerkraut" },
  { name_de: "Stefaniebraten mit Kartoffelpüree", name_en: "Stefanie Roast (Meatloaf with hard-boiled eggs/sausage filling) with Mashed Potatoes" },
  { name_de: "Steierisches Wurzelfleisch mit Salzkartoffeln", name_en: "Styrian Root Vegetable Meat with Boiled Potatoes" },
  { name_de: "Faschierter Braten mit Kartoffelpüree", name_en: "Minced Meat Roast (Meatloaf) with Mashed Potatoes" },
  { name_de: "Bauernschnitzel mit Bratkartoffeln", name_en: "Farmer's Schnitzel with Fried Potatoes" },
  { name_de: "Putenspieß mit Pommes frites", name_en: "Turkey Skewer with French Fries" },
  { name_de: "Jägerbraten mit Karoffelpüree", name_en: "Hunter's Roast with Mashed Potatoes" },
  { name_de: "Mailänder Schnitzel (Schwein) mit Schinken-Obers-Spagethi", name_en: "Milanese Schnitzel (Pork) with Ham and Cream Spaghetti" },
  { name_de: "Holzhackerkotelett mit Bratkartoffeln", name_en: "Lumberjack Chop (often with bacon/onions) with Fried Potatoes" },
  { name_de: "Kalbsragout nach Jägerart mit Reis", name_en: "Veal Ragout Hunter-Style with Rice" },
  { name_de: "Pute Hawaii mit Reis", name_en: "Turkey Hawaii with Rice" },
  { name_de: "Knoblauchkotelett mit Bratkartoffeln", name_en: "Garlic Chop with Fried Potatoes" },
  { name_de: "Hühnerfilet im Speckmantel und Schupfnudel", name_en: "Chicken Fillet wrapped in Bacon with Potato Noodles (Schupfnudel)" },
  { name_de: "Faschiertes Laibchen mit Kartoffelpüree und Gurken-Rahmsalat", name_en: "Minced Meat Patty (Frikadelle) with Mashed Potatoes and Creamy Cucumber Salad" },
  { name_de: "Faschiertes Laibchen gefüllt mit Schafskäse mit Kartoffelpüree", name_en: "Minced Meat Patty (Frikadelle) filled with Feta Cheese with Mashed Potatoes" },
  { name_de: "Brathuhn mit Reis", name_en: "Roast Chicken with Rice" },
  { name_de: "Hühnerspieß mit Pommes frites", name_en: "Chicken Skewer with French Fries" },
  { name_de: "Berner Würstel mit Pommes frites", name_en: "Berner Sausages (Cheese-filled, Bacon-wrapped) with French Fries" },
  { name_de: "Geröstete Kalbsleber mit Petersilienkartoffeln", name_en: "Roasted Veal Liver with Parsley Potatoes" },
  { name_de: "Hühnergeschnetzeltes mit Hörnchen Nudel", name_en: "Sliced Chicken with Horn Pasta (Elbow Macaroni)" },
  { name_de: "Fleischlaibchen mit grünem Salat", name_en: "Meat Patties with Green Salad" },
  { name_de: "Reisfleisch mit grünem Salat", name_en: "Rice with Meat (Pilaf-style) with Green Salad" },
  { name_de: "Gebackene Hühnerleber mit Petersilienkartoffeln", name_en: "Fried Chicken Liver with Parsley Potatoes" },
  { name_de: "Kalbsbeuschel mit Semmelknödel", name_en: "Veal Ragout (Lungs and Heart) with Bread Dumplings" },
  { name_de: "Kümmelbraten mit Sauerkraut und Semmelknödel", name_en: "Caraway Roast (Pork) with Sauerkraut and Bread Dumplings" },
  { name_de: "Schweizer Wurstsalat mit Pizzabrot", name_en: "Swiss Sausage Salad with Pizza Bread" },
  { name_de: "Gnocchi Siciliana", name_en: "Gnocchi Siciliana" },
  { name_de: "Leberpfanne mit Speck und Champignons", name_en: "Liver Pan with Bacon and Mushrooms" },
  { name_de: "Gegrillte Hühnerkeule mit Kartoffelpüree", name_en: "Grilled Chicken Drumstick with Mashed Potatoes" },
  { name_de: "Avocado-Salat Sommer", name_en: "Avocado Salad Summer" },
  { name_de: "Kartoffelknödel mit Kürbisragout", name_en: "Potato Dumplings with Pumpkin Ragout" },
  { name_de: "Rind Schmorbraten mit Haschee Nudel", name_en: "Braised Beef with Chopped Meat Noodles (Hash Noodles)" },
  { name_de: "Geselchtes mit Kartoffelpüree und Röstzwiebel", name_en: "Smoked Meat with Mashed Potatoes and Fried Onions" },
];

async function seedMeals() {
  try {
    await connect();
    console.log('Connected to database');

    let menu1Created = 0;
    let menu1Skipped = 0;
    let menu2Created = 0;
    let menu2Skipped = 0;

    // Seed Menu 1 meals
    console.log('\n=== Seeding Menu 1 meals ===\n');
    for (const meal of menu1Data) {
      // Check if meal already exists (by name_de or name_en)
      const existing = await Meal.findOne({
        type: 'Meal',
        menuCategory: 'menu_1',
        $or: [
          { name_de: meal.name_de },
          { name_en: meal.name_en }
        ]
      });

      if (existing) {
        console.log(`Skipping "${meal.name_de}" - already exists`);
        menu1Skipped++;
        continue;
      }

      await Meal.create({
        name_de: meal.name_de,
        name_en: meal.name_en,
        type: 'Meal',
        menuCategory: 'menu_1',
        isRecommended: false,
      });
      menu1Created++;
      console.log(`Created: ${meal.name_de} / ${meal.name_en}`);
    }

    // Seed Menu 2 meals
    console.log('\n=== Seeding Menu 2 meals ===\n');
    for (const meal of menu2Data) {
      // Check if meal already exists (by name_de or name_en)
      const existing = await Meal.findOne({
        type: 'Meal',
        menuCategory: 'menu_2',
        $or: [
          { name_de: meal.name_de },
          { name_en: meal.name_en }
        ]
      });

      if (existing) {
        console.log(`Skipping "${meal.name_de}" - already exists`);
        menu2Skipped++;
        continue;
      }

      await Meal.create({
        name_de: meal.name_de,
        name_en: meal.name_en,
        type: 'Meal',
        menuCategory: 'menu_2',
        isRecommended: false,
      });
      menu2Created++;
      console.log(`Created: ${meal.name_de} / ${meal.name_en}`);
    }

    console.log(`\n=== Seed completed! ===`);
    console.log(`Menu 1 - Created: ${menu1Created}, Skipped: ${menu1Skipped}`);
    console.log(`Menu 2 - Created: ${menu2Created}, Skipped: ${menu2Skipped}`);
    console.log(`Total: ${menu1Created + menu2Created} meals created\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding meals:', error);
    process.exit(1);
  }
}

seedMeals();

