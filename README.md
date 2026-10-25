# သီတင်းကျွတ် မေတ္တာကတ်

Next.js + Tailwind CSS + Supabase app for creating animated Burmese Thadingyut greeting cards with public share links.

## Requirements
- Node.js 20.9+
- A Supabase project

## 1. Install
```bash
npm install
cp .env.example .env.local
```
On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`.

## 2. Configure Supabase
1. Create a project at https://supabase.com.
2. Open SQL Editor and run all of `supabase/schema.sql`.
3. Open Project Settings / API (or Connect) and copy the project URL and publishable/anon key.
4. Put those values in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```
Use only the public publishable/anon key in this browser app. Never put a service-role/secret key in a `NEXT_PUBLIC_` variable.

## 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000.

## 4. Deploy to Vercel
1. Push this folder to a GitHub repository.
2. Import that repository at https://vercel.com.
3. In Vercel project Settings -> Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy after adding variables.

## Routes
- `/` - form and animated preview
- `/w/<uuid>` - public card page

## Notes
- Public links are public: anyone with the URL can read the wish. Don't include sensitive personal information.
- This starter does not include login, moderation, rate limiting, or deleting cards. Add those before a large public launch to reduce spam.
- The card's PNG export uses `html-to-image`; some emoji appearance can vary by operating system.
- If you prefer to use a custom Myanmar font, add a licensed `.woff2` font under `public/fonts` and register it with `@font-face` in `app/globals.css`.
"# thadingyut-wish" 
