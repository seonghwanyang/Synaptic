# API Documentation

## Overview

Synaptic API provides RESTful endpoints for managing notes, AI processing, and user data.

## Base URL

```
Development: http://localhost:3001/api
Production: https://api.synaptic.app
```

## Authentication

All API requests require authentication using Bearer tokens:

```bash
Authorization: Bearer <your-token>
```

## Endpoints

### Notes

#### Create Note
```http
POST /api/notes
Content-Type: application/json

{
  "content": "string",
  "title": "string (optional)",
  "category_id": "uuid (optional)",
  "tags": ["string"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "string",
  "content": "string",
  "category_id": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Get Notes
```http
GET /api/notes?page=1&limit=20&search=keyword
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search keyword (optional)
- `category_id` (uuid): Filter by category (optional)
- `tags` (string[]): Filter by tags (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "content": "string",
      "category": {
        "id": "uuid",
        "name": "string"
      },
      "tags": ["string"],
      "created_at": "timestamp"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### Get Note by ID
```http
GET /api/notes/:id
```

**Response:**
```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "category": {
    "id": "uuid",
    "name": "string",
    "color": "string"
  },
  "tags": ["string"],
  "connections": [
    {
      "id": "uuid",
      "title": "string",
      "similarity": 0.95
    }
  ],
  "ai_insights": {
    "summary": "string",
    "key_points": ["string"],
    "sentiment": "positive|neutral|negative"
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Update Note
```http
PATCH /api/notes/:id
Content-Type: application/json

{
  "title": "string (optional)",
  "content": "string (optional)",
  "category_id": "uuid (optional)",
  "tags": ["string"] (optional)
}
```

#### Delete Note
```http
DELETE /api/notes/:id
```

### AI Processing

#### Process Note
```http
POST /api/ai/process
Content-Type: application/json

{
  "note_id": "uuid",
  "actions": ["categorize", "extract_tags", "find_connections", "summarize"]
}
```

**Response:**
```json
{
  "job_id": "uuid",
  "status": "processing",
  "estimated_time": 5
}
```

#### Get Processing Status
```http
GET /api/ai/process/:job_id
```

**Response:**
```json
{
  "job_id": "uuid",
  "status": "completed|processing|failed",
  "result": {
    "category": "string",
    "tags": ["string"],
    "connections": ["uuid"],
    "summary": "string"
  },
  "error": "string (if failed)"
}
```

### Search

#### Semantic Search
```http
POST /api/search/semantic
Content-Type: application/json

{
  "query": "string",
  "limit": 10,
  "threshold": 0.7
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "title": "string",
      "content": "string",
      "similarity": 0.95,
      "highlights": ["string"]
    }
  ]
}
```

### User Profile

#### Get Profile
```http
GET /api/user/profile
```

#### Update Profile
```http
PATCH /api/user/profile
Content-Type: application/json

{
  "full_name": "string",
  "username": "string",
  "bio": "string",
  "settings": {
    "theme": "light|dark",
    "language": "ko|en",
    "notifications": boolean
  }
}
```

### Capture

#### Upload File
```http
POST /api/capture/upload
Content-Type: multipart/form-data

file: <binary>
type: "image|audio"
```

**Response:**
```json
{
  "file_url": "string",
  "file_id": "uuid",
  "type": "image|audio",
  "size": 1024000
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional information
  }
}
```

### Common Error Codes

- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

- **Default**: 100 requests per minute
- **AI Processing**: 10 requests per minute
- **File Upload**: 20 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

Configure webhooks in your account settings:

```json
{
  "url": "https://your-app.com/webhook",
  "events": ["note.created", "note.processed", "note.deleted"],
  "secret": "your-webhook-secret"
}
```

### Webhook Events

- `note.created`: New note created
- `note.updated`: Note updated
- `note.deleted`: Note deleted
- `note.processed`: AI processing completed
- `connection.created`: New connection discovered

## SDK Examples

### JavaScript/TypeScript
```typescript
import { SynapticClient } from '@synaptic/sdk';

const client = new SynapticClient({
  apiKey: process.env.SYNAPTIC_API_KEY,
  baseUrl: 'https://api.synaptic.app'
});

// Create a note
const note = await client.notes.create({
  content: 'My new idea',
  tags: ['idea', 'project']
});

// Semantic search
const results = await client.search.semantic({
  query: 'machine learning projects',
  limit: 5
});
```

### Python
```python
from synaptic import SynapticClient

client = SynapticClient(
    api_key=os.environ['SYNAPTIC_API_KEY']
)

# Create a note
note = client.notes.create(
    content="My new idea",
    tags=["idea", "project"]
)

# Semantic search
results = client.search.semantic(
    query="machine learning projects",
    limit=5
)
```

## Postman Collection

Download our [Postman Collection](https://api.synaptic.app/postman-collection.json) for easy API testing.

## Support

- Documentation: https://docs.synaptic.app
- API Status: https://status.synaptic.app
- Support: support@synaptic.app