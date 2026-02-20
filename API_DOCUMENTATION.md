# Stay-Safe API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Endpoints

### Health Check

#### GET /health

Check if the API is running.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.45
  }
}
```

---

### User Endpoints

#### POST /api/users/register

Register a new user.

**Request Body:**
```json
{
  "username": "micah",
  "password": "Pass1234",
  "age": 25,
  "gender": "male",
  "email": "micah@example.com",
  "termsAccepted": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "micah",
      "age": 25,
      "gender": "male",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/users/login

Login existing user.

**Request Body:**
```json
{
  "username": "micah",
  "password": "Pass1234"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here"
  }
}
```

#### GET /api/users/me

Get current user profile. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "micah",
    "age": 25,
    "gender": "male",
    "email": "micah@example.com"
  }
}
```

#### PATCH /api/users/me

Update user profile. **Requires authentication.**

**Request Body:**
```json
{
  "age": 26,
  "location": "Nairobi, Kenya"
}
```

#### GET /api/users/me/preferences

Get user preferences. **Requires authentication.**

#### PATCH /api/users/me/preferences

Update user preferences. **Requires authentication.**

#### DELETE /api/users/me

Delete user account. **Requires authentication.**

---

### Assessment Endpoints

#### POST /api/assessments

Submit a new assessment. **Requires authentication.**

**Request Body:**
```json
{
  "userId": "user_uuid",
  "category": "sti-risk",
  "responses": [
    {
      "questionId": "q1",
      "question": "Are you sexually active?",
      "answer": "yes",
      "category": "sti-risk"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "assessment_uuid",
    "userId": "user_uuid",
    "category": "sti-risk",
    "riskLevel": "moderate",
    "score": 65,
    "aiAnalysis": "Based on your responses...",
    "recommendations": ["Get tested", "Use protection"],
    "resources": [
      {
        "title": "STI Prevention Guide",
        "description": "Learn about STI prevention",
        "type": "article"
      }
    ]
  }
}
```

#### GET /api/assessments

Get assessment history. **Requires authentication.**

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

#### GET /api/assessments/:id

Get specific assessment. **Requires authentication.**

#### GET /api/assessments/category/:category

Get assessments by category. **Requires authentication.**

#### GET /api/assessments/stats/me

Get assessment statistics. **Requires authentication.**

#### DELETE /api/assessments/:id

Delete an assessment. **Requires authentication.**

---

### AI Endpoints

#### POST /api/ai/chat

Chat with AI assistant. **Requires authentication.**

**Request Body:**
```json
{
  "message": "What should I know about contraception?",
  "history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help?"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "AI response here...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/ai/health-tips

Get personalized health tips. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "data": {
    "tips": [
      "Tip 1",
      "Tip 2",
      "Tip 3"
    ]
  }
}
```

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": {
    "message": "Error message here",
    "code": "ERROR_CODE",
    "details": { /* optional */ }
  }
}
```

**Common HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate resource)
- 500: Internal Server Error

## Assessment Categories

- `contraception`
- `sti-risk`
- `pregnancy`
- `menstrual-health`
- `sexual-health`
- `mental-health`
- `general-wellness`

## Risk Levels

- `low`
- `moderate`
- `high`
- `critical`