# DocMeet Backend Deployment Guide

## Prerequisites
- Node.js (v14 or higher)
- PM2 (Process Manager)
- Nginx
- SSL Certificate (Let's Encrypt recommended)
- MongoDB (production instance)

## Production Setup Steps

### 1. Environment Setup
```bash
# Install required production dependencies
npm install --production

# Install PM2 globally
npm install -g pm2
```

### 2. Environment Variables
Create a `.env` file in the backend directory with production values:
```env
NODE_ENV=production
PORT=5000
MONGODB_URL=your_production_mongodb_url
JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://yourdomain.com/admin
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### 3. PM2 Setup
```bash
# Start the application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 process list and set up startup script
pm2 save
pm2 startup
```

### 4. Nginx Configuration
1. Copy the nginx.conf file to your Nginx sites-available directory:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/docmeet
```

2. Create a symbolic link to sites-enabled:
```bash
sudo ln -s /etc/nginx/sites-available/docmeet /etc/nginx/sites-enabled/
```

3. Test Nginx configuration:
```bash
sudo nginx -t
```

4. If the test is successful, restart Nginx:
```bash
sudo systemctl restart nginx
```

### 5. SSL Certificate Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com
```

### 6. Security Checklist
- [ ] All sensitive environment variables are properly set
- [ ] MongoDB authentication and access restrictions are configured
- [ ] Firewall rules are set up (allow only ports 80, 443, and SSH)
- [ ] Regular security updates are enabled
- [ ] SSL certificate auto-renewal is configured

### 7. Monitoring
```bash
# Monitor application logs
pm2 logs

# Monitor application status
pm2 status

# Monitor application metrics
pm2 monit
```

### 8. Backup Strategy
- Set up automated MongoDB backups
- Configure log rotation
- Implement regular system backups

### 9. Maintenance
```bash
# Update dependencies
npm update

# Restart application after updates
pm2 restart all

# Monitor error logs
pm2 logs --error
```

## Troubleshooting

### Common Issues
1. If the application fails to start:
   - Check PM2 logs: `pm2 logs`
   - Verify environment variables
   - Check MongoDB connection

2. If Nginx returns 502 Bad Gateway:
   - Ensure backend server is running
   - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
   - Verify proxy settings in Nginx configuration

3. SSL Certificate issues:
   - Renew certificate: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`

## Maintenance Commands

### Application Management
```bash
# Restart application
pm2 restart docmeet-backend

# Stop application
pm2 stop docmeet-backend

# Delete from PM2
pm2 delete docmeet-backend
```

### Log Management
```bash
# View application logs
pm2 logs docmeet-backend

# Clear logs
pm2 flush
```

### System Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Node.js dependencies
npm audit fix
```