<div align="center">

<img src="client/public/Shiny-Quest-Logo.png" alt="Shiny Quest logo" width="140" />

# Shiny Quest

**A social app for Pokémon shiny hunters: track your hunts, share your shinies, and follow your friends' progress.**

[**shinyquest.app**](https://shinyquest.app) · API at `api.shinyquest.app`

![CI](https://github.com/Tyler-Gushue/Shiny-Quest/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/node-24.x-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-All%20rights%20reserved-red)

</div>

---

## About

Shiny Quest is a portfolio project I’m using to learn and have fun with.

Some of my friends are shiny hunters, and they feel there’s no good tool for tracking their hunts and sharing them with each other. So I decided to make one.

The app is live. The full authentication system is finished, tested and deployed, and hunt tracking is what I’m building next.

## Tech Stack

| Layer | Tech |
| --- | --- |
| **Frontend** | Vite, React 19, TypeScript, React Router, Tailwind CSS v4, TanStack Query |
| **Backend** | Node 24, Express 5, TypeScript |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth & Security** | JWT, bcrypt, helmet, CORS, express-rate-limit |
| **Email** | Resend (sent from `support@shinyquest.app`) |
| **Testing** | Vitest, Supertest, mongodb-memory-server |
| **Hosting** | Netlify (frontend), Heroku (API), Cloudflare DNS |
| **CI/CD** | GitHub Actions, Heroku auto-deploys |

## Features

### Authentication
- **Sign up** with server-side validation, a uniqueness check on username and email, and bcrypt password hashing (cost 12).
  - Passwords must be 8 to 72 characters (72 is bcrypt's input limit) with a lowercase letter, an uppercase letter and a number.
  - If the verification email fails to send, the new account is rolled back so no half-created users are left behind.
- **Email verification required**: you can't log in until your email is verified.
  - The 6-digit code comes from `crypto.randomInt` and is stored as a bcrypt hash combined with a server-side secret.
  - Codes expire after 10 minutes and allow 5 attempts. Attempts are counted atomically in the database, so parallel guesses can't get around the limit.
  - Verifying your email logs you in straight away.
- **Log in** returns the same generic error for any bad credentials. When the email doesn't exist it still runs a dummy bcrypt compare, so response timing doesn't reveal which accounts exist.
- **Silent session refresh**: your session is restored on page load without logging in again.
- **Forgot / reset password** works with a code instead of a link. The reset token is a short-lived JWT that stops working once the password changes, and resetting revokes every active session.
- **Log out** deletes the stored refresh token and clears the cookie.

### Security
- **Hybrid token strategy**
  - Access token: a 15-minute HS256 JWT, kept only in React memory.
  - Refresh token: a random opaque value in an `httpOnly`, `Secure`, `SameSite=Lax` cookie. The database stores only its SHA-256 hash, and a TTL index removes expired ones.
- **Refresh token rotation**: each refresh deletes the old token and issues a new one. The new token keeps the original expiry date, so a session can't be extended forever just by refreshing.
- **JWT audience and algorithm pinning**: access tokens and reset tokens use separate audiences and separate secrets.
- **Rate limiting on every route**: a global limit plus tighter limits per route, per IP and per IP + email on the sensitive endpoints.
- **Locked-down CORS**, plus an `Origin` check on the routes that use the cookie.
- **Fail-fast config**: the API won't start if a required secret or environment variable is missing.
- **helmet** on the API. The frontend sends a strict CSP, `X-Frame-Options: DENY`, `nosniff`, a `Referrer-Policy` and a `Permissions-Policy`.
- **Responses that don't leak information**
  - Routes that send email always return the same response.
  - 5xx errors never expose internals.
  - Unknown routes return a clean 404.

### Frontend
- Protected routes. When you log in, you're sent back to the page you were trying to reach.
- Session restored on page load, with a full-screen loader until fonts, images, the session check and the page's data are ready.
- A password strength meter that follows the same rules the server enforces.
- Readable error messages: network failures and 5xx errors show a generic message instead of browser or server details.
- Responsive layout with a mobile navigation menu.

### Infrastructure
- Deployed on a custom domain with HTTPS on both the frontend and the API.
- Production has its own database, a dedicated database user and freshly generated secrets.
- Transactional email is sent through Resend from a verified domain using a sending-only API key.
- **CI/CD**
  - GitHub Actions runs on every push and pull request: server tests, the server TypeScript build, and the client lint and build.
  - The API auto-deploys to Heroku only after the GitHub checks pass.

## API

All routes live under `https://api.shinyquest.app`.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | API and database health check |
| `POST` | `/api/auth/signup` | Create an account and send a verification code |
| `POST` | `/api/auth/verify-email` | Verify the email (this also logs you in) |
| `POST` | `/api/auth/email-code` | Resend the verification code |
| `POST` | `/api/auth/login` | Log in |
| `POST` | `/api/auth/refresh` | Rotate the refresh token and get a new access token |
| `POST` | `/api/auth/logout` | Log out |
| `GET` | `/api/auth/me` | Get the current user |
| `POST` | `/api/auth/reset-code` | Send a password reset code |
| `POST` | `/api/auth/verify-reset` | Exchange a reset code for a reset token |
| `POST` | `/api/auth/reset-password` | Set a new password |
| `GET` | `/api/auth/website-stats` | Public user count ("Trainers Joined") |

## Project Structure

```
Shiny-Quest/
├─ .github/workflows/   # CI pipeline
├─ client/              # Vite + React frontend (Netlify)
│  ├─ public/           # _headers (CSP + security headers), _redirects, assets
│  └─ src/
│     ├─ api/           # Fetch wrapper + auth API calls
│     ├─ components/    # Layouts, Navbar, ProtectedRoute, PageLoader
│     ├─ context/       # AuthContext (user + in-memory access token)
│     ├─ features/      # Feature modules (auth forms; hunts, friends, profile to come)
│     ├─ hooks/         # useAuth
│     └─ pages/         # Route views
├─ server/              # Express API (Heroku)
│  ├─ src/
│  │  ├─ config/        # Database connection, required env check
│  │  ├─ controllers/
│  │  ├─ middleware/    # requireAuth, requireResetToken, validation, rate limiters, Origin check
│  │  ├─ models/        # User, RefreshToken, VerificationCode
│  │  ├─ routes/
│  │  ├─ services/      # Auth, verification codes, email
│  │  └─ types/
│  └─ tests/            # Vitest + Supertest suites, one per auth route
└─ shared/              # Shared TypeScript types
```

## Testing

The API has a Vitest + Supertest suite with a test file for every auth route. Each run uses an in-memory MongoDB that's wiped between tests. The email service is mocked so tests can read the codes without sending real emails.

```bash
cd server
npm test
```

## Roadmap

### ✅ Done
- [x] Sign up with server-side validation
- [x] Email verification (required before login)
- [x] Log in
- [x] Log out (API route + auth context)
- [x] Access + refresh token flow with rotation
- [x] Forgot / reset password
- [x] Rate limiting on every route, including the email-sending routes
- [x] Security headers, locked-down CORS and Origin checks
- [x] Transactional email from `support@shinyquest.app`
- [x] Automated tests for every auth route
- [x] Mobile layout for the auth pages
- [x] Production deployment (Netlify + Heroku + MongoDB Atlas)
- [x] Custom domain `shinyquest.app` with HTTPS
- [x] CI/CD: GitHub Actions, with Heroku deploying only after checks pass
- [x] Public repo with license and README

### 🎯 v1: Next Up
- [ ] **Log out button**: the API and auth context already support logging out, but there's no button in the navbar yet
- [ ] **Hunt tracking**: create, update and track current, successful and failed hunts, with an encounter counter
- [ ] **Dashboard**: recent hunts and counts of active, successful and failed hunts
- [ ] **Profile**: profile picture, shiny showcase, favorite shiny, current target, failed hunts and overall stats
- [ ] **Friends**: add friends and view their profiles
- [ ] **Home page**: a landing page that introduces the platform

## Running Locally

**Requirements:** Node 24 (see `.nvmrc`), a MongoDB connection string and a Resend API key.

```bash
git clone https://github.com/Tyler-Gushue/Shiny-Quest.git
cd Shiny-Quest
```

**Server**
```bash
cd server
cp .env.example .env    # fill in the values
npm install
npm run dev             # http://localhost:5000
```

**Client**

Create `client/.env` with `VITE_API_URL=http://localhost:5000/api`.

```bash
cd client
npm install
npm run dev             # http://localhost:5173
```

## License

**Copyright © 2026 Tyler Gushue. All rights reserved.**

The code is public so people can view it as part of my portfolio. You may not copy, modify, distribute or use any part of it without written permission. See [LICENSE](LICENSE) for the full terms.

Shiny Quest is a fan project and is not affiliated with, endorsed by or sponsored by Nintendo, Game Freak, Creatures Inc. or The Pokémon Company. Pokémon and all related names are trademarks of their respective owners.

For questions or permission requests, contact **support@shinyquest.app**.
