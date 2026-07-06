# Makolaty

Restaurant ordering app built with React, Vite, Tailwind CSS, and Supabase.

## Local Setup

1. Install dependencies:
   ```sh
   npm install
   ```

2. Create `.env.local` from `.env.example` and add your Supabase project values:
   ```sh
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

3. Enable Google as an Auth provider in Supabase, then add your local and production redirect URLs. For local development, include:
   ```txt
   http://localhost:3000/staff
   ```

4. Start the app:
   ```sh
   npm run dev
   ```

## Scripts

- `npm run dev` starts the local Vite server.
- `npm run build` creates a production build.
- `npm run lint` type-checks the project.
