# AppliCare

**Manage your job applications with ease.**  
AppliCare is a full-stack web application that helps you track and organize all your job applications in one place. It provides an intuitive dashboard for quick insights, a “Manage” page with advanced filtering/sorting, and a built-in task management system so you never miss a follow-up.

To see tests or a more detailed apporach you can read the dokumentation [here](./docs/Dokumentation.md)

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Installation](#installation)  
   - [Frontend Setup (M294)](#frontend-setup-m294)  
   - [Backend Setup (M295)](#backend-setup-m295)  
   - [Environment Variables](#environment-variables)  
4. [Usage](#usage)    
5. [License](#license)  

---

## Features

1. **User Authentication**  
   - Register with username, email, and password  
   - Login with username/email + password (JWT-based)  
   - Forgot/Reset password flow  
   - Update profile (username, email)  
   - Change password, delete account  

2. **Application Management**  
   - Create/update/delete job applications  
   - Track application status (APPLIED, PENDING, SCREENING, INTERVIEWING, OFFER, ACCEPTED, REJECTED)  
   - Capture company name, job title, location, contact details, notes, and more  
   - Filter and sort in a dedicated Manage page  

3. **Task Management**  
   - Create tasks with deadline, priority, and optional link to a job application  
   - Toggle tasks as completed/uncompleted  
   - Edit and delete tasks  

4. **Dashboard & Statistics**  
   - Quick overview of total, active, rejected, and accepted applications  
   - Track success rate  
   - Graph of applications over time  
   - Overview of tasks  

5. **Settings**  
   - Theme preference (Light, Dark, or System)  
   - Profile updates (username, email)  
   - Password changes, account deletion  

---

## Tech Stack

- **Frontend**  
  - React + Vite  
  - Ant Design  
  - Axios for API requests  

- **Backend**  
  - Spring Boot  
  - MongoDB with MongoDB Atlas  
  - JWT for authentication  
  - BCrypt for password hashing  

- **Other**  
  - Git & GitHub  
  - VS Code  
  - Maven  
  - JDK 21 or higher  

---

## Installation

### Frontend Setup (M294)

**Prerequisites**  
- Node.js 
- NPM or Yarn  

**Steps**  
1. Navigate into the `applicare_frontend/` directory.  
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. By default, the app should run at `http://localhost:5173`.  

### Backend Setup (M295)

**Prerequisites**  
- Java 21+ (OpenJDK or Oracle)  
- Maven

**Steps**  
1. Navigate into the `applicare_backend/` directory.  
2. Install dependencies and build the project:
   ```bash
   mvn clean install
   ```
3. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
4. The backend will run on `http://localhost:8080` by default.

### Environment Variables

For the app to run locally you must create a .env file with your own credentials.

1. Create a .env file in `applicare_backend/` and `applicare_backend/`
- The backend .env must be structured like this: 
   ```
   # Development Environment Configuration (create a .env.production for production)

   # Server Configuration
   SERVER_PORT=8080
   FRONTEND_URL=http://localhost:5173
   
   # MongoDB Configuration
   MONGODB_URI=your-uri
   MONGODB_DATABASE=your-database
   
   # JWT Configuration
   JWT_SECRET=your-secret
   JWT_EXPIRATION=-your-expiration in ms
   
   # Mail Configuration
   MAIL_HOST=
   MAIL_PORT=
   MAIL_USERNAME=
   MAIL_PASSWORD=
   MAIL_SMTP_AUTH=
   MAIL_SMTP_STARTTLS=
   
   # Password Reset Configuration
   APP_RESET_PASSWORD_URL=http://localhost:5173/reset-password

   ```

- The frontend .env must be structured like this:
  ```
  # Development Environment Variables (create a .env.production for production)
   VITE_API_URL=http://localhost:8080
   VITE_APP_URL=http://localhost:5173
   VITE_APP_ENV=development 
  ```

---

## Usage

- **Landing Page**  
  Access `http://localhost:5173`. If not logged in, you will see the landing page.  
- **Register / Login**  
  Use the nav bar or direct URL:  
  - `http://localhost:5173/register`  
  - `http://localhost:5173/login`  
- **Dashboard**  
  Once logged in, you can see statistics and tasks.  
- **Manage**  
  A table of all job applications with create/edit/delete.  
- **Settings**  
  Profile (username, email), password update, account deletion, theme preference, etc.  

---

## License

This project is licensed under the **Apache License 2.0**. You can view the full license [here](./LICENSE).

---

**Contact & Repository**  
- Contact: [ysz.life](https://ysz.life)
- Author: Yanis Sebastian Zürcher  

Enjoy using **AppliCare**!
