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

For local checkout testing, add Stripe test keys and the Odoo RPC key to
`.env.local`:

```dotenv
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
CHECKOUT_MODE=sandbox
ODOO_URL=https://your-company.odoo.com
ODOO_API_KEY=...
```

The local checkout creates draft Odoo quotations, linked Odoo payment
transactions, and Stripe test PaymentIntents. The PaymentIntent description
matches the Odoo transaction reference so Odoo's signed Stripe webhook can
record a successful payment. The checkout completion endpoint independently
verifies that PaymentIntent with Stripe before asking Odoo to confirm the sale,
create the delivery, and run payment post-processing. After confirmation, Odoo
creates a portal user when needed and emails the customer an invitation so they
can view confirmed orders at `https://lovelee.odoo.com/my/orders`. A checkout
email cannot also be the login for an existing internal Odoo user; use a unique
customer email when testing portal invitations.

`CHECKOUT_MODE=sandbox` requires AvaTax Sandbox with commits disabled, UPS Test
Environment, and matching Stripe test keys in Odoo, Vite, and the server.
`CHECKOUT_MODE=live` requires AvaTax Production with transaction commits
enabled for Avalara Direct, or a connected Avalara Included account managed by
Odoo IAP. It also requires UPS Production Environment and matching Stripe live
keys. The Worker requires an explicit mode and still refuses checkout mutations unless
`CHECKOUT_ENABLED=true` is separately configured.

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
