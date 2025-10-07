# Frontend Services Documentation

This directory contains all the service files that interact with the backend API.

## Services Overview

### 1. Restaurant Gallery Service (`restaurantGalleryService.js`)
Handles restaurant gallery image operations.

**Methods:**
- `getGalleryImages()` - Fetches all restaurant gallery images

**Example:**
```javascript
import { restaurantGalleryService } from './services';

const images = await restaurantGalleryService.getGalleryImages();
```

---

### 2. Restaurant Main Menu Service (`restaurantMainMenuService.js`)
Manages the restaurant's main menu PDF.

**Methods:**
- `getMainMenu()` - Fetches the main menu PDF file URL

**Example:**
```javascript
import { restaurantMainMenuService } from './services';

const menuData = await restaurantMainMenuService.getMainMenu();
console.log(menuData.pdfFile); // Cloudinary URL to the PDF
```

---

### 3. Weekly Menu Service (`weeklyMenuService.js`)
Manages weekly menu data for the restaurant.

**Methods:**
- `getWeeklyMenu()` - Fetches all weekly menu items for all days
- `getWeeklyMenuByDay(day)` - Fetches menu for a specific day (e.g., 'Monday', 'Tuesday')

**Example:**
```javascript
import { weeklyMenuService } from './services';

// Get all weekly menus
const allMenus = await weeklyMenuService.getWeeklyMenu();

// Get menu for a specific day
const mondayMenu = await weeklyMenuService.getWeeklyMenuByDay('Monday');
```

---

### 4. Meal Service (`mealService.js`)
Handles meal and soup data, including recommendations.

**Methods:**
- `getMeals(params)` - Fetches meals with optional filtering
  - `params.type` - Filter by type ('Meal' or 'Soup')
  - `params.recommended` - Filter by recommendation status ('true' or 'false')
- `getRecommendedMeals()` - Fetches only recommended meals
- `getMealsByType(type)` - Fetches meals by type ('Meal' or 'Soup')

**Example:**
```javascript
import { mealService } from './services';

// Get all meals
const allMeals = await mealService.getMeals();

// Get only recommended meals
const recommended = await mealService.getRecommendedMeals();

// Get only soups
const soups = await mealService.getMealsByType('Soup');

// Get meals with custom filters
const filteredMeals = await mealService.getMeals({ 
  type: 'Meal', 
  recommended: 'true' 
});
```

---

### 5. Room Service (`roomService.js`)
Manages hotel room data.

**Methods:**
- `getRooms(params)` - Fetches all rooms with pagination and filtering
  - `params.type` - Filter by room type ('Single Room', 'Double Room', 'Triple Room', 'Apartment', 'Suite')
  - `params.page` - Page number (default: 1)
  - `params.limit` - Items per page (default: 10)
- `getRoomById(id)` - Fetches a single room by ID
- `getRoomTypes()` - Fetches available room types
- `getRoomsByType(type)` - Fetches rooms by specific type

**Example:**
```javascript
import { roomService } from './services';

// Get all rooms with pagination
const rooms = await roomService.getRooms({ page: 1, limit: 10 });

// Get a specific room
const room = await roomService.getRoomById('room-id-123');

// Get available room types
const types = await roomService.getRoomTypes();

// Get rooms by type
const doubleRooms = await roomService.getRoomsByType('Double Room');
```

---

## API Configuration

The services use the axios instance configured in `../api/axiosConfig.js`.

**Base URL Configuration:**
- Create a `.env` file in the frontend root directory
- Add: `VITE_API_BASE_URL=http://localhost:4000/api`
- Default fallback: `http://localhost:4000/api`

---

## Error Handling

All service methods throw errors with meaningful messages that can be caught and displayed to users:

```javascript
try {
  const rooms = await roomService.getRooms();
} catch (error) {
  console.error('Failed to load rooms:', error.message);
  // Display error to user
}
```

---

## Import Methods

You can import services individually or all at once:

```javascript
// Import all services
import { 
  restaurantGalleryService,
  restaurantMainMenuService,
  weeklyMenuService, 
  mealService, 
  roomService 
} from './services';

// Or import individually
import { roomService } from './services/roomService';
```

