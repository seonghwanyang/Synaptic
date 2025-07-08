# Task 012: Express API 서버 구축

## 🎯 목표

백엔드 API 서버를 구축하여 프론트엔드와 연동할 수 있는 기반을 만듭니다.

## 📋 작업 내용

### 1. Express 서버 기본 설정

**backend/src/server.ts** 생성:

```typescript
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { notesRouter } from './routes/notes';
import { captureRouter } from './routes/capture';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);
app.use('/api/capture', captureRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
```

### 2. 환경 변수 설정

**backend/.env** 확인/수정:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_KEY=your-local-service-key
JWT_SECRET=your-jwt-secret
NODE_ENV=development
```

### 3. 미들웨어 구현

#### Error Handler

**backend/src/middleware/errorHandler.ts**:

```typescript
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error('ERROR 💥', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};
```

#### Auth Middleware

**backend/src/middleware/auth.ts**:

```typescript
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { AppError } from './errorHandler';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AppError('Invalid token', 401);
    }

    req.userId = user.id;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
```

### 4. 라우트 구현

#### Auth Routes

**backend/src/routes/auth.ts**:

```typescript
import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);

export const authRouter = router;
```

#### Notes Routes

**backend/src/routes/notes.ts**:

```typescript
import { Router } from 'express';
import { NotesController } from '../controllers/notesController';
import { authenticate } from '../middleware/auth';

const router = Router();
const notesController = new NotesController();

// All routes require authentication
router.use(authenticate);

router.get('/', notesController.getNotes);
router.get('/:id', notesController.getNote);
router.post('/', notesController.createNote);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

export const notesRouter = router;
```

### 5. 컨트롤러 구현

#### Notes Controller

**backend/src/controllers/notesController.ts**:

```typescript
import { Request, Response, NextFunction } from 'express';
import { NotesService } from '../services/notesService';
import { AuthRequest } from '../middleware/auth';

export class NotesController {
  private notesService: NotesService;

  constructor() {
    this.notesService = new NotesService();
  }

  getNotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notes = await this.notesService.getUserNotes(req.userId!);
      res.json({ status: 'success', data: notes });
    } catch (error) {
      next(error);
    }
  };

  getNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const note = await this.notesService.getNote(req.params.id, req.userId!);
      res.json({ status: 'success', data: note });
    } catch (error) {
      next(error);
    }
  };

  createNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const note = await this.notesService.createNote({
        ...req.body,
        userId: req.userId!,
      });
      res.status(201).json({ status: 'success', data: note });
    } catch (error) {
      next(error);
    }
  };

  updateNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const note = await this.notesService.updateNote(
        req.params.id,
        req.userId!,
        req.body
      );
      res.json({ status: 'success', data: note });
    } catch (error) {
      next(error);
    }
  };

  deleteNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.notesService.deleteNote(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
```

### 6. 서비스 레이어

#### Notes Service

**backend/src/services/notesService.ts**:

```typescript
import { createClient } from '@supabase/supabase-js';
import { AppError } from '../middleware/errorHandler';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export class NotesService {
  async getUserNotes(userId: string) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getNote(noteId: string, userId: string) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', userId)
      .single();

    if (error) throw new AppError('Note not found', 404);
    return data;
  }

  async createNote(noteData: any) {
    const { data, error } = await supabase
      .from('notes')
      .insert(noteData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateNote(noteId: string, userId: string, updates: any) {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', noteId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new AppError('Note not found', 404);
    return data;
  }

  async deleteNote(noteId: string, userId: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', userId);

    if (error) throw new AppError('Note not found', 404);
  }
}
```

### 7. Package.json 스크립트 확인

**backend/package.json**:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "type-check": "tsc --noEmit"
  }
}
```

### 8. TypeScript 설정

**backend/tsconfig.json**:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowJs": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🧪 테스트 방법

### 1. 서버 시작

```bash
cd backend
pnpm install  # 의존성 설치
pnpm dev      # 개발 서버 시작
```

### 2. Health Check

```bash
curl http://localhost:5000/api/health
# 응답: {"status":"ok","timestamp":"2025-01-30T..."}
```

### 3. Postman/Thunder Client로 API 테스트

- POST /api/auth/register
- POST /api/auth/login
- GET /api/notes (Authorization 헤더 필요)
- POST /api/notes
- GET /api/notes/:id
- PUT /api/notes/:id
- DELETE /api/notes/:id

## 📋 체크리스트

- [ ] Express 서버 파일 생성
- [ ] 환경 변수 설정
- [ ] 미들웨어 구현
- [ ] 라우트 설정
- [ ] 컨트롤러 구현
- [ ] 서비스 레이어 구현
- [ ] 서버 실행 확인
- [ ] Health check 응답 확인

## 🎯 완료 조건

- 서버가 포트 5000에서 실행됨
- /api/health 엔드포인트 응답
- CORS 설정으로 프론트엔드 연결 가능
- 인증 미들웨어 작동
- 기본 CRUD API 구현

---

작성일: 2025-01-30
예상 소요시간: 2-3시간
