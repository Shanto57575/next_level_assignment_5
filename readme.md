# 📦 Parcel Delivery System API

A secure, modular, and role-based backend API for managing parcel deliveries — inspired by popular courier platforms like **Pathao Courier** or **Sundarban Courier**.

This system supports **user authentication**, **role-based access control**, **parcel creation**, **status updates**, and **real-time parcel tracking** using modern backend technologies.

---

## ✨ Features

- 🔐 JWT-based Authentication (Access + Refresh tokens)
- 👤 Role-based Access (Admin, Sender, Receiver)
- 🧾 User Management (create, update role/status, get all)
- 📦 Parcel Management (create, update status, view by role)
- 🛰️ Parcel Tracking via `statusLogs[]`
- ⚙️ Zod-based request validation
- 🧱 Modular folder structure for scalability

---

## 🧱 Tech Stack

| Layer          | Technology                         |
|----------------|-------------------------------------|
| Runtime        | Node.js                             |
| Framework      | Express.js                          |
| Language       | TypeScript                          |
| Database       | MongoDB Atlas + Mongoose            |
| Validation     | Zod                                 |
| Authentication | JWT (access + refresh)              |
| Security       | Bcrypt (password hashing)           |
| Deployment     | Vercel 

---

## ⚙️ Setup Instructions

1. **Clone the Repository**
````
git clone https://github.com/Shanto57575/next_level_assignment_5.git

cd parcel_delivery_system_backend
````
2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Create a `.env` file using `.env.sample` as reference

4. **Run the Server**

```bash
npm run dev
```

---

## 🧍 User Endpoints

### ✅ Register New User

`POST /api/v1/user/create-user`

```json
{
  "name": "user1",
  "email": "user1@gmail.com",
  "password": "User!!!1234"
}
```

> 🔒 Password must include:
>
> * At least 8 characters
> * One lowercase, uppercase, digit, and special character (@#\$%!^&\*?)

---

### ✅ Update User Role / Status (Admin Only)

`PATCH /api/v1/user/:userId`

```json
{
  "role": "RECEIVER",
  "isActive": "ACTIVE"
}
```

---

### ✅ Get All Users (Admin Only)

`GET /api/v1/user/all-users`

No request body required.

---

## 🔐 Auth Endpoints

### ✅ Login

`POST /api/v1/auth/login`

```json
{
  "email": "your@email.com",
  "password": "YourPassword"
}
```

**Response Example:**

```json
{
  "accessToken": "JWT_ACCESS_TOKEN",
  "refreshToken": "JWT_REFRESH_TOKEN",
  "user": {
    "_id": "...",
    "email": "...",
    "role": "SENDER"
  }
}
```

🔐 Use the `accessToken` in headers:

```
Authorization: <accessToken>
```

---

## 📦 Parcel Endpoints

### ✅ Create Parcel (Sender Only)

`POST /api/v1/parcel/create-parcel`

```json
{
  "parcelType": "PACKAGE",
  "weight": 5,
  "sender": "688bb40f1045d66c869c3369",
  "receiver": "688c827f1ed775d72242fa1a",
  "address": "Halishahar, Chittagong",
  "fee": 100,
  "deliveryDate": "2025-08-03"
}
```

---

### ✅ Update Parcel Status

`PATCH /api/v1/parcel/:parcelId`

```json
{
  "parcelType": "DOCUMENT",
  "weight": 3.5,
  "statusLog": {
    "status": "CANCELLED"
  }
}
```

> 🧠 Role-based rules:
>
> * **Sender**: can cancel if not dispatched
> * **Receiver**: can confirm delivery
> * **Admin**: can update all statuses except confirm

---

### ✅ View My Parcels (Sender/Receiver)

`GET /api/v1/parcel/my-parcels/:userId?status=DISPATCHED`

* Filters parcels by latest statusLog status

---

### ✅ View All Parcels (Admin Only)

`GET /api/v1/parcel/all-parcels`

No request body required.

---

## 📈 Parcel Status Tracking

Each parcel contains an array of status logs:

```json
"statusLog": [
  {
    "status": "REQUESTED",
    "timestamp": "2025-08-01T12:00:00Z",
    "updatedBy": "sender"
  },
  {
    "status": "DISPATCHED",
    "timestamp": "2025-08-02T14:00:00Z",
    "updatedBy": "admin"
  }
]
```

> The **last statusLog entry** defines the current status of the parcel.

---

## 🧪 API Testing Notes

* Use **Postman**
* Add `Authorization: <accessToken>` to test protected routes
* All requests validated via **Zod** and return proper `statusCode` + messages
* Common error formats:

  ```json
  {
    "statusCode": 403,
    "message": "Unauthorized access"
  }
  ```

---

## 📜 Business Rules Summary

| Rule                                                               | Role      |
| ------------------------------------------------------------------ | --------- |
| ❌ Sender **cannot cancel** after dispatch                          | Sender    |
| ✅ Receiver can only **confirm** delivery if dispatched             | Receiver  |
| ❌ Admin **cannot confirm**, but can update all other statuses      | Admin     |
| ❌ Blocked users (`isActive: BLOCKED`) **cannot access** the system | Admin |

---

## 🧩 Project Structure

> Organized by **feature-based modular structure**:

```
src/
│
app/
│
modules/
    ├── auth/        # Login & Token logic
    ├── user/        # User model, routes, controller
    ├── parcel/      # Parcel model, routes, controller
│
├── middleware/  # Auth checks, error handling
├── utils/       # Token helpers
├── config/      # Environment config
```

> 🧠 The folder structure will be explained in the **video demo**

---

## 🚀 Demo & Video Walkthrough

🎥 **Project Walkthrough Video**
[▶️ Watch on Google Drive](https://drive.google.com/file/d/1nWAayCB3bvprsaMFI3wV6LAm7qb0IDoE/view?usp=sharing)

🌐 **Live API Endpoint**
[🔗 Visit API (Vercel Hosted)](https://parcel-delivery-system-backend-umber.vercel.app)

---