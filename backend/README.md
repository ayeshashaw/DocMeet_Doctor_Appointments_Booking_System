# DocMeet Backend Documentation

## System Overview
DocMeet is a doctor appointment booking system with three main user types: patients, doctors, and administrators. The backend is built using Node.js with Express.js framework and MongoDB database.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **File Storage**: Cloudinary
- **Authentication**: JWT (JSON Web Tokens)

## API Endpoints

### User Routes (`/api/user`)
- **POST** `/register` - Register new user
- **POST** `/login` - User login
- **GET** `/get-profile` - Get user profile (Auth required)
- **PUT** `/update-profile` - Update user profile with image (Auth required)
- **POST** `/book-appointment` - Book a doctor appointment
- **POST** `/cancel-appointment` - Cancel an appointment (Auth required)
- **GET** `/appointments` - List user appointments (Auth required)

### Doctor Routes (`/api/doctor`)
- **GET** `/list` - Get list of all doctors
- **POST** `/login` - Doctor login
- **GET** `/appointments` - View doctor's appointments (Auth required)
- **POST** `/appointment-completed` - Mark appointment as completed (Auth required)
- **POST** `/appointment-cancelled` - Cancel appointment (Auth required)
- **GET** `/dashboard` - View doctor dashboard (Auth required)
- **GET** `/profile` - Get doctor profile (Auth required)
- **POST** `/update-profile` - Update doctor profile (Auth required)

### Admin Routes (`/api/admin`)
- **POST** `/login` - Admin login
- **POST** `/add-doctor` - Add new doctor with image upload (Auth required)
- **GET** `/all-doctors` - List all doctors (Auth required)
- **POST** `/change-availablity` - Update doctor availability (Auth required)
- **GET** `/appointments` - View all appointments (Auth required)
- **POST** `/cancel-appointments` - Cancel appointments (Auth required)
- **GET** `/dashboard` - View admin dashboard (Auth required)

## Authentication
The system uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header.

### Middleware
- `authUser` - Authenticates regular users
- `authDoctor` - Authenticates doctors
- `authAdmin` - Authenticates administrators

## File Upload
- Image uploads are handled using Multer middleware
- Images are stored in Cloudinary cloud storage
- Supported for user profile pictures and doctor profile images

## Project Structure
```
backend/
├── config/           # Configuration files
│   ├── Cloudinary.js # Cloudinary setup
│   └── MongoDB.js    # Database connection
├── controllers/      # Route controllers
│   ├── adminController.js
│   ├── doctorController.js
│   └── userControllers.js
├── middlewears/      # Custom middleware
│   ├── authAdmin.js
│   ├── authDoctor.js
│   ├── authUsers.js
│   └── multer.js
├── models/          # Database models
│   ├── appointmentsModels.js
│   ├── doctorsModels.js
│   └── userModels.js
├── routes/          # API routes
│   ├── adminRoutes.js
│   ├── doctorRoutes.js
│   └── userRoutes.js
├── uploads/         # Temporary upload directory
├── server.js        # Main application file
└── DEPLOYMENT.md    # Deployment instructions
```

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in `.env` file
3. Start the development server:
   ```bash
   npm run dev
   ```
4. For production deployment, refer to `DEPLOYMENT.md`

## Error Handling
The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security Measures
- Password hashing
- JWT token authentication
- Input validation
- File upload restrictions
- CORS enabled
- Secure headers

## API Response Format
All API responses follow a standard format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {} // Optional response data
}
```
