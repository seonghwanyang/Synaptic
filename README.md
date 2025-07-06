# 🧠 Synaptic - Your Second Brain

<p align="center">
  <img src="docs/assets/synaptic-logo.png" alt="Synaptic Logo" width="200">
</p>

<p align="center">
  <strong>AI가 자동으로 정리하는 두 번째 뇌</strong><br>
  생각의 속도로 캡처하고, AI가 똑똑하게 정리합니다
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#contributing">Contributing</a>
</p>

## 🌟 Features

### ⚡ 2초 Quick Capture
- **즉시 캡처**: Cmd+Shift+N으로 어디서든 바로 시작
- **다양한 입력**: 텍스트, 음성, 이미지 모두 지원
- **자동 저장**: 타이핑하는 동안 자동으로 저장

### 🤖 AI 자동 정리
- **0.3초 분류**: AI가 즉시 카테고리 분류
- **스마트 태깅**: 자동 키워드 추출
- **연결 발견**: 관련 노트 자동 연결

### 🎨 3D 네트워크 뷰
- **시각적 탐색**: 생각의 연결을 3D로 시각화
- **인터랙티브**: 노드 클릭으로 탐색
- **시간 여행**: 과거 생각의 흐름 추적

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop
- Supabase CLI
- pnpm 8.14.0+ (권장)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/synaptic.git
cd synaptic_code
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

4. **Start Supabase locally**
```bash
cd database
supabase start
```

5. **Run database migrations**
```bash
supabase db push
```

6. **Start development server**
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Animation**: Framer Motion

### Backend
- **Database**: Supabase (PostgreSQL)
- **Vector DB**: pgvector
- **Auth**: Supabase Auth
- **AI**: OpenAI API + LangChain

### Infrastructure
- **Hosting**: Vercel
- **Storage**: Supabase Storage
- **Monitoring**: Sentry

## 📁 Project Structure

```
synaptic_code/
├── frontend/              # Next.js frontend app
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utilities
│   └── public/           # Static assets
├── backend/              # API services
│   ├── src/
│   │   ├── api/          # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helpers
│   └── supabase/         # Edge functions
├── database/             # Database schema
│   ├── migrations/       # SQL migrations
│   ├── seeds/           # Seed data
│   └── functions/       # PostgreSQL functions
├── ai/                  # AI services
│   ├── prompts/         # AI prompts
│   └── services/        # AI integrations
└── docs/                # Documentation
```

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm db:start     # Start local Supabase
pnpm db:stop      # Stop local Supabase

# Building
pnpm build        # Build for production
pnpm start        # Start production server

# Testing
pnpm test         # Run tests
pnpm test:e2e     # Run E2E tests

# Code Quality
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier
pnpm typecheck    # TypeScript check
```

### Database Commands

```bash
# Migrations
supabase migration new <name>    # Create migration
supabase db push                 # Apply migrations
supabase db reset               # Reset database

# Types
supabase gen types typescript    # Generate types
```

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

## 🚢 Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

## 🤝 Contributing

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Inspired by Notion, Obsidian, and Roam Research
- Built with ❤️ using Next.js and Supabase

---

<p align="center">
  Made with 🧠 by the Synaptic Team
</p>