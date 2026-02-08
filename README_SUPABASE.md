
# Supabase Integration for KikiGains

This project has been integrated with Supabase for Authentication and Database features.

## Prerequisites

1.  A Supabase project. create one at [database.new](https://database.new)
2.  Your project URL and Anon Key.

## Setup Steps

### 1. Configure Environment Variables
Open `.env.local` and replace the placeholder values with your improved Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Set Database Schema
Go to your Supabase Dashboard -> SQL Editor and run the content of `supabase/schema.sql`.
This will create:
- `routines` table
- Row Level Security (RLS) policies to protect user data.

### 3. Authentication
The app now requires login.
- New users can sign up (Email/Password).
- Make sure "Email Auth" is enabled in your Supabase Authentication settings.
- If you want email confirmation to be optional for development, go to Authentication -> Providers -> Email -> specific settings -> disable "Confirm email".

## Features Added

- **Login/Register UI**: A full authentication flow.
- **Routines Database**: The `TrainingView` now syncs with Supabase `routines` table for logged-in users.
