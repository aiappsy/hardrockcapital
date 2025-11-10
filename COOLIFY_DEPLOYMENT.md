# Hard Rock Capital - Coolify Deployment Guide

This admin panel can be deployed to Coolify using Docker.

## Files Added

- `Dockerfile` - Alpine-based nginx container to serve static files
- `nginx.conf` - Nginx configuration with gzip, caching, and security headers
- `.dockerignore` - Excludes unnecessary files from the Docker image

## Deployment Instructions for Coolify

### Method 1: Direct Deployment (Recommended)

1. **In Coolify Dashboard:**
   - Click "New Resource" → "Application"
   - Select "Docker Image" or "GitHub Repository"

2. **Configure the Service:**
   - **Name:** hard-rock-capital-admin
   - **Repository:** aiappsy/hardrockcapital
   - **Branch:** copilot/create-admin-panel
   - **Build Pack:** Dockerfile
   - **Port:** 80

3. **Environment Variables:**
   - No environment variables needed (static site)

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build and deployment

### Method 2: Using Git Repository

1. In Coolify, create a new service
2. Select "Public Repository"
3. Enter: `https://github.com/aiappsy/hardrockcapital`
4. Branch: `copilot/create-admin-panel`
5. Build Type: Dockerfile
6. Port: 80
7. Click "Deploy"

### Method 3: Manual Docker Build

If you prefer to test locally first:

```bash
# Clone the repository
git clone https://github.com/aiappsy/hardrockcapital.git
cd hardrockcapital
git checkout copilot/create-admin-panel

# Build the Docker image
docker build -t hardrockcapital-admin .

# Test locally
docker run -p 8080:80 hardrockcapital-admin

# Visit http://localhost:8080/admin.html
```

Then push to your Docker registry and deploy from there in Coolify.

## Accessing Your Admin Panel

After deployment, your admin panel will be available at:
- Landing page: `https://your-coolify-domain.com/demo.html`
- Admin panel: `https://your-coolify-domain.com/admin.html`
- Main site: `https://your-coolify-domain.com/index.html`

## Features

✅ Lightweight Alpine Linux base (5MB)
✅ Nginx web server with optimized configuration
✅ Gzip compression enabled
✅ Static asset caching (1 year)
✅ Security headers configured
✅ No build process required
✅ All 7 admin tabs functional
✅ localStorage persistence

## Troubleshooting

**Port Issues:**
- Make sure port 80 is exposed in Coolify settings
- Check firewall rules allow HTTP traffic

**Build Failures:**
- Verify Dockerfile is in repository root
- Check Coolify build logs for errors

**Access Issues:**
- Ensure domain is properly configured
- Check that the service is running in Coolify dashboard

## Notes

- This is a static site - no backend required
- All settings are saved in browser localStorage
- No database needed
- Highly scalable and fast
