# Quick Start Guide

## 1. Add Environment Variables

Go to **Settings** (top right) → **Vars** and add:

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=jakob-bilder-portfolio
MYSQL_USER=jakob-bilder-portfolio
MYSQL_PASSWORD=A7f#kP9x!Q2mZr8L
```

## 2. Initialize Database

Once env vars are set, the next step is to set up the database with tables and default admin user. 

You have a few options:

### Option A: Using Your Local MySQL (Recommended)
If you're running this locally with MySQL installed:

```bash
npm run setup
```

This creates:
- All database tables
- Default admin user (username: `admin`, password: `admin123`)

### Option B: Manual Setup
If you prefer to set up manually:

1. Connect to your MySQL database:
   ```bash
   mysql -u jakob-bilder-portfolio -p jakob-bilder-portfolio
   ```

2. Run the SQL migration:
   - Copy the contents of `/scripts/init-db.sql`
   - Paste into your MySQL client
   - Execute

3. Create admin user (run in MySQL):
   ```sql
   INSERT INTO admin_users (username, password_hash, email) 
   VALUES ('admin', '$2a$10$K2H8H.eDwhdVxR32SS3I2OPST9/PgBkqquzi.Ss7KIUgO2t0jToFm', 'admin@example.com');
   ```
   (password hash is for: `admin123`)

## 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 4. Login to Admin

1. Go to `http://localhost:3000/admin/login`
2. Use:
   - Username: `admin`
   - Password: `admin123`
3. ⚠️ **Change this password immediately** in production!

## 5. Create Your First Collection

In the admin dashboard:
1. Fill out collection form:
   - Name: e.g., "Editorial"
   - Slug: e.g., "editorial" (lowercase, no spaces)
   - Description: Optional

2. Click "Create Collection"

## 6. Upload Images

Click on a collection to manage it:
1. Select an image file
2. (Optional) Add a title
3. Choose width and height spans (1-3) for grid layout variety
4. Click "Upload Image"

## 7. View Your Portfolio

- Home: `http://localhost:3000`
- Collection: `http://localhost:3000/collection/[slug]`

---

## Folder Structure

```
/app              → Next.js app (pages, routes, layouts)
/lib              → Utilities (database, auth)
/scripts          → Database setup scripts
/public           → Static assets
```

## Key Files

- `/app/page.tsx` - Homepage with collections grid
- `/app/collection/[slug]/page.tsx` - Collection detail with masonry
- `/app/admin/login/page.tsx` - Admin login
- `/app/admin/dashboard/page.tsx` - Collection management
- `/app/api/` - API routes
- `/lib/db.ts` - Database utilities
- `/scripts/init-db.sql` - Database schema

## Customization

### Change Site Title
Edit `/app/layout.tsx` metadata

### Change Hero Text
Edit `/app/page.tsx` - look for "PHOTOGRAPHER BASED IN VIETNAM"

### Change Colors
Edit `/app/globals.css` - modify the `:root` color variables

### Add Navigation Links
Edit the `<nav>` in both `/app/page.tsx` and collection page

## Troubleshooting

### "Cannot connect to database"
- Check MySQL is running
- Verify env vars are correct
- Try `mysql -u jakob-bilder-portfolio -p` to test

### "Setup script failed"
- Ensure MySQL user exists and has permissions
- Run the manual setup instead

### "Admin login not working"
- Verify admin user was created: Query MySQL directly
- Clear browser cookies
- Check password is exactly: `admin123`

## Next Steps

1. ✅ Set env variables
2. ✅ Run setup script
3. ✅ Start dev server
4. ✅ Login to admin
5. ✅ Create collections
6. ✅ Upload images
7. ? Customize text/colors
8. ? Deploy to Vercel

---

**Need help?** See the full README.md for detailed documentation.
