# Deployment Guide

This guide covers deploying the Store Stride application to production.

## Prerequisites

- Docker and Docker Compose installed
- Git (for version control)
- Production server with at least 2GB RAM
- Domain name (optional but recommended)

## Environment Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd <your-repo>
```

### 2. Configure Environment Variables

#### Backend (.env)

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
APP_ENV=production
DATABASE_URL=postgresql+psycopg://marketplace:secure_password@db:5432/marketplace
SECRET_KEY=your-secure-secret-key-here
CORS_ORIGINS=["https://yourdomain.com"]
SECURE_COOKIES=true
AUTO_CREATE_TABLES=false
```

#### Frontend (.env)

```bash
cp store-stride-ui/.env.example store-stride-ui/.env
```

Edit `store-stride-ui/.env`:

```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

## Docker Deployment

### Building and Running with Docker Compose

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Database Migrations

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

## Deployment Options

### Option 1: VPS Deployment (DigitalOcean, AWS EC2, Linode, etc.)

1. **SSH into your server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Docker and Docker Compose**
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose
   sudo usermod -aG docker $USER
   ```

3. **Clone and setup**
   ```bash
   git clone <your-repo-url>
   cd <your-repo>
   ```

4. **Start services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Setup Nginx reverse proxy (recommended)**
   ```bash
   sudo apt install -y nginx
   ```

   Create `/etc/nginx/sites-available/marketplace`:
   ```nginx
   upstream backend {
       server localhost:8000;
   }

   upstream frontend {
       server localhost:3000;
   }

   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://frontend;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api {
           proxy_pass http://backend;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 2: Vercel/Netlify (Frontend only)

#### Vercel

1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables:
   ```
   VITE_API_URL=https://api.yourdomain.com/api/v1
   ```

#### Netlify

1. Connect your GitHub repo
2. Build settings:
   - Base directory: `store-stride-ui`
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Site settings

### Option 3: Heroku (Backend)

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:standard-0
   heroku addons:create heroku-redis:premium-0
   ```

2. **Set environment variables**
   ```bash
   heroku config:set APP_ENV=production
   heroku config:set SECRET_KEY=your-secret-key
   ```

3. **Deploy**
   ```bash
   git push heroku main
   heroku run alembic upgrade head
   ```

### Option 4: Railway.app

1. Connect GitHub repo
2. Add PostgreSQL and Redis services
3. Set environment variables
4. Deploy automatically on git push

### Option 5: AWS (ECS + RDS + ElastiCache)

1. Create RDS PostgreSQL instance
2. Create ElastiCache Redis cluster
3. Push Docker images to ECR
4. Create ECS task definitions
5. Configure load balancer
6. Deploy containers

## Monitoring & Maintenance

### Health Checks

```bash
# Backend
curl http://localhost:8000/health

# Frontend
curl http://localhost:3000
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs backend
```

### Backup Database

```bash
docker-compose -f docker-compose.prod.yml exec db pg_dump -U marketplace marketplace > backup.sql
```

### Restore Database

```bash
docker-compose -f docker-compose.prod.yml exec -T db psql -U marketplace marketplace < backup.sql
```

## Security Best Practices

1. **Change default passwords**
   - Set strong `SECRET_KEY` in .env
   - Use secure `ADMIN_PASSWORD`
   - Use complex database passwords

2. **Enable SSL/TLS**
   - Use HTTPS everywhere
   - Set `SECURE_COOKIES=true`

3. **Firewall rules**
   - Only expose ports 80, 443
   - Restrict database access to container network

4. **Regular updates**
   - Keep Docker images updated
   - Monitor security advisories

5. **Environment variables**
   - Never commit .env to git
   - Use secure secret management

## Scaling

### Load Balancing

Use Nginx or HAProxy to distribute traffic across multiple backend instances.

### Database Optimization

- Enable connection pooling
- Set up read replicas
- Regular VACUUM and ANALYZE

### Caching

- Redis is configured for session and data caching
- Increase `CACHE_TTL_SECONDS` if appropriate

## Troubleshooting

### Application won't start

```bash
docker-compose -f docker-compose.prod.yml logs backend
```

### Database connection issues

```bash
docker-compose -f docker-compose.prod.yml exec db psql -U marketplace -d marketplace
```

### Port already in use

```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>
```

## Support

For issues and questions, refer to:
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Documentation](https://react.dev)
- [Docker Documentation](https://docs.docker.com)
