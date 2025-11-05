# Web3 Authentication with Thirdweb

## Overview

This application implements Web3 wallet-based authentication using the Thirdweb SDK v5. Users must connect their wallet to access protected dashboard routes.

## Architecture

### Components

1. **Thirdweb Client** (`lib/services/thirdweb/client.ts`)

   - Configures the Thirdweb client with client ID
   - Required environment variable: `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`

2. **Auth Services** (`lib/services/thirdweb/auth-services.ts`)

   - Sets up Thirdweb authentication with admin wallet
   - Required environment variables:
     - `NEXT_PUBLIC_ADMIN_WALLET_PRIVATE_KEY`
     - `NEXT_PUBLIC_AUTH_DOMAIN`

3. **Server Actions** (`app/actions/auth.ts`)

   - `generatePayload()` - Generate login payload for wallet
   - `login()` - Verify payload and create JWT token
   - `isLoggedIn()` - Check if user is authenticated
   - `logout()` - Remove JWT token

4. **Middleware** (`middleware.ts`)

   - Protects dashboard routes (`/home`, `/synergies`, `/proveedores`, `/comite`, `/settings`)
   - Redirects unauthenticated users to `/auth`
   - Checks for valid JWT cookie

5. **Login Button Component** (`components/auth/login-button.tsx`)

   - Uses Thirdweb's `ConnectButton` component
   - Handles wallet connection and authentication flow

6. **Auth Page** (`app/auth/page.tsx`)
   - Landing page for unauthenticated users
   - Displays wallet connection interface

## Authentication Flow

1. **User visits protected route** → Middleware checks for JWT
2. **No JWT found** → Redirect to `/auth`
3. **User connects wallet** → Thirdweb ConnectButton handles connection
4. **User signs message** → Payload generated and verified
5. **JWT created** → Stored in HTTP-only cookie (24-hour expiration)
6. **User redirected** → Access granted to dashboard

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Thirdweb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here

# Admin Wallet Private Key (for signing JWTs)
NEXT_PUBLIC_ADMIN_WALLET_PRIVATE_KEY=your_admin_wallet_private_key_here

# Auth Domain
NEXT_PUBLIC_AUTH_DOMAIN=localhost:3000
```

### Getting Your Client ID

1. Go to [Thirdweb Portal](https://portal.thirdweb.com/)
2. Create a new project or select existing
3. Copy your Client ID from the dashboard

### Generating Admin Wallet Private Key

You can generate a new private key using any wallet tool or use an existing wallet's private key. This key is used to sign JWT tokens and should be kept secure.

## Protected Routes

The following routes require authentication:

- `/home` - Dashboard home
- `/synergies` - Synergies visualization
- `/proveedores` - Suppliers page
- `/comite` - Committee page
- `/settings` - Settings page

## Usage

### In Components

```tsx
import { LoginButton } from "@/components/auth/login-button";

export default function MyComponent() {
  return (
    <div>
      <LoginButton />
    </div>
  );
}
```

### Server-Side Authentication Check

```tsx
import { isLoggedIn } from "@/app/actions/auth";

export default async function ServerComponent() {
  const authenticated = await isLoggedIn();

  if (!authenticated) {
    // Handle unauthenticated state
  }

  return <div>Protected content</div>;
}
```

## Security Features

- **HTTP-only cookies** - JWT stored securely, not accessible via JavaScript
- **Secure flag** - Enabled in production (HTTPS only)
- **SameSite protection** - Prevents CSRF attacks
- **24-hour expiration** - Tokens expire after 24 hours
- **Server-side verification** - JWT verified on every request

## Implementation Notes

- The `ThirdwebProvider` wraps the entire application in `app/layout.tsx`
- Dashboard layout includes `LoginButton` in the header
- Middleware runs on all routes except API, static files, and images
- Authentication state is managed server-side via JWT cookies

## Troubleshooting

### "NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set"

- Ensure `.env.local` file exists with the required variables
- Restart the development server after adding environment variables

### "NEXT_PUBLIC_ADMIN_WALLET_PRIVATE_KEY is not set"

- Generate or use an existing wallet private key
- Ensure it starts with `0x`

### Authentication not working

- Check that JWT cookie is being set (check browser DevTools → Application → Cookies)
- Verify admin wallet private key is correct
- Ensure auth domain matches your deployment domain
