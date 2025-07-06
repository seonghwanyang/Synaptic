-- Enable necessary extensions for Synaptic

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vector search for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Full text search with trigrams
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- JSON schema validation
CREATE EXTENSION IF NOT EXISTS pg_jsonschema;