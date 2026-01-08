# API Contract

## Base URL

**Phase 2 Development:** `http://localhost:3000/api`  
**Phase 2 Production:** `https://api.afrocat-sports.com/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### POST /auth/request-otp
Request OTP for email login.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```

#### POST /auth/verify-otp
Verify OTP and receive tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "Player",
    "status": "Approved"
  }
}
```

### Users

#### GET /users
List users (Admin/Manager only).

#### POST /users
Register new user (public endpoint).

#### PATCH /users/:id/approve
Approve user registration (Admin only).

#### PATCH /users/:id/reject
Reject user registration (Admin only).

### Teams, Matches, Attendance, Injuries, Finance, Awards

See full API documentation in the repository for complete endpoint details.

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Rate Limit Exceeded
- `500`: Internal Server Error

