
# 🏥 Hospital Management System – Microservices Architecture

A robust and scalable full-stack hospital management system built using:

- 🔧 **Backend**: NestJS Microservices (`TCP`, `MessagePattern`, `Role-based JWT`)
- 🌐 **API Gateway**: Acts as entrypoint and request router
- 💠 **Frontend**: React.js + Chakra UI (Dashboard theme)
- 📡 **Real-time**: WebSocket-based Notification System
- 🧾 **Database**: PostgreSQL (per microservice)

---

## 📦 Project Structure

```bash
hospital-system/
├── gateway/
├── services/
│   ├── auth-service/
│   ├── patient-service/
│   ├── doctor-service/
│   ├── appointment-service/
│   └── notification-service/
└── frontend/   (ReactJS + Chakra UI)
```

---

## 🧠 Architecture Overview

### 🧩 Microservice Architecture Pattern

![Architecture](docs/microservice-architecture.png)

- **API Gateway** receives client requests
- It communicates with internal services via `@MessagePattern` over `TCP`
- Each microservice has its own PostgreSQL DB schema
- **Notification service** uses WebSocket (`socket.io`) to push real-time alerts
- **Role-Based Access Control** ensures proper data access

---

## 🚀 How to Run

### 1️⃣ Backend Services

```bash
# For each service:
cd services/auth-service
npm install
npm run start:dev
```

Repeat for:
- `patient-service`
- `doctor-service`
- `appointment-service`
- `notification-service`

### 2️⃣ API Gateway

```bash
cd gateway
npm install
npm run start:dev
```

### 3️⃣ Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Authentication

- **Register**: `POST /auth/register`
- **Login**: `POST /auth/login`
- JWT is returned, store in localStorage
- Frontend uses role-based `ProtectedRoute` to show/hide components

---

## 🧾 API Reference

### 🔐 Auth Service
| Method | Endpoint          | Description             |
|--------|-------------------|-------------------------|
| POST   | `/auth/register`  | Register new user       |
| POST   | `/auth/login`     | Login and get JWT       |
| GET    | `/auth/users`     | Get all users (admin)   |
| PUT    | `/auth/users/:id` | Update user (admin)     |
| DELETE | `/auth/users/:id`| Delete user (admin)     |

### 🩺 Patient Service
| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| GET    | `/patients`    | Get all patients      |
| POST   | `/patients`    | Add new patient       |
| PUT    | `/patients/:id`| Edit patient          |
| DELETE | `/patients/:id`| Delete patient        |

### 🧑‍⚕️ Doctor Service
| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| GET    | `/doctors`     | List doctors          |
| POST   | `/doctors`     | Add new doctor        |
| PUT    | `/doctors/:id` | Edit doctor           |
| DELETE | `/doctors/:id` | Delete doctor         |

### 📆 Appointment Service
| Method | Endpoint         | Description             |
|--------|------------------|-------------------------|
| GET    | `/appointments`  | List appointments       |
| POST   | `/appointments`  | Create appointment      |
| PUT    | `/appointments/:id`| Update appointment    |
| DELETE | `/appointments/:id`| Delete appointment    |

### 🔔 Notification Service
| Method | Endpoint                   | Description                      |
|--------|----------------------------|----------------------------------|
| GET    | `/notifications`           | List all notifications           |
| POST   | `/notifications/send`      | Send notification manually       |
| PUT    | `/notifications/:id/read`  | Toggle read status               |
| PUT    | `/notifications/:id/retry` | Retry failed delivery            |

---

## 📡 WebSocket Notifications

- Backend: `notification.gateway.ts` with `@WebSocketGateway`
- Clients `join` rooms via: `socket.emit('join', { userId })`
- Admin can send real-time updates to:
  - Doctors (for new appointments)
  - Patients (for test results)
  - Nurses (on shift or alerts)

---

## 📊 Frontend Highlights

- Chakra UI-based dashboard
- Role-based routes (`admin`, `doctor`, `patient`)
- Live WebSocket notifications
- ProtectedRoute logic for route guarding
- Reusable Layout (`Sidebar`, `Header`)
- Axios + Context for Auth

---

## 🧠 Noteworthy Questions & Answers

### Q: Why Microservices over Monolith?
- Easy to scale independently
- Loose coupling per domain (Auth, Patient, etc.)
- Better team collaboration

### Q: Why `@MessagePattern` + TCP?
- Decouples communication
- Faster & structured command pattern
- Built-in support in NestJS microservices

### Q: How is Role-Based Access enforced?
- Backend: Custom `@Roles()` Guard + JWT Strategy
- Frontend: Context + conditionally rendered menu via `MenuLinks.js`

### Q: How does WebSocket work?
- Server emits to `user-{id}` room
- Frontend joins room after login
- Notifications received in real-time

---

## 🛡️ Security

- JWT used for authentication
- Role guard on all protected backend routes
- Sensitive env values ignored via `.gitignore`

---


> 🚀 Built with ❤️ using NestJS & React for real-world hospital operations from Tarun.
