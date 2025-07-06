# Synaptic Database

This directory contains all database-related files for the Synaptic project.

## Structure

```
database/
├── migrations/      # SQL migration files (run in order)
├── seeds/          # Seed data for development
├── functions/      # PostgreSQL functions
├── triggers/       # Database triggers
├── policies/       # Row Level Security policies
├── config.toml     # Supabase configuration
└── schema.sql      # Complete schema (auto-generated)
```

## Setup

1. **Start Supabase locally:**
   ```bash
   cd database
   supabase start
   ```

2. **Run migrations:**
   ```bash
   supabase db push
   ```

3. **Seed the database (optional):**
   ```bash
   supabase db seed
   ```

4. **Generate TypeScript types:**
   ```bash
   npm run generate:types
   # or
   ../scripts/generate-types.sh
   ```

## Migrations

Migrations are numbered and should be run in order:

1. `001_enable_extensions.sql` - Enables required PostgreSQL extensions
2. `002_create_users_tables.sql` - User profiles and statistics
3. `003_create_notes_tables.sql` - Notes, categories, tags
4. `004_create_ai_tables.sql` - AI processing and insights
5. `005_create_indexes.sql` - Performance indexes

## Key Features

- **Vector Search**: Uses pgvector for semantic search with OpenAI embeddings
- **Full Text Search**: PostgreSQL's built-in FTS with GIN indexes
- **Row Level Security**: All tables have RLS policies
- **Real-time**: Supports Supabase real-time subscriptions
- **Type Safety**: Auto-generated TypeScript types

## Common Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database
supabase db reset

# View database logs
supabase db logs

# Access database directly
supabase db proxy

# Generate types
supabase gen types typescript --local > ../packages/types/src/database.types.ts
```

## Environment Variables

Required environment variables for the application:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-key>
```

## Notes

- The vector dimension is set to 1536 for OpenAI text-embedding-3-small
- IVFFlat indexes are used for approximate nearest neighbor search
- All timestamps use TIMESTAMPTZ for proper timezone handling
- User statistics are updated via triggers for performance