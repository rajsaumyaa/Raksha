# Raksha Deployment Guide

This guide covers step-by-step instructions to deploy **Raksha** for free or in production environments.

---

## Option 1: Free Cloud Deployment (Recommended for Hackathons)

### Step 1: Deploy Backend on Render (Free Tier)
1. Push your repository to GitHub.
2. Log in to [Render](https://render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository and select the `backend` folder (or set Root Directory to `backend`).
4. Configure settings:
   - **Environment**: `Python 3` (or Docker)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Add Environment Variables:
   - `GROQ_API_KEY`: *(Your Groq API key from console.groq.com)*
6. Click **Create Web Service**. Note your backend URL (e.g. `https://raksha-api.onrender.com`).

---

### Step 2: Deploy Frontend on Vercel (Free Tier)
1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository and set Root Directory to `frontend`.
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_BACKEND_URL`: `https://raksha-api.onrender.com` *(your Render backend URL)*
4. Click **Deploy**. Vercel will build and launch your site at `https://raksha-app.vercel.app`.

---

## Option 2: Single Server / Docker Container Deployment

If deploying to a VPS (AWS EC2, DigitalOcean, Hetzner, Linode):

```bash
# 1. Build and Run Backend Container
cd backend
docker build -t raksha-backend .
docker run -d -p 8000:8000 -e GROQ_API_KEY="your_api_key" raksha-backend

# 2. Build and Run Frontend Container
cd ../frontend
docker build --build-arg NEXT_PUBLIC_BACKEND_URL="http://your-server-ip:8000" -t raksha-frontend .
docker run -d -p 3000:3000 raksha-frontend
```

---

## Environment Variables Reference

| Variable Name | Location | Description |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | Backend | Groq LLM API Key for real-time analysis |
| `NEXT_PUBLIC_BACKEND_URL` | Frontend | Target backend API base URL (e.g. `https://api.raksha.com`) |
