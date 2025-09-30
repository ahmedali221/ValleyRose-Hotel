## Postman
Import `postman/ValleyRose.postman_collection.json` into Postman. Set variables:
- baseUrl: `http://localhost:4000`
- token: paste JWT from login
## Setup

1. Create `.env` in project root with:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/valleyrose
JWT_SECRET=replace-with-strong-secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=valleyrose
```

2. Run: `npm run dev`

### Endpoints
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Hotels: `GET /api/hotels`, `GET /api/hotels/:id`, `POST /api/hotels` (admin), `PUT /api/hotels/:id` (admin), `DELETE /api/hotels/:id` (admin)
  - Room types: `Single`, `Double`, `Triple`

- Restaurant:
  - `GET /api/restaurant` — fetch restaurant config
  - `POST /api/restaurant/gallery` (admin, multipart `image`) — add gallery image
  - `DELETE /api/restaurant/gallery/:publicId` (admin) — remove gallery image
  - `PUT /api/restaurant/weekly-menu` (admin) — body `{ day, meals: [{title, description}] , soups: [{title, description}] }`
  - `DELETE /api/restaurant/weekly-menu/:day` (admin)
  - `POST /api/restaurant/recommendations` (admin, multipart `thumbnail`) — body `{ title, description }`
  - `DELETE /api/restaurant/recommendations/:index` (admin)
  - `POST /api/restaurant/main-menu` (admin, multipart `pdf`) — upload main menu PDF
  - `DELETE /api/restaurant/main-menu` (admin)

- Reservations:
  - `GET /api/reservations` — user sees own; admin sees all
  - `POST /api/reservations` — create reservation (hotel or restaurant)
  - `PATCH /api/reservations/:id/status` (admin) — update status
  - `DELETE /api/reservations/:id` (admin)

- Meals:
  - `GET /api/meals?type=meal|soup&active=true|false`
  - `POST /api/meals` (admin, multipart `thumbnail`) — body `{ title, description, type }`
  - `PUT /api/meals/:id` (admin, multipart `thumbnail`) — update any fields
  - `DELETE /api/meals/:id` (admin)

Image uploads (multipart form-data keys): `cover`, `thumbnail`, `gallery` (array)



