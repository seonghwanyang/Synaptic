# Contributing to Synaptic

First off, thank you for considering contributing to Synaptic! 🎉

## 🚀 Getting Started

### Prerequisites

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/synaptic.git
cd synaptic_code
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/originalowner/synaptic.git
```

4. Install dependencies:
```bash
pnpm install
```

## 🔄 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Write clean, readable code
- Follow existing patterns
- Add tests for new features
- Update documentation

### 3. Commit Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add voice recording to quick capture"
git commit -m "fix: resolve memory leak in note editor"
git commit -m "docs: update API documentation"
```

#### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code change without new feature
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance

### 4. Test Your Changes

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test components/QuickCapture.test.tsx

# Run E2E tests
pnpm test:e2e
```

### 5. Push Changes

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit!

## 📋 Code Style

### TypeScript

```typescript
// ✅ Good
interface UserProps {
  name: string
  email: string
  isActive?: boolean
}

// ❌ Bad
interface user_props {
  Name: string,
  Email: string,
  is_active?: boolean
}
```

### React Components

```tsx
// ✅ Good: Functional component with proper typing
export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className="...">
      {children}
    </button>
  )
}

// ❌ Bad: Missing types
export const Button = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE.ts`
- CSS Modules: `component.module.css`

## 🧪 Testing Guidelines

### Unit Tests

```typescript
describe('QuickCapture', () => {
  it('should save note on Enter key', async () => {
    const { getByRole } = render(<QuickCapture />)
    const input = getByRole('textbox')
    
    await userEvent.type(input, 'Test note{enter}')
    
    expect(mockSaveNote).toHaveBeenCalledWith({
      content: 'Test note',
      type: 'text'
    })
  })
})
```

### E2E Tests

```typescript
test('user can create and categorize note', async ({ page }) => {
  await page.goto('/dashboard')
  await page.keyboard.press('Control+Shift+N')
  
  await page.fill('[data-testid="capture-input"]', 'Meeting notes')
  await page.keyboard.press('Enter')
  
  await expect(page.locator('[data-testid="note-card"]')).toContainText('Meeting notes')
  await expect(page.locator('[data-testid="category-badge"]')).toContainText('Work')
})
```

## 🐛 Reporting Issues

### Bug Reports

Please include:
1. Clear description
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment details

### Feature Requests

Please include:
1. Problem description
2. Proposed solution
3. Alternative solutions
4. Additional context

## 💻 Development Environment

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

## 📚 Project Structure

```
synaptic_code/
├── frontend/              # Next.js frontend
│   ├── src/app/          # App router pages
│   ├── src/components/   # React components
│   ├── src/hooks/        # Custom hooks
│   └── src/lib/          # Utilities
├── backend/              # API services
├── database/             # DB schema & migrations
├── ai/                   # AI services
└── docs/                 # Documentation
```

## 🏗 Architecture Guidelines

### Component Structure

```tsx
// components/feature/ComponentName.tsx
interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Component logic
  return (
    // JSX
  )
}
```

### State Management

We use Zustand for global state:

```typescript
// lib/stores/featureStore.ts
interface FeatureState {
  // State definition
  items: Item[]
  
  // Actions
  addItem: (item: Item) => void
  removeItem: (id: string) => void
}

export const useFeatureStore = create<FeatureState>()((set) => ({
  items: [],
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  }))
}))
```

### API Routes

```typescript
// backend/src/api/feature.ts
export const featureRouter = Router()

featureRouter.get('/', async (req, res) => {
  try {
    const data = await getFeatureData()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})
```

## 📦 Dependencies

When adding new dependencies:

1. Justify the need
2. Check bundle size impact
3. Ensure active maintenance
4. Update documentation

## 🔒 Security

- Never commit secrets
- Use environment variables
- Validate all inputs
- Sanitize user content
- Follow OWASP guidelines

## 🚀 Performance

- Lazy load components
- Optimize images
- Use proper caching
- Minimize bundle size
- Profile before optimizing

## 📝 Documentation

- Update README for new features
- Add JSDoc comments
- Create usage examples
- Document breaking changes

## 🎨 UI/UX Guidelines

- Follow existing design system
- Use Coral (#FF6B6B) and Teal (#008B8B) colors
- Ensure accessibility (WCAG 2.1 AA)
- Support dark mode
- Test on mobile devices

## 🌐 Internationalization

Currently, the app is in Korean/English mixed. When adding text:

```tsx
// Good: Use constants for text
const MESSAGES = {
  SAVE_SUCCESS: '저장되었습니다',
  SAVE_ERROR: '저장 중 오류가 발생했습니다'
}

// Bad: Hardcoded text
toast.success('저장되었습니다')
```

## 💡 Tips

- Use `pnpm dev` for hot reloading
- Check `pnpm lint` before committing
- Run `pnpm typecheck` for TypeScript errors
- Use `git rebase` to keep clean history
- Ask questions in issues/discussions

## 🤝 Code Review Process

1. All code must be reviewed
2. Address all feedback
3. Keep PRs focused and small
4. Write descriptive PR titles
5. Update tests and docs

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Synaptic! 🧠✨