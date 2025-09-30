ValleyRose Backend
===================

A Node.js + Express + MongoDB backend for the ValleyRose hotel and restaurant platform. Includes authentication (JWT), role-based authorization, Cloudinary-backed uploads, reservations, meals and restaurant content modules.

Quick Start
-----------

1) Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

2) Install
```bash
cd backend
npm install
```

3) Configure environment
Create a `.env` file inside `backend/`:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/valleyrose
JWT_SECRET=replace-with-strong-secret

# Cloudinary (optional but required for image/pdf uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=valleyrose
```

4) Run
```bash
npm run dev
```
API will be available at `http://localhost:4000`. Health check: `GET /health`.

Project Structure
-----------------

```text
backend/
  src/
    server.js                # Express app bootstrap and route mounting
    setup/
      db.js                  # Mongoose connection (uses MONGO_URI)
      cloudinary.js          # Cloudinary + multer storage config
    middleware/
      auth.js                # authenticate (JWT) and authorize (roles)
    modules/
      auth/                  # register/login, user model
      room/                  # room CRUD
      customer/              # customers
      offlineReservation/    # offline reservations
      payment/               # payments
      analytics/             # hotel analytics
      meal/                  # meals and soups
      weeklyMenu/            # weekly menu management
      restaurantGallery/     # gallery image upload/delete
      restaurantMainMenu/    # main menu (PDF) upload/delete
  postman/ValleyRose.postman_collection.json
  package.json
```

Scripts
-------

From within `backend/`:

```json
{
  "dev": "nodemon src/server.js",
  "start": "node src/server.js"
}
```

Core Environment Variables
--------------------------

- `PORT`: API port (default 4000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for signing access tokens
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`: Uploads configuration

Authentication & Authorization
------------------------------

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Pass token as `Authorization: Bearer <jwt>`
- Role-based guard via middleware `authorize('admin' | 'user')`

API Overview
------------

- Health: `GET /health`
- Rooms: `GET /api/rooms`, `POST /api/rooms` (admin), `PUT /api/rooms/:id` (admin), `DELETE /api/rooms/:id` (admin)
- Customers: `GET/POST/PUT/DELETE /api/customers...`
- Offline Reservations: `GET/POST/PUT/DELETE /api/offline-reservations...`
- Payments: `GET/POST/PUT/DELETE /api/payments...`
- Analytics: `GET /api/analytics/...`
- Meals: `GET /api/meals?type=meal|soup&active=true|false`, `POST /api/meals` (admin, multipart `thumbnail`), `PUT /api/meals/:id` (admin), `DELETE /api/meals/:id` (admin)
- Weekly Menu: `PUT /api/weekly-menu` (admin), `DELETE /api/weekly-menu/:day` (admin)
- Restaurant Gallery: `POST /api/restaurant-gallery` (admin, multipart `image`), `DELETE /api/restaurant-gallery/:publicId` (admin)
- Restaurant Main Menu: `POST /api/restaurant-main-menu` (admin, multipart `pdf`), `DELETE /api/restaurant-main-menu` (admin)

Uploads
-------

- Multipart form-data keys used across modules: `cover`, `thumbnail`, `image`, `gallery[]`
- Cloudinary resource type is set to `auto` to allow images and PDFs

Postman Collection
------------------

Import `backend/postman/ValleyRose.postman_collection.json`.
- Set variables:
  - `baseUrl`: `http://localhost:4000`
  - `token`: paste JWT from login

Deployment Notes
----------------

- Set all required env vars in your hosting environment
- Ensure database connectivity (IP allowlist if using Atlas)
- Use `npm run start` for production

License
-------

ISC



