# Deployment Guide

## Deploy to Vercel (Recommended)

### Step 1: Prepare Your Code
```bash
# Make sure everything is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 3: Import Project
1. Click "Add New Project"
2. Select your repository
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### Step 4: Add Environment Variables
In Vercel project settings, add:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_random_secret_key
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Visit your live site!

## MongoDB Atlas Setup for Production

### 1. Update Network Access
1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Add `0.0.0.0/0` (Allow access from anywhere)
   - Or add Vercel's IP ranges for better security

### 2. Create Production Database
1. Use a separate database for production
2. Update MONGODB_URI with production database name

## Environment Variables

### Development (.env.local)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/computerstore-dev
JWT_SECRET=dev-secret-key
```

### Production (Vercel)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/computerstore-prod
JWT_SECRET=strong-random-production-key-change-this
```

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test login functionality
- [ ] Create admin account (manually in database)
- [ ] Create owner account (manually in database)
- [ ] Test product creation
- [ ] Test order placement
- [ ] Test all API endpoints
- [ ] Check error handling
- [ ] Monitor logs in Vercel dashboard

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Domains → Add Domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation

## Monitoring

### Vercel Analytics
- Enable in project settings
- Monitor page views and performance

### Error Tracking
- Check Vercel logs for errors
- Set up error notifications

## Security Best Practices

1. **Strong JWT Secret**
   - Use a long random string
   - Never commit to git
   - Different for dev/prod

2. **MongoDB Security**
   - Use strong passwords
   - Enable IP whitelisting
   - Regular backups

3. **HTTPS**
   - Vercel provides automatic HTTPS
   - Ensure all API calls use HTTPS

4. **Rate Limiting**
   - Consider adding rate limiting for API routes
   - Protect against brute force attacks

## Backup Strategy

### Database Backups
1. MongoDB Atlas provides automatic backups
2. Configure backup schedule
3. Test restore process

### Code Backups
1. Keep code in GitHub
2. Tag releases
3. Document changes

## Scaling Considerations

### Database
- MongoDB Atlas auto-scales
- Monitor connection limits
- Add indexes for better performance

### Vercel
- Automatically scales
- Monitor function execution time
- Optimize API routes

## Troubleshooting

### Build Fails
- Check build logs in Vercel
- Verify all dependencies are in package.json
- Test build locally: `npm run build`

### Database Connection Issues
- Verify MONGODB_URI is correct
- Check IP whitelist in Atlas
- Test connection string locally

### API Routes Not Working
- Check function logs in Vercel
- Verify environment variables
- Test API routes locally

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration
- Clear browser localStorage

## Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Optimize image sizes
   - Use CDN for images

2. **API Caching**
   - Implement caching for product lists
   - Use SWR or React Query

3. **Database Indexes**
   - Add indexes on frequently queried fields
   - Monitor slow queries

## Maintenance

### Regular Tasks
- Monitor error logs weekly
- Check database performance
- Update dependencies monthly
- Review security advisories

### Updates
```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Fix security issues
npm audit fix
```

## Support

For deployment issues:
1. Check Vercel documentation
2. Check MongoDB Atlas documentation
3. Review error logs
4. Contact support if needed
