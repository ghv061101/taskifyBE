# TaskFlow Backend - Render Deployment

## Quick Deploy to Render

### 1. Connect Repository
- Go to [Render Dashboard](https://dashboard.render.com)
- Click "New" → "Web Service"
- Connect your GitHub repository

### 2. Configure Service
- **Name**: `taskflow-backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Environment Variables
Set these in Render's Environment section:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://hj123:hj123@cluster0.85xvcyb.mongodb.net/
DB_NAME=mydb1
JWT_SECRET=hj123
```

### 4. Deploy
- Click "Create Web Service"
- Render will build and deploy automatically
- Your API will be available at: `https://taskflow-backend.onrender.com`

## Alternative: Docker Deployment

If you prefer Docker deployment on Render:

1. Choose "Docker" as runtime instead of "Node"
2. The `Dockerfile` in this directory will be used automatically
3. Set the same environment variables as above

## Post-Deployment

After deployment, update your frontend's `.env.local`:

```
NEXT_PUBLIC_API_URL=https://taskflow-backend.onrender.com/api
```

## Troubleshooting

- **Build fails**: Check that all dependencies in `package.json` are correct
- **Runtime errors**: Check Render logs for MongoDB connection issues
- **CORS errors**: Ensure your frontend URL is allowed in CORS settings (currently set to `http://localhost:3000`)

## Database Setup

Make sure your MongoDB Atlas cluster:
- Allows connections from `0.0.0.0/0` (all IPs) for Render
- Has the correct database user credentials
- Database name matches `DB_NAME` environment variable