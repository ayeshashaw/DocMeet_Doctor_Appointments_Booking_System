# DocMeet - Doctor Appointment Booking System 🩺📅

## Overview
DocMeet is a comprehensive doctor appointment booking system designed to facilitate seamless interactions between patients, doctors, and administrators. The system is built using a modern tech stack and follows a microservices architecture pattern. 🌐  
**Deployed link:** https://docmeet-g0lg.onrender.com

## System Architecture

The application consists of three main components:

### 1. Frontend (Patient Portal) 👩‍⚕️
**More information about the frontend:** https://github.com/ayeshashaw/DocMeet_Doctor_Appointments_Booking_System/blob/main/frontend/README.md
- A React-based application for patients
- Features:
  - User registration and authentication 🔐
  - Doctor search and filtering 🔍
  - Appointment booking and management 📆
  - Profile management 📝
  - Medical history tracking 📖

### 2. Admin Panel 🧑‍💼
**More information:** https://github.com/ayeshashaw/DocMeet_Doctor_Appointments_Booking_System/blob/main/admin-panel/README.md
- A dedicated dashboard for system administrators
- Features:
  - Doctor management 👨‍⚕️
  - User management 👥
  - System analytics 📊
  - Appointment oversight 👁️

### 3. Backend 💻
**More information about the backend:** https://github.com/ayeshashaw/DocMeet_Doctor_Appointments_Booking_System/blob/main/backend/README.md
- Built with a Node.js/Express server
- Uses a MongoDB database
- Features:
  - RESTful API endpoints ⚙️
  - Authentication middleware 🔒
  - File upload handling 📤
  - Database operations 🗄️

## Tech Stack 🛠️

- **Frontend & Admin Panel:**
  - React.js
  - Vite
  - Context API for state management
  - Modern CSS with responsive design

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - Cloudinary for image storage 🌥️

## Getting Started 🚀

### Prerequisites
- Node.js (version 14 or higher) 🟩
- MongoDB 🗄️
- npm or yarn package manager 🎁

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/DocMeet.git
cd DocMeet
```

2. Install dependencies for all components:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install admin panel dependencies
cd ../admin-panel
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
- Create `.env` files in the backend directory.
- Configure the necessary environment variables (database connection, JWT secret, etc.). 🔑

4. Start the development servers:
```bash
# Start the backend server
cd backend
npm run dev

# Start the frontend application
cd ../frontend
npm run dev

# Start the admin panel
cd ../admin-panel
npm run dev
```

## Project Structure 🗂️

```
DocMeet/
├── frontend/            # Patient portal
├── admin-panel/         # Administrative dashboard
├── backend/             # Server and API
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── server.js        # Entry point
└── package.json         # Root package.json
```

## API Documentation 📖

The backend provides RESTful APIs for the following main functionalities:

### Authentication 🔑
- POST `/api/users/register` - User registration
- POST `/api/users/login` - User login
- POST `/api/doctors/login` - Doctor login
- POST `/api/admin/login` - Admin login

### User Operations 👨‍👩‍👧
- GET `/api/users/profile` - Retrieve user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/appointments` - Retrieve user appointments

### Doctor Operations 🩺
- GET `/api/doctors` - Retrieve all doctors
- GET `/api/doctors/:id` - Retrieve doctor details
- PUT `/api/doctors/availability` - Update doctor availability

### Appointment Management 📅
- POST `/api/appointments` - Create an appointment
- GET `/api/appointments/:id` - Retrieve appointment details
- PUT `/api/appointments/:id` - Update an appointment
- DELETE `/api/appointments/:id` - Cancel an appointment

## Contributing 🤝

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License 📜

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

## Support 🙌

For support and inquiries, please create an issue in the repository or contact the development team.
