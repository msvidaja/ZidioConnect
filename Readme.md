# ZIDIO Connect - Job and Internship Portal

A full-stack web application connecting students with recruiters for job and internship opportunities. Built with Spring Boot (Java) backend and React frontend.

## Features

### For Students
- Browse available job and internship opportunities
- Apply to positions with one click
- Track application status
- Build and manage professional profile
- Search jobs by title, description, or location

### For Recruiters
- Post job and internship opportunities
- Review and manage applications
- View candidate profiles
- Streamline hiring process

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **MySQL** database
- **Maven** for dependency management

### Frontend
- **React 19**
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls
- **Vite** for build tooling

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Setup Instructions

### 1. Database Setup

1. Install and start MySQL server
2. Create a database (optional - will be created automatically if it doesn't exist)
3. Update database credentials in `backend/src/main/resources/application.properties` if needed

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/validate` - Validate JWT token

### Students
- `POST /api/students/profile` - Update student profile
- `GET /api/students/profile/{email}` - Get student profile

### Recruiters
- `POST /api/recruiters/profile` - Update recruiter profile
- `GET /api/recruiters/all` - Get all recruiters
- `GET /api/recruiters/{email}` - Get recruiter by email

### Jobs
- `POST /api/jobs/post` - Post new job (Recruiter only)
- `GET /api/jobs/recruiter` - Get jobs by recruiter
- `GET /api/jobs/all` - Get all jobs
- `POST /api/jobs/apply` - Apply for job (Student only)
- `GET /api/jobs/applications/{jobId}` - Get applications for job
- `GET /api/jobs/applications/student` - Get student applications

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password (Encrypted)
- role (STUDENT/RECRUITER)
- name

### Students Table
- id (Primary Key)
- user_id (Foreign Key to Users)
- course
- university
- major
- gpa
- resume_url

### Recruiters Table
- id (Primary Key)
- user_id (Foreign Key to Users)
- company_name
- designation

### Jobs Table
- id (Primary Key)
- title
- description
- job_type
- location
- date_posted
- recruiter_id (Foreign Key to Recruiters)

### Applications Table
- id (Primary Key)
- student_id (Foreign Key to Students)
- job_id (Foreign Key to Jobs)
- application_date
- status (PENDING/REVIEWING/ACCEPTED/REJECTED)
- cover_letter

## Usage

### For Students
1. Register with student role
2. Complete your profile with educational details
3. Browse available jobs
4. Apply to positions you're interested in
5. Track your application status

### For Recruiters
1. Register with recruiter role
2. Complete your company profile
3. Post job opportunities
4. Review applications from students
5. Manage your hiring pipeline

## Security Features

- JWT-based authentication
- Role-based access control
- Password encryption with BCrypt
- CORS configuration for frontend integration
- Input validation and sanitization

## Development

### Backend Development
- The application uses Spring Boot's auto-configuration
- JPA entities are automatically mapped to database tables
- JWT tokens are used for stateless authentication
- All endpoints are secured based on user roles

### Frontend Development
- React hooks for state management
- Context API for authentication state
- Responsive design with Tailwind CSS
- Modern UI components with Lucide icons

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `application.properties`
   - Verify database exists or allow auto-creation

2. **Frontend Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **CORS Issues**
   - Ensure backend is running on port 8080
   - Check CORS configuration in SecurityConfig

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify user role in database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.