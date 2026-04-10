# LaraDrive

A modern cloud storage application built with Laravel 12 and React. Organize, upload, share, and manage files with nested folder structures, file versioning, granular permissions, and S3-compatible storage via SeaweedFS.

## Features

- **File management** — upload, download, preview (PDF/images), soft delete, trash bin, bulk operations
- **Folder tree** — nested folders with materialized path strategy and breadcrumb navigation
- **File versioning** — every upload creates a new version; download any previous version
- **Sharing** — share files and folders via public token links or per-user with permission levels (view, comment, edit)
- **Permissions** — fine-grained, polymorphic resource permissions per user
- **Search** — full-text search across uploaded files
- **Dark mode** — full theme switching support

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Laravel 12, PHP 8.2+, Inertia.js |
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4 |
| Database | SQLite (dev) / MySQL / PostgreSQL |
| Storage | SeaweedFS (S3-compatible) |
| Testing | Pest 3 |
| Code quality | Laravel Pint, Larastan, Biomejs |

## Local Setup

### Prerequisites

- Docker + Docker Compose
- PHP 8.2+ with Composer
- Node.js 22+

### 1. Clone & install dependencies

```bash
git clone <repo-url> lara-drive
cd lara-drive
composer install
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
php artisan key:generate
```

The default `.env.example` is pre-configured for the Docker setup. No changes needed for local development.

### 3. Start Docker services

```bash
./vendor/bin/sail up -d
```

This starts two services:
- **laravel.test** — PHP 8.4 app server on port `8123`
- **seaweedfs** — S3-compatible object storage, S3 API on port `9000`

> Tip: add `alias sail='./vendor/bin/sail'` to your shell profile so you can just type `sail`.

### 4. Run migrations & seed

```bash
sail artisan migrate --seed
```

### 5. Create the S3 bucket

SeaweedFS doesn't auto-create buckets. Run this once after first boot:

```bash
sail artisan tinker --execute="Storage::disk('s3')->getAdapter()->getClient()->createBucket(['Bucket' => config('filesystems.disks.s3.bucket')]);"
```

### 6. Start the development server

```bash
composer dev
```

This runs in parallel: Laravel server, queue worker, log watcher, and Vite HMR.

The app is available at **http://localhost:8123**.

## Environment Variables

Key variables to understand (full list in `.env.example`):

| Variable | Default | Description |
|---|---|---|
| `APP_PORT` | `8123` | HTTP port for the app |
| `DB_CONNECTION` | `sqlite` | Database driver |
| `FILESYSTEM_DISK` | `s3` | All uploads go to SeaweedFS |
| `AWS_ENDPOINT` | `http://seaweedfs:8333` | SeaweedFS S3 endpoint (internal Docker) |
| `AWS_BUCKET` | `lara-drive-dev-bucket` | S3 bucket name |
| `AWS_ACCESS_KEY_ID` | `sail` | SeaweedFS access key |
| `AWS_SECRET_ACCESS_KEY` | `password` | SeaweedFS secret |
| `QUEUE_CONNECTION` | `database` | Queue driver (must match for versioning/paths) |

> **Note**: `AWS_ENDPOINT` uses the internal Docker hostname `seaweedfs`. All artisan commands should be run via `sail artisan` so they execute inside the container where this hostname resolves.

## Available Commands

```bash
# Development
composer dev          # Start all dev services (server + queue + logs + Vite)
composer dev:ssr      # Same with SSR build

# Testing
composer test         # Run the Pest test suite

# Code quality
./vendor/bin/pint     # Fix PHP code style
npm run format        # Format frontend with Biomejs
npm run types         # TypeScript type check

# IDE helpers
composer ide-helper   # Generate Laravel IDE helpers
```

## Project Structure

```
app/
├── Actions/          # Single-responsibility action classes (business logic)
├── Http/
│   ├── Controllers/  # Thin controllers delegating to Actions
│   └── Requests/     # Form request validation
├── Models/           # Eloquent models
├── Policies/         # Authorization policies
└── Services/         # Service classes (breadcrumbs, permissions, imports)

resources/js/
├── pages/            # Inertia page components
├── components/       # Reusable React components
├── hooks/            # Custom React hooks
├── contexts/         # React contexts
├── services/         # Frontend service layer
└── types/            # TypeScript types
```

## Database Schema

Core tables:

- **folders** — hierarchical with `parent_id` and materialized `path` column
- **drive_files** — file records with soft delete, scoped unique by `(folder_id, original_name)`
- **drive_file_versions** — one row per version, tracks `mime_type`, `size`, `path`, `is_current`
- **resource_permissions** — polymorphic; grants `view|comment|edit` to a user on any file or folder
- **resource_shares** — polymorphic; public token links with optional expiry

## CI/CD

GitHub Actions workflows:

- **tests.yml** — runs on push to `main`/`develop` and PRs; builds assets and runs the full Pest suite
- **lint.yml** — runs Pint, Biomejs, and ESLint checks
