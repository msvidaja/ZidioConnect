# ZIDIOConnect (Java 17)

A web-based portal for managing internships and job opportunities, updated for Java 17 and Spring Boot 3.2.0.

## Setup Instructions

### Backend
1. **Prerequisites**:
   - Java 17 (JDK 17): Verify with `java -version`.
   - Maven: Verify with `mvn -version`.
   - MySQL: Ensure it’s running.
2. **Database Setup**:
   - Create a MySQL database named `zidioconnect`.
   - Update `backend/src/main/resources/application.properties` with your MySQL username and password:
     ```properties
     spring.datasource.password=your_actual_password
     ```
3. **Run Backend**:
   - Navigate to `backend/`.
   - Run:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```
   - Backend will run on `http://localhost:8080`.

### Frontend
1. **Prerequisites**:
   - Node.js
2. **Install Dependencies**:
   - Navigate to `frontend/`.
   - Run `npm install`.
3. **Run Frontend**:
   - Serve `frontend/public/index.html` using a static server (e.g., `npx serve`).
   - Frontend will be accessible in the browser.

### Postman API Testing
Refer to the original project documentation for Postman instructions.

## Database Schema
- **User**: id, email, password, role, name
- **Student**: id, name, email, course, university, resumeUrl
- **Recruiter**: id, companyName, recruiterName, recruiterEmail, designation
- **Job**: id, title, description, jobType, location, datePosted, recruiterEmail
- **Application**: id, jobId, studentEmail, status
```