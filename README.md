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

## Hosting

The production site is deployed to Cloudflare Workers from the `main` branch.
Cloudflare Workers Builds uses:

```text
Build command: npm run build
Deploy command: npx wrangler deploy
```

The Worker serves the Vite build from `dist` and reserves `/api/*` for private
server-side integrations. Store backend credentials as encrypted Worker secrets;
never put them in `VITE_` variables or commit them to this repository.
