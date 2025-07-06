# Troubleshooting Guide

## 🔍 Common Issues and Solutions

### 🚀 Development Setup Issues

#### Issue: `pnpm install` fails
```bash
 ENOENT  pnpm-lock.yaml not found
```

**Solution:**
```bash
# Remove node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Issue: Supabase won't start
```bash
Error: Docker daemon is not running
```

**Solution:**
1. Start Docker Desktop
2. Wait for Docker to fully initialize
3. Run again:
```bash
cd database
supabase start
```

#### Issue: Port already in use
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 pnpm dev
```

### 🔐 Authentication Issues

#### Issue: Login fails with "Invalid credentials"

**Debugging steps:**
1. Check Supabase dashboard for user
2. Verify email is confirmed
3. Check browser console for errors
4. Verify environment variables:
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### Issue: OAuth login redirects to wrong URL

**Solution:**
1. Update Supabase Auth settings:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: Add your callback URL
2. Clear browser cookies
3. Try incognito mode

#### Issue: "JWT expired" error

**Solution:**
```typescript
// Force refresh the session
const { data: { session }, error } = await supabase.auth.refreshSession()
if (error) {
  // Force logout and redirect to login
  await supabase.auth.signOut()
  router.push('/login')
}
```

### 💾 Database Issues

#### Issue: "permission denied for schema public"

**Solution:**
Run as superuser in Supabase SQL Editor:
```sql
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;
```

#### Issue: RLS policies blocking access

**Debugging:**
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Temporarily disable RLS (development only!)
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;

-- Re-enable after testing
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
```

#### Issue: Vector search not working

**Solution:**
```sql
-- Check if pgvector is installed
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Install if missing
CREATE EXTENSION IF NOT EXISTS vector;

-- Rebuild vector index
REINDEX INDEX idx_notes_embedding;
```

### 🎨 UI/Frontend Issues

#### Issue: Tailwind styles not applying

**Solution:**
1. Check `tailwind.config.ts` content paths:
```typescript
content: [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
]
```

2. Restart dev server:
```bash
pnpm dev
```

#### Issue: "Hydration failed" error

**Common causes:**
1. Mismatched server/client HTML
2. Browser extensions interfering
3. Date/time rendering differences

**Solution:**
```typescript
// Wrap dynamic content
import { useEffect, useState } from 'react'

function Component() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return <div>{new Date().toLocaleString()}</div>
}
```

#### Issue: Quick Capture not opening

**Debugging:**
```typescript
// Check if keyboard shortcuts are registered
console.log('Hotkeys registered:', window.__hotkeyRegistry)

// Manually trigger
window.dispatchEvent(new KeyboardEvent('keydown', {
  key: 'n',
  ctrlKey: true,
  shiftKey: true
}))
```

### 🤖 AI/OpenAI Issues

#### Issue: "Rate limit exceeded"

**Solution:**
1. Implement retry logic:
```typescript
async function callOpenAI(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await openai.complete(prompt)
    } catch (error) {
      if (error.code === 'rate_limit_exceeded' && i < retries - 1) {
        await new Promise(r => setTimeout(r, 2 ** i * 1000))
        continue
      }
      throw error
    }
  }
}
```

2. Use queue system for batch processing

#### Issue: "Invalid API key"

**Solution:**
1. Verify API key in `.env.local`
2. Check OpenAI dashboard for key status
3. Ensure no extra spaces/quotes:
```bash
# Good
OPENAI_API_KEY=sk-proj-xxxxx

# Bad
OPENAI_API_KEY="sk-proj-xxxxx"
OPENAI_API_KEY= sk-proj-xxxxx
```

### 🚄 Performance Issues

#### Issue: Slow page loads

**Debugging:**
1. Check Next.js build output:
```bash
pnpm build
# Look for large page sizes
```

2. Use Chrome DevTools Performance tab
3. Check for unnecessary re-renders:
```typescript
// Add to component
useEffect(() => {
  console.log('Component rendered')
})
```

#### Issue: Memory leaks

**Common causes:**
1. Event listeners not cleaned up
2. Intervals/timeouts not cleared
3. Large objects in state

**Solution:**
```typescript
useEffect(() => {
  const handler = () => console.log('scroll')
  window.addEventListener('scroll', handler)
  
  // Cleanup
  return () => {
    window.removeEventListener('scroll', handler)
  }
}, [])
```

### 🔧 Build/Deployment Issues

#### Issue: Build fails on Vercel

**Common fixes:**
1. Clear build cache in Vercel dashboard
2. Check environment variables
3. Ensure Node version matches:
```json
// package.json
"engines": {
  "node": ">=18.0.0"
}
```

#### Issue: "Module not found" in production

**Solution:**
1. Check case sensitivity:
```typescript
// Wrong on Linux/Vercel
import Component from './Component'

// Correct
import Component from './component'
```

2. Verify dependencies are in `dependencies`, not `devDependencies`

### 🔍 Debugging Tools

#### Enable Debug Mode

Add to `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
DEBUG=*
```

#### Useful Console Commands

```javascript
// Check Supabase connection
console.log(supabase.auth.getSession())

// Check environment
console.log(process.env.NODE_ENV)

// Check Zustand store
console.log(useStore.getState())

// Force clear all storage
localStorage.clear()
sessionStorage.clear()
```

#### Browser Extensions

Recommended for debugging:
- React Developer Tools
- Redux DevTools (works with Zustand)
- Network tab for API calls

### 📱 Mobile/Responsive Issues

#### Issue: Viewport not responsive

**Solution:**
Ensure viewport meta tag in `app/layout.tsx`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

#### Issue: Touch events not working

**Solution:**
Use pointer events instead:
```typescript
// Instead of onClick for mobile
onPointerDown={handleStart}
onPointerUp={handleEnd}
```

### 🆘 Getting Help

If these solutions don't work:

1. **Search existing issues:**
   ```bash
   https://github.com/yourusername/synaptic/issues
   ```

2. **Create detailed bug report:**
   - Environment (OS, Node version, browser)
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages/screenshots
   - Relevant code snippets

3. **Community channels:**
   - Discord: [invite link]
   - Discussions: GitHub Discussions

4. **Debug information script:**
```bash
# Run this and include output in bug reports
node -v
pnpm -v
echo $NEXT_PUBLIC_SUPABASE_URL | head -c 20
git rev-parse HEAD
```

### 🔄 Reset Everything

If all else fails, complete reset:

```bash
# Backup your .env.local first!
cp .env.local .env.local.backup

# Clean everything
rm -rf node_modules .next dist .turbo
rm -rf frontend/node_modules frontend/.next
rm -rf backend/node_modules backend/dist
rm -rf packages/*/node_modules
rm pnpm-lock.yaml

# Reset Supabase
cd database
supabase db reset
cd ..

# Reinstall
pnpm install
pnpm dev
```

Remember: Most issues are environment-related. Double-check your environment variables and ensure all services are running!