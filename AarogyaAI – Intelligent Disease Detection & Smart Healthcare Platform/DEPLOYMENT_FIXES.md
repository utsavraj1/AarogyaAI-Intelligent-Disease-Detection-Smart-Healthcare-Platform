# Deployment Fixes Applied ✅

## The Three Critical Issues (Now Fixed)

### 1. ❌ → ✅ **Frontend API Base URL**

**Problem:**
```env
VITE_API_BASE=http://localhost:8000
```
- Hardcoded to localhost:8000
- Browsers would try to reach `localhost:8000` — not accessible from user machines
- Result: ECONNREFUSED, frontend breaks

**Fix:**
```env
VITE_API_BASE=/api
```
- Now uses relative path `/api`
- Works both in container and from user machines
- Nginx reverse proxy routes `/api/*` → backend:8000

**File:** [frontend/.env.production](frontend/.env.production)

---

### 2. ❌ → ✅ **Models Directory Not Mounted**

**Problem:**
```yaml
# OLD docker-compose.yml — models not mounted
volumes:
  - uploaded_reports:/app/uploaded_reports
  - reports_output:/app/reports_output
  - db_data:/app/backend/db
  # ❌ models NOT here
```
- Backend container couldn't access `.keras` and `.pkl` files
- `MODEL_DIR / "blood_cell_cancer_model.keras"` would fail with FileNotFoundError
- Result: All predictions fail

**Fix:**
```yaml
# NEW docker-compose.yml
volumes:
  - uploaded_reports:/app/uploaded_reports
  - reports_output:/app/reports_output
  - db_data:/app/backend/db
  - ./models:/app/models:ro  # ✅ READ-ONLY mount
```

**File:** [docker-compose.yml](docker-compose.yml#L17)

---

### 3. ❌ → ✅ **No Reverse Proxy / Routing**

**Problem:**
```yaml
# OLD docker-compose.yml — no nginx
services:
  backend:
    ports: ["8000:8000"]  # Exposed to user
  frontend:
    ports: ["80:80"]       # Exposed to user
  # ❌ No nginx, no routing
```
- Frontend and backend are separate services on different ports
- CORS issues, port conflicts
- No clean `/api/*` routing
- Result: Frontend can't reach backend

**Fix:**
```yaml
# NEW docker-compose.yml
services:
  backend:
    # ❌ NOT exposed; only accessible via nginx
    networks:
      - aarogyaai-net
  
  frontend:
    networks:
      - aarogyaai-net
  
  nginx:
    # ✅ NEW: Reverse proxy on port 80
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro

networks:
  aarogyaai-net:
    driver: bridge
```

**Files:**
- [docker-compose.yml](docker-compose.yml) — added nginx service + network
- [frontend/nginx.conf](frontend/nginx.conf) — reverse proxy configuration

---

## Nginx Routing

```nginx
# Serves frontend at root
location / {
  root /usr/share/nginx/html;
  try_files $uri $uri/ /index.html;  # SPA routing
}

# Routes API calls to backend
location /api/ {
  proxy_pass http://backend:8000/;  # Container-to-container
  # ... headers + WebSocket support
}
```

**Flow:**
1. User opens `http://localhost` → Nginx (port 80)
2. Frontend loads static HTML/CSS/JS
3. Frontend makes request to `/api/auth/login`
4. Nginx intercepts → forwards to `http://backend:8000/auth/login`
5. Backend responds → Nginx returns to frontend
6. ✅ No CORS issues, works from any IP/domain

---

## Updated Architecture

```
┌─────────────────────────────────────────────────────┐
│             Docker Compose Network                   │
│                   aarogyaai-net                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│   ┌──────────────────────────────────────────┐     │
│   │  Nginx Reverse Proxy (port 80)           │     │
│   │  ├─ Serves frontend (/)                  │     │
│   │  ├─ Routes /api/* → backend:8000         │     │
│   │  └─ Security headers, caching             │     │
│   └──────────────────────────────────────────┘     │
│         ↓                              ↓             │
│   ┌─────────────────┐        ┌──────────────────┐  │
│   │  Frontend       │        │  Backend         │  │
│   │  (nginx:alpine) │        │  (FastAPI)       │  │
│   │  Port: 8080     │        │  Port: 8000      │  │
│   │                 │        │                  │  │
│   │  /index.html    │        │  /auth/login     │  │
│   │  /app.js        │        │  /predict/{mod}  │  │
│   │  /styles.css    │        │  /reports/{id}   │  │
│   └─────────────────┘        └──────────────────┘  │
│                                     ↓               │
│                              ┌──────────────────┐  │
│                              │  SQLite Database │  │
│                              │  /app/backend/db │  │
│                              └──────────────────┘  │
│                                                     │
│   ┌──────────────────────────────────────────┐    │
│   │  Mounted Volumes (Host → Container)      │    │
│   ├──────────────────────────────────────────┤    │
│   │ ./models → /app/models (read-only)       │    │
│   │ ./uploaded_reports → /app/uploaded_...   │    │
│   │ ./reports_output → /app/reports_output   │    │
│   └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## How to Deploy

### Step 1: Verify the fixes
```bash
# Check docker-compose.yml has models mount
grep "models" docker-compose.yml

# Check .env.production uses /api
grep "VITE_API_BASE" frontend/.env.production

# Check nginx.conf has reverse proxy
grep "proxy_pass" frontend/nginx.conf
```

### Step 2: Build and start
```bash
cd /path/to/Medical_AI_Diagnosis
docker-compose up --build
```

### Step 3: Test
```bash
# Frontend should load
curl http://localhost

# API docs should work
curl http://localhost/api/docs

# Backend health check
curl http://localhost/health
```

### Step 4: Verify predictions work
1. Open http://localhost
2. Register a new account
3. Go to Diagnosis → select disease module
4. Submit prediction
5. Should see result (no 502/504/connection errors)

---

## Validation Checklist

- [x] `models/` volume mounted in docker-compose.yml
- [x] Frontend `.env.production` uses `/api`
- [x] `nginx.conf` has reverse proxy configured
- [x] All services on same Docker network
- [x] Nginx listens on port 80
- [x] Backend NOT exposed on port 8000 (only via nginx)
- [x] Security headers in nginx.conf
- [x] Models directory is read-only (`:ro`)

---

## What If It Still Fails?

### Backend can't find models
```
Error: FileNotFoundError: [Errno 2] No such file or directory: '/app/models/...'
```
**Fix:** Verify mount in docker-compose.yml:
```bash
docker exec backend ls -la /app/models/
# Should list all .keras and .pkl files
```

### Frontend can't reach API
```
Network error in browser console
```
**Fix:** Verify nginx is running:
```bash
docker exec nginx curl http://backend:8000/docs
# Should return 200 OK
```

### Port already in use
```
Error: bind: address already in use
```
**Fix:** Stop existing containers:
```bash
docker-compose down
docker-compose up --build
```

---

## Summary

✅ **All three deployment-breaking issues fixed**
✅ **Architecture now production-ready**
✅ **Ready to `docker-compose up --build`**

