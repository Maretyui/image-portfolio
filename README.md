# Jakob Bilder - Photography Portfolio

A dark, cinematic photography portfolio built with Next.js and MySQL. Features a stunning masonry grid layout, admin CMS for managing collections and images, and secure authentication.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Database**: MySQL 8.0+
- **Authentication**: Secure session-based with bcryptjs
- **Styling**: Dark theme with minimal, editorial design

## Features

- 📸 Dynamic masonry grid with customizable image spans
- 🎨 Dark, cinematic aesthetic
- 🔐 Secure admin authentication
- 📝 CMS for managing collections and uploading images
- 🎯 Collection management system
- 📱 Responsive design
- ⚡ Fast image loading with lazy loading

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm/pnpm/yarn

### 1. Setup MySQL Database

Create a database and user (already done):

```bash
CREATE DATABASE `jakob-bilder-portfolio`;
CREATE USER 'jakob-bilder-portfolio'@'localhost' IDENTIFIED BY 'A7f#kP9x!Q2mZr8L';
GRANT ALL PRIVILEGES ON `jakob-bilder-portfolio`.* TO 'jakob-bilder-portfolio'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Environment Variables

Add these to your project settings (Vars section in top right):

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=jakob-bilder-portfolio
MYSQL_USER=jakob-bilder-portfolio
MYSQL_PASSWORD=A7f#kP9x!Q2mZr8L
```

### 3. Initialize Database

Run the setup script to create tables and admin user:

```bash
npm run setup
```

This will:
- Create all necessary database tables
- Create a default admin user (username: `admin`, password: `admin123`)
- ⚠️ **IMPORTANT**: Change the admin password after first login!

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Usage

### Public Portfolio

- **Home Page**: `/` - Browse all collections with minimal cards
- **Collection Detail**: `/collection/[slug]` - View masonry grid of images

### Admin Dashboard

1. Navigate to `/admin/login`
2. Log in with credentials:
   - Username: `admin`
   - Password: `admin123` (default, change immediately!)

#### Dashboard Features

- **Create Collections**: Add new photography collections
- **Manage Collections**: Click on any collection to manage images
- **Upload Images**: 
  - Drag & drop or select files
  - Set image title (optional)
  - Choose grid span width (1-3 columns)
  - Choose grid span height (1-3 rows)
  - Images with larger spans create visual variety in the masonry layout

## Project Structure

```
/app
  /api
    /auth
      /login          - Authentication endpoint
      /logout         - Logout endpoint
    /collections
      /route.ts       - Fetch all collections
      /[slug]
        /route.ts     - Fetch collection details
        /images       - Fetch collection images
    /admin
      /collections    - Create new collections
      /upload         - Upload images
  /admin
    /login            - Admin login page
    /dashboard        - Main admin dashboard
    /collection/[slug] - Collection management
  /collection/[slug]  - Public collection view
  /page.tsx           - Homepage

/lib
  /db.ts              - MySQL connection & utilities
  /auth.ts            - Authentication helpers

/scripts
  /init-db.sql        - Database schema
  /setup.js           - Setup script
```

## Image Grid System

The masonry grid uses CSS Grid with dynamic column/row spans:

- **Width Span**: 1-3 columns (1 = normal width, 2 = double width, 3 = full width)
- **Height Span**: 1-3 rows (creates vertical variety)

Example grid layout variations:
- 1x1: Single normal-sized image
- 2x1: Wide image, single height
- 1x2: Normal width, double height
- 2x2: Large feature image

## Database Schema

### Collections Table
```sql
- id (INT, Primary Key)
- title (VARCHAR)
- slug (VARCHAR, Unique)
- description (TEXT)
- display_order (INT)
- created_at, updated_at (TIMESTAMP)
```

### Images Table
```sql
- id (INT, Primary Key)
- collection_id (INT, Foreign Key)
- title (VARCHAR)
- description (TEXT)
- image_url (VARCHAR)
- thumbnail_url (VARCHAR)
- display_order (INT)
- width_span (INT) - Grid column span (1-3)
- height_span (INT) - Grid row span (1-3)
- created_at, updated_at (TIMESTAMP)
```

### Admin Users Table
```sql
- id (INT, Primary Key)
- username (VARCHAR, Unique)
- password_hash (VARCHAR)
- email (VARCHAR, Unique)
- created_at, updated_at (TIMESTAMP)
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Push code to GitHub
3. Connect repository in Vercel dashboard
4. Add environment variables in Vercel project settings
5. For MySQL, ensure your database is accessible from Vercel (use a managed MySQL service or expose your local database with proper security)

### Database Setup on Deployment

After deploying, run the setup script in your production environment:

```bash
npm run setup
```

## Security Notes

⚠️ **Important Security Considerations**:

1. **Change Default Admin Password**: The default admin password is `admin123`. Change this immediately after setup!
2. **Use Environment Variables**: Never hardcode credentials
3. **HTTPS Only**: Always use HTTPS in production
4. **Database Access**: Restrict MySQL access to authorized IPs
5. **Session Security**: The admin session cookie is:
   - HTTP-only (cannot be accessed via JavaScript)
   - Secure (HTTPS only in production)
   - SameSite strict (CSRF protection)

## API Endpoints

### Public Endpoints
- `GET /api/collections` - Get all collections
- `GET /api/collections/[slug]` - Get collection details
- `GET /api/collections/[slug]/images` - Get collection images

### Admin Endpoints (requires authentication)
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/admin/collections` - Create collection
- `POST /api/admin/upload` - Upload image

## Customization

### Change Site Title
Edit `/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Name - Photographer',
  description: 'Your description',
}
```

### Change Colors
Edit `/app/globals.css`:
```css
:root {
  --background: oklch(0.08 0 0); /* Adjust background */
  --foreground: oklch(1 0 0);    /* Adjust text color */
  /* ... other colors ... */
}
```

### Change Hero Text
Edit `/app/page.tsx`:
```typescript
<h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
  YOUR TEXT HERE
</h1>
```

## Troubleshooting

### Database Connection Error
- Check MySQL is running: `mysql -u root -p`
- Verify environment variables are set correctly
- Test connection: Check MySQL credentials in `.env.local`

### Admin Login Not Working
- Ensure admin user was created: Run `npm run setup` again
- Check the MySQL credentials in environment variables
- Clear browser cookies and try again

### Images Not Displaying
- Verify images were uploaded successfully
- Check browser console for CORS errors
- Ensure image URLs are accessible

### Setup Script Error
- Ensure MySQL is running
- Check database name and credentials
- Run: `npm run setup` with correct env vars

## Future Enhancements

- [ ] Add image tagging system
- [ ] Implement client contact form
- [ ] Add image analytics
- [ ] Support multiple admin users with roles
- [ ] Add image editing capabilities
- [ ] Implement search/filtering
- [ ] Add dark mode toggle
- [ ] Mobile-optimized admin interface

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check:
1. Database connection and credentials
2. MySQL is running and accessible
3. Environment variables are properly set
4. Node.js version is 18 or higher
