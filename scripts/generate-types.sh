#!/bin/bash

# Generate TypeScript types from Supabase database

echo "Generating TypeScript types from Supabase database..."

# Check if supabase is running
if ! supabase status 2>/dev/null | grep -q "RUNNING"; then
    echo "Supabase is not running. Starting Supabase..."
    cd database && supabase start
fi

# Generate types
cd database && supabase gen types typescript --local > ../packages/types/src/database.types.ts

echo "TypeScript types generated at packages/types/src/database.types.ts"

# Add export to index.ts
echo "export * from './database.types';" >> ../packages/types/src/index.ts

echo "Types generation complete!"