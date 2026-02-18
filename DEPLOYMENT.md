# Dhamnagar PPMS - Firebase Multi-Environment Deployment Guide

## 🌍 Multi-Environment Setup

This project is configured with two Firebase environments:
- **Development (dev)**: For testing and development purposes
- **Production (prod)**: For live production deployment

## ✅ Build Completed Successfully!

The Angular application has been built successfully and is ready for deployment.

### Build Output
- **Location**: `dist/dhamnagar-monitor/browser/`
- **Size**: ~157 KB
- **Status**: ✅ Production-ready

## 🔥 Firebase Configuration

### Firebase Projects
The application uses two Firebase projects:

1. **Development**: `ppms-dev-9361e`
   - URL: `https://ppms-dev-9361e.web.app`
   - Alternative: `https://ppms-dev-9361e.firebaseapp.com`

2. **Production**: `ppms-b8d2b`
   - URL: `https://ppms-b8d2b.web.app`
   - Alternative: `https://ppms-b8d2b.firebaseapp.com`

### 1. Firebase Project Configuration (`.firebaserc`)
```json
{
  "projects": {
    "default": "ppms-b8d2b",
    "dev": "ppms-dev-9361e",
    "prod": "ppms-b8d2b"
  }
}
```

### 2. Firebase Hosting Configuration (`firebase.json`)
- Public directory: `dist/dhamnagar-monitor/browser`
- Single Page Application routing configured
- Cache optimization enabled

### 3. Environment Files
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

## 🚀 Deployment Methods

### Method 1: Automated CI/CD with GitHub Actions (Recommended)

The repository is configured with automated deployments:

#### Dev Environment
- **Trigger**: Push to `develop` or `dev` branch
- **Workflow**: `.github/workflows/deploy-dev.yml`
- **Target**: Firebase project `ppms-dev-9361e`
- **Manual Trigger**: Available via GitHub Actions UI

#### Production Environment
- **Trigger**: Push to `main` or `master` branch
- **Workflow**: `.github/workflows/deploy-prod.yml`
- **Target**: Firebase project `ppms-b8d2b`
- **Manual Trigger**: Available via GitHub Actions UI

#### Setup Requirements for CI/CD
1. **Firebase Service Accounts**: Generate service accounts for both projects
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key for each project
   
2. **GitHub Secrets**: Add the following secrets to your repository:
   - `FIREBASE_SERVICE_ACCOUNT_DEV`: Service account JSON for dev project
   - `FIREBASE_SERVICE_ACCOUNT_PROD`: Service account JSON for prod project
   
   To add secrets:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add each secret with the appropriate name and JSON content

### Method 2: Manual Deployment via Firebase CLI

**You need to login with an account that has access to both Firebase projects.**

#### Deploy to Development
```bash
npm run deploy:dev
```
or
```bash
npm run build:dev
npx firebase deploy --only hosting -P dev
```

#### Deploy to Production
```bash
npm run deploy:prod
```
or
```bash
npm run build:prod
npx firebase deploy --only hosting -P prod
```

#### First-time Firebase Login
```bash
npx firebase login
```

### Method 3: Manual Deployment via Firebase Console

If you don't have CLI access:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select the appropriate project (dev or prod)
3. Navigate to **Hosting** section
4. Click **"Add another site"** or use the existing site
5. Upload the contents of `dist/dhamnagar-monitor/browser/` directory

## 📦 Available npm Scripts

### Build Commands
```bash
npm run build          # Build with default configuration (production)
npm run build:dev      # Build for development environment
npm run build:prod     # Build for production environment
```

### Development
```bash
npm start              # Start development server
npm run watch          # Watch mode with development configuration
npm test               # Run tests
```

### Deployment
```bash
npm run deploy         # Build and deploy to default project
npm run deploy:dev     # Build and deploy to development
npm run deploy:prod    # Build and deploy to production
```

## 🔐 Important Notes

### 1. Firebase Project Access
Ensure your Firebase account has access to both projects:
- `ppms-dev-9361e` (Development)
- `ppms-b8d2b` (Production)

### 2. Environment Configuration
Each environment has its own Firebase configuration:
- **Development**: Uses `environment.ts` with dev project credentials
- **Production**: Uses `environment.prod.ts` with prod project credentials

### 3. Deployment Permissions
For CI/CD deployments:
- Service accounts must have "Firebase Hosting Admin" role
- GitHub repository must have the service account secrets configured

### 4. Branch Strategy
Recommended Git workflow:
- `develop/dev` branch → Development environment
- `main/master` branch → Production environment
- Feature branches → Local testing only

## 🌐 Post-Deployment URLs

### Development Environment
After successful deployment to dev:
- **Primary URL**: https://ppms-dev-9361e.web.app
- **Alternative URL**: https://ppms-dev-9361e.firebaseapp.com

### Production Environment
After successful deployment to production:
- **Primary URL**: https://ppms-b8d2b.web.app
- **Alternative URL**: https://ppms-b8d2b.firebaseapp.com

## ✨ Features Deployed

- ✅ Dashboard with KPIs and Charts
- ✅ Department-wise Project Filtering
- ✅ HM Priority Projects
- ✅ Stuck Projects Alerts
- ✅ Project Detail Modal with Before/After Photos
- ✅ Responsive Design (Mobile & Desktop)
- ✅ Chart.js Visualizations
- ✅ Tailwind CSS Styling
- ✅ Font Awesome Icons

## 🛠️ Troubleshooting

### Permission Denied Error
**Solution**: This happens when the logged-in account does not have access to the Firebase project.

1. Logout of the current session:
   ```bash
   npx firebase logout
   ```

2. Login with the project owner account:
   ```bash
   npx firebase login
   ```

3. Re-run deployment:
   ```bash
   npm run deploy:dev  # or deploy:prod
   ```

### CI/CD Pipeline Failures

#### Missing Service Account Secret
**Error**: `Error: Input required and not supplied: firebaseServiceAccount`

**Solution**: Add the required service account secret to GitHub repository:
1. Generate service account key from Firebase Console
2. Add as GitHub secret (`FIREBASE_SERVICE_ACCOUNT_DEV` or `FIREBASE_SERVICE_ACCOUNT_PROD`)

#### Build Failures
**Error**: Build errors during CI/CD

**Solution**: 
1. Test build locally first: `npm run build:dev` or `npm run build:prod`
2. Ensure all dependencies are in `package.json` (not devDependencies)
3. Check workflow logs in GitHub Actions tab

### Wrong Environment Deployed
**Issue**: Development build deployed to production

**Solution**: 
- Always use the correct npm script
- For production: Use `npm run deploy:prod` or push to `main/master` branch
- For development: Use `npm run deploy:dev` or push to `develop/dev` branch

### Bundle Size Warnings
We've optimized the build configuration (`angular.json`) to allow up to:
- **1MB** for initial bundle warning
- **2MB** for error limit

### 404 Errors After Deployment
The `firebase.json` configuration includes URL rewrites for SPA routing, so this should not occur. If it does:
1. Verify `firebase.json` has the rewrite rules
2. Ensure the build output directory is correct
3. Clear browser cache and try again

## 🚦 CI/CD Workflow Status

You can monitor deployment status:
1. Go to repository's **Actions** tab on GitHub
2. View workflow runs for each deployment
3. Check logs for any errors or warnings

---

**Need Help?** 
- For Firebase access: Contact the Firebase project owner
- For CI/CD issues: Check GitHub Actions logs
- For build problems: Run builds locally first to debug
