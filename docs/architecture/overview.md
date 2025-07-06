# System Architecture Overview

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                  Frontend                                 │
│                            Next.js 14 (App Router)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │   Pages     │  │  Components  │  │    Hooks    │  │    Stores    │ │
│  │             │  │              │  │             │  │   (Zustand)  │ │
│  │ - Dashboard │  │ - QuickCapture│  │ - useAuth   │  │ - authStore  │ │
│  │ - Notes     │  │ - NoteEditor │  │ - useCapture│  │ - noteStore  │ │
│  │ - Network   │  │ - Network3D  │  │ - useAI     │  │ - uiStore    │ │
│  └─────────────┘  └──────────────┘  └─────────────┘  └──────────────┘ │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  │ HTTP/WebSocket
                                  │
┌─────────────────────────────────┴───────────────────────────────────────┐
│                                Backend API                                │
│                          Node.js + Express + Supabase                    │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │   Routes    │  │  Middleware  │  │  Services   │  │    Utils     │ │
│  │             │  │              │  │             │  │              │ │
│  │ - /notes    │  │ - auth       │  │ - noteService│  │ - validators │ │
│  │ - /ai       │  │ - rateLimit  │  │ - aiService │  │ - helpers    │ │
│  │ - /search   │  │ - error      │  │ - searchSvc │  │ - logger     │ │
│  └─────────────┘  └──────────────┘  └─────────────┘  └──────────────┘ │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
┌───────────────────┴────────────┐   ┌─────────┴────────────────────────┐
│          Supabase              │   │           AI Services              │
│  ┌──────────┐  ┌────────────┐ │   │  ┌─────────┐  ┌────────────────┐ │
│  │   Auth   │  │  Database  │ │   │  │ OpenAI  │  │   LangChain    │ │
│  │          │  │            │ │   │  │   API   │  │                │ │
│  │ - OAuth  │  │ - PostgreSQL│ │   │  │ - GPT-4 │  │ - Chains       │ │
│  │ - Email  │  │ - pgvector │ │   │  │ - Embed │  │ - Agents       │ │
│  │ - JWT    │  │ - Realtime │ │   │  │         │  │ - Memory       │ │
│  └──────────┘  └────────────┘ │   │  └─────────┘  └────────────────┘ │
│                                │   │                                    │
│  ┌──────────┐  ┌────────────┐ │   │  ┌─────────────────────────────┐ │
│  │ Storage  │  │ Edge Func  │ │   │  │    Processing Pipeline      │ │
│  │          │  │            │ │   │  │                             │ │
│  │ - Images │  │ - Webhooks │ │   │  │ 1. Categorization           │ │
│  │ - Audio  │  │ - Triggers │ │   │  │ 2. Tag Extraction           │ │
│  │ - Files  │  │            │ │   │  │ 3. Embedding Generation     │ │
│  └──────────┘  └────────────┘ │   │  │ 4. Connection Discovery     │ │
└────────────────────────────────┘   │  │ 5. Summarization            │ │
                                     │  └─────────────────────────────┘ │
                                     └────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Note Creation Flow
```
User Input → Quick Capture → Frontend Validation → API Request
    ↓
Backend API → Auth Check → Data Validation → Save to Database
    ↓
AI Queue → Process Note → Update Database → Notify Frontend
    ↓
Real-time Update → UI Update → User Notification
```

### 2. Search Flow
```
Search Query → Frontend → API Request → Semantic Search
    ↓
pgvector Query → Similarity Calculation → Result Ranking
    ↓
Return Results → Frontend Display → User Interaction
```

### 3. Authentication Flow
```
User Login → Supabase Auth → JWT Generation → Store Token
    ↓
API Request → Verify JWT → User Context → Process Request
    ↓
Refresh Token → Update Session → Continue Access
```

## 🏛️ Key Design Decisions

### 1. Monorepo Structure
- **Why**: Shared code, unified tooling, easier refactoring
- **Tool**: Turborepo for build orchestration
- **Benefits**: Type safety across packages, consistent dependencies

### 2. Next.js App Router
- **Why**: Server components, better performance, nested layouts
- **Benefits**: Reduced client bundle, streaming SSR, parallel data fetching

### 3. Supabase Backend
- **Why**: Built-in auth, real-time, PostgreSQL, vector search
- **Benefits**: Rapid development, scalability, open source

### 4. Zustand State Management
- **Why**: Simple API, TypeScript support, minimal boilerplate
- **Benefits**: Easy to learn, performant, devtools support

### 5. pgvector for Semantic Search
- **Why**: Native PostgreSQL extension, efficient similarity search
- **Benefits**: No separate vector DB, SQL queries, ACID compliance

## 🔐 Security Architecture

### Authentication
- JWT-based authentication
- Secure HTTP-only cookies
- OAuth 2.0 integration
- Row Level Security (RLS)

### Data Protection
- End-to-end encryption for sensitive data
- API rate limiting
- Input validation and sanitization
- CORS configuration

### Infrastructure
- HTTPS everywhere
- Environment variable management
- Secure secret storage
- Regular security audits

## 🚀 Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- CDN for static assets
- Load balancer ready

### Performance Optimization
- Database indexing strategy
- Query optimization
- Caching layer (Redis planned)
- Lazy loading and code splitting

### Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Health checks

## 🔌 Integration Points

### External Services
1. **OpenAI API**: AI processing
2. **Google OAuth**: Authentication
3. **GitHub OAuth**: Authentication
4. **Sentry**: Error tracking
5. **Vercel**: Hosting

### Webhooks
- Note processing completion
- User events
- System notifications

### APIs
- RESTful API
- WebSocket for real-time
- GraphQL (planned)

## 📦 Technology Stack Details

### Frontend
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animations
- **Three.js**: 3D visualization

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **Supabase Client**: Database access
- **Zod**: Schema validation
- **Winston**: Logging

### Database
- **PostgreSQL**: Primary database
- **pgvector**: Vector operations
- **pg_trgm**: Text search
- **JSON**: Flexible data

### DevOps
- **Docker**: Containerization
- **GitHub Actions**: CI/CD
- **Vercel**: Frontend hosting
- **Supabase Cloud**: Backend hosting

## 🔄 Development Workflow

1. **Local Development**: Docker Compose setup
2. **Testing**: Jest + React Testing Library
3. **Code Quality**: ESLint + Prettier
4. **Type Checking**: TypeScript strict mode
5. **Build**: Turborepo parallel builds
6. **Deploy**: Automated via Git push

## 📊 Database Schema Overview

See [Database ERD](./database.md) for detailed schema.

Key tables:
- `profiles`: User information
- `notes`: Core content
- `categories`: Organization
- `tags`: Flexible labeling
- `note_connections`: Knowledge graph
- `ai_insights`: AI-generated data

## 🎯 Future Architecture Plans

1. **Microservices**: Split AI processing
2. **Event Sourcing**: Audit trail
3. **CQRS**: Read/write separation
4. **GraphQL**: Flexible queries
5. **Mobile Apps**: React Native
6. **Offline Support**: Service workers