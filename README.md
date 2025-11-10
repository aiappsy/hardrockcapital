# Hard Rock Capital Web Application

A complete full-stack web application with content management system built with Node.js, Express, PostgreSQL, and vanilla JavaScript.

## Features

- **Content Management System**: Create, edit, and delete pages with a web-based admin panel
- **Authentication**: Secure admin login with JWT tokens and bcrypt password hashing
- **RESTful API**: Complete API for managing pages and authentication
- **Responsive Design**: Modern, professional UI that works on all devices
- **Database-backed**: All content stored in PostgreSQL database
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Infrastructure**: Docker, Docker Compose

## Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd hardrockcapital
```

2. Start the application with Docker Compose:
```bash
docker-compose up -d
```

3. Access the application:
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin/login
   - Default credentials: `admin` / `admin123`

### Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database and create a `.env` file:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Create the database:
```bash
psql -U postgres -c "CREATE DATABASE hardrockcapital;"
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Project Structure

```
hardrockcapital/
├── server/
│   ├── server.js           # Express server
│   ├── config/
│   │   └── database.js     # PostgreSQL connection
│   ├── models/
│   │   ├── User.js         # User model
│   │   └── Page.js         # Page model
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   └── pages.js        # Page management routes
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   └── migrations/
│       └── init.sql        # Database initialization
├── public/
│   ├── index.html          # Main public page
│   ├── css/
│   │   └── styles.css      # Styles
│   ├── js/
│   │   ├── main.js         # Public site JavaScript
│   │   └── admin.js        # Admin panel JavaScript
│   └── admin/
│       ├── index.html      # Admin dashboard
│       └── login.html      # Admin login page
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/status` - Check authentication status

### Pages
- `GET /api/pages` - List all pages
- `GET /api/pages/:id` - Get page by ID
- `GET /api/pages/slug/:slug` - Get page by slug
- `POST /api/pages` - Create new page (protected)
- `PUT /api/pages/:id` - Update page (protected)
- `PUT /api/pages/:id/content` - Update page content (protected)
- `DELETE /api/pages/:id` - Delete page (protected)

## Admin Panel

Access the admin panel at `/admin/login`. Default credentials:
- Username: `admin`
- Password: `admin123`

**Important**: Change the default password in production!

### Admin Features
- Create new pages with custom slugs
- Edit existing pages
- Delete pages
- Preview pages before publishing
- Rich HTML content editing
- SEO meta descriptions

## Security Features

- JWT token-based authentication
- HTTP-only cookies for token storage
- Bcrypt password hashing
- Protected API routes
- CORS configuration
- SQL injection prevention with parameterized queries

## Environment Variables

See `.env.example` for all available configuration options:

- `DB_USER` - PostgreSQL username
- `DB_HOST` - PostgreSQL host
- `DB_NAME` - Database name
- `DB_PASSWORD` - PostgreSQL password
- `DB_PORT` - PostgreSQL port
- `PORT` - Application port
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT tokens
- `CORS_ORIGIN` - Allowed CORS origin

## License

ISC