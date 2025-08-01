# 📦 Parcel Delivery System API

A secure, modular, and role-based backend API for managing parcel deliveries, inspired by platforms like Pathao Courier or Sundarban. This API supports authentication, role-based access, parcel tracking, and status updates — all built using **Express.js**, **MongoDB Atlas**, **TypeScript**, and **Zod** validation.

---

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB Atlas with Mongoose
- **Validation**: Zod
- **Auth**: JWT (Access & Refresh tokens)
- **Security**: Bcrypt for password hashing

---

## ⚙️ Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/Shanto57575/next_level_assignment_5.git
cd parcel_delivery_system_backend
````

2. **Install Dependencies**

```bash
npm install
```

3. **Set Up Environment Variables**

Create a `.env` file using `.env.sample` as reference

4. **Run the Server**

```bash
npm run dev
```

---

## 🔐 Authentication & Roles

* **Admin**: Can manage users and parcels, update most parcel statuses
* **Sender**: Can create, cancel, and track view own parcels
* **Receiver**: Can confirm delivery, view incoming parcels(through filter)

---

## 🧍 User Endpoints

### ✅ Register New User

`POST /api/v1/user/create-user`

```json
{
  "name": "user1",
  "email": "user1@gmail.com",
  "password": "User!!!1234" (Password must be 8+ characters with at least one lowercase, uppercase, digit, and special character (@#$%!^&*?).)
}
```

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

### ✅ Get All Users

`GET /api/v1/user/all-users`

---

## 🔐 Auth Endpoints

### ✅ Login

`POST /api/v1/auth/login`

```json
{
  "email": "yourAdminAcccunt@gmail.com",
  "password": "adminPassword"
}
```

Returns:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {}
}
```

Add to header for protected routes:

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

Depending on the role:

* **Sender**: can `CANCEL` if not dispatched
* **Receiver**: can `CONFIRM` if dispatched
* **Admin**: can update any status except confirming

```json
{
  "parcelType": "DOCUMENT",
  "weight": 3.5,
  "statusLog": {
    "status": "CANCELLED"
  }
}
```

---

### ✅ View My Parcels (Sender/Receiver)

`GET /api/v1/parcel/my-parcels/:userId?status=DISPATCHED`

* Automatically filters based on last `statusLog`
* Works for both sender and receiver

---

### ✅ View All Parcels (Admin Only)

`GET /api/v1/parcel/all-parcels`

*No body required*

---

## 🔁 Parcel Status Tracking

Each parcel contains an embedded `statusLog[]` array:

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

The **latest entry** in the statusLogs array determines the current status.

---

## ✅ Business Rules

* ❌ Senders **cannot cancel** if parcel is already dispatched
* ✅ Receivers can **only confirm** delivery
* ❌ Admins cannot **confirm** delivery, but can update all other statuses
* ✅ Blocked (`isActive: BLOCKED`) users are restricted from access

---

## 🧪 API Testing Notes

* Test using **Postman** with tokens in `Authorization` header
* Each response includes proper `statusCode` and error messages
* All endpoints validated using **Zod**

---

## 🧩 Modules & Design

* Modular folder structure used (`auth/`, `user/`, `parcel/`)
* Controllers, services, routes, and validation schemas separated
* Folder structure will be shown during **video walkthrough**

---

## 🚀 Demo & Preview

🎥 **Project Walkthrough Video**

[📺 Watch Video](https://drive.google.com/file/d/1nWAayCB3bvprsaMFI3wV6LAm7qb0IDoE/view?usp=sharing)

🌐 **Live API Deployment**

[🔗 Live Link](https://parcel-delivery-system-backend-umber.vercel.app)

---