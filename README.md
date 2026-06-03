# Smart Campus Resource Booking System

## Overview

The Smart Campus Resource Booking System is a full-stack web application developed to streamline the management and booking of campus resources such as laboratories, lecture halls, meeting rooms, and equipment.

The system allows users to create and manage bookings while providing administrators with complete control over resources, booking approvals, and user management. The application follows a modern client-server architecture using React for the frontend, Spring Boot for the backend, and MySQL as the database.

---

## Features

### Resource Management
- View all available campus resources
- Search and filter resources by type, capacity, and location
- Create new resources (Admin only)
- Update resource information (Admin only)
- Delete resources (Admin only)
- Manage resource status (ACTIVE / OUT_OF_SERVICE)

### Booking Management
- Create booking requests
- View booking history
- Edit existing bookings
- Cancel bookings
- Booking approval workflow:
  - Pending
  - Approved
  - Rejected
  - Cancelled

### Authentication & Authorization
- Google OAuth 2.0 login
- Secure authentication using Spring Security
- Role-based access control
- Separate privileges for USER and ADMIN roles

### User Management
- View registered users
- Admin-only access to user management

### Dashboard
- Display booking statistics
- Display resource statistics
- Quick navigation to system modules

---

## Technology Stack

### Frontend
- React.js
- React Router DOM
- JavaScript (ES6+)
- CSS3
- Vite

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- OAuth2 Client
- Hibernate

### Database
- MySQL

### Development Tools
- Visual Studio Code
- IntelliJ IDEA
- Thunder Client
- Git
- GitHub

---

## Project Architecture

Frontend (React)
↓
REST API
↓
Backend (Spring Boot)
↓
JPA / Hibernate
↓
MySQL Database

---

## Frontend Structure

```text
frontend/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   └── Sidebar.jsx
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Resources.jsx
│   │   ├── Bookings.jsx
│   │   ├── CreateBooking.jsx
│   │   └── Users.jsx
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
```

## Backend Structure

```text
backend/
│
├── controller/
│   ├── ResourceController.java
│   ├── BookingController.java
│   └── UserController.java
│
├── service/
│   ├── ResourceService.java
│   ├── BookingService.java
│   ├── OAuth2UserServiceImpl.java
│   └── CustomUserDetailsService.java
│
├── repository/
│   ├── ResourceRepository.java
│   ├── BookingRepository.java
│   └── UserRepository.java
│
├── entity/
│   ├── Resource.java
│   ├── Booking.java
│   └── User.java
│
├── dto/
├── exception/
├── security/
└── model/enums/
```

---

## Database Entities

### Resource
- id
- name
- type
- capacity
- location
- status

### Booking
- id
- bookedBy
- resource
- startTime
- endTime
- status
- rejectionReason

### User
- id
- username
- role

---

## REST API Endpoints

### Resource APIs

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /api/resources | Get all resources |
| GET | /api/resources/{id} | Get resource by ID |
| POST | /api/resources | Create resource |
| PUT | /api/resources/{id} | Update resource |
| DELETE | /api/resources/{id} | Delete resource |

### Booking APIs

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /api/bookings | Get all bookings |
| POST | /api/bookings | Create booking |
| PUT | /api/bookings/{id}/approve | Approve booking |
| PUT | /api/bookings/{id}/reject | Reject booking |
| DELETE | /api/bookings/{id} | Cancel booking |

### User APIs

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /api/users | Get all users |

---

## Security Features

- OAuth2 Authentication using Google
- Spring Security Integration
- Role-Based Access Control
- Protected Administrative Operations
- Session-Based Authentication
- Secure API Access

---

## Testing

The application was tested using:

- Thunder Client API Testing
- Browser-Based Functional Testing
- CRUD Operation Testing
- Authentication Testing
- Authorization Testing
- Booking Workflow Testing
- Resource Management Testing

---

## Learning Outcomes

Through this project, I gained practical experience in:

- Full-Stack Web Development
- React Frontend Development
- Spring Boot Backend Development
- REST API Design
- MySQL Database Integration
- OAuth2 Authentication
- Spring Security
- Git & GitHub Version Control
- API Testing and Debugging
- Frontend-Backend Integration

---

## Future Enhancements

- Email notifications for booking approvals
- Resource usage analytics
- Booking calendar integration
- Admin reporting dashboard
- Real-time booking updates
- JWT Authentication

---

## Author

**Nethum Pabasara**  
B.Sc. (Hons) Information Technology specialized in Data Science 
Sri Lanka Institute of Information Technology (SLIIT)
