# LoveLeeVa

React and Vite site for LoveLeeVa.

## Local development

```sh
npm install
cp .env.example .env.local
npm run dev
```

The business directory reads approved listings from Supabase and submits new
listings through the `submit_business_listing` RPC. Configure the shared project
in `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Only use a Supabase publishable key in the Vite client. Never place a secret or
service-role key in a `VITE_` environment variable.

## Checks

```sh
npm run lint
npm run build
```
