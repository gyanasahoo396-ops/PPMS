# CI/CD Setup Guide

This guide explains how to set up Continuous Integration and Continuous Deployment (CI/CD) for the PPMS application with Firebase hosting.

## Overview

The project uses GitHub Actions to automatically deploy to two Firebase environments:
- **Development**: Triggered by pushes to `develop` or `dev` branch
- **Production**: Triggered by pushes to `main` or `master` branch

## Prerequisites

1. Two Firebase projects created:
   - Development: `ppms-dev-9361e`
   - Production: `ppms-b8d2b`

2. GitHub repository with appropriate branch structure:
   - `develop` or `dev` branch for development
   - `main` or `master` branch for production

## Setup Steps

### Step 1: Create Firebase Projects

If you haven't already created separate Firebase projects for dev and prod:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project for development (e.g., `ppms-dev-9361e`)
3. Your production project should already exist (`ppms-b8d2b`)

### Step 2: Generate Firebase Service Accounts

For each Firebase project, you need to generate a service account:

#### For Development Project:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **development project** (`ppms-dev-9361e`)
3. Click the gear icon ⚙️ → **Project Settings**
4. Navigate to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the JSON file securely
7. Copy the entire contents of this JSON file

#### For Production Project:
1. Select your **production project** (`ppms-b8d2b`)
2. Repeat steps 3-7 above
3. Save this JSON file separately

### Step 3: Add Secrets to GitHub Repository

Add the Firebase service account credentials as secrets in your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add the following two secrets:

#### Secret 1: FIREBASE_SERVICE_ACCOUNT_DEV
- **Name**: `FIREBASE_SERVICE_ACCOUNT_DEV`
- **Value**: Paste the entire JSON content from the development service account file
- Click **Add secret**

#### Secret 2: FIREBASE_SERVICE_ACCOUNT_PROD
- **Name**: `FIREBASE_SERVICE_ACCOUNT_PROD`
- **Value**: Paste the entire JSON content from the production service account file
- Click **Add secret**

### Step 4: Enable Firebase Hosting

For both projects, ensure Firebase Hosting is enabled:

1. Go to Firebase Console
2. Select the project
3. Navigate to **Hosting** in the left sidebar
4. Click **Get Started** if hosting is not yet set up
5. Complete the hosting setup wizard

### Step 5: Grant Permissions

Ensure the service accounts have the necessary permissions:

1. In Firebase Console, go to **Project Settings** → **Users and permissions**
2. Verify that the service accounts have **Firebase Hosting Admin** or **Editor** role

## Testing the CI/CD Pipeline

### Test Development Deployment

1. Create a feature branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/test-cicd
   ```

2. Make a small change (e.g., update a comment in a file)

3. Commit and push to `develop`:
   ```bash
   git add .
   git commit -m "Test CI/CD for dev environment"
   git push origin develop
   ```

4. Go to your repository's **Actions** tab on GitHub
5. You should see a new workflow run: "Deploy to Firebase Dev Environment"
6. Monitor the workflow execution
7. Once complete, verify the deployment at: `https://ppms-dev-9361e.web.app`

### Test Production Deployment

1. Create a pull request from `develop` to `main`
2. Review and merge the pull request
3. The production deployment workflow will trigger automatically
4. Monitor the workflow in the **Actions** tab
5. Once complete, verify the deployment at: `https://ppms-b8d2b.web.app`

## Workflow Files

The CI/CD workflows are defined in:
- `.github/workflows/deploy-dev.yml` - Development deployment
- `.github/workflows/deploy-prod.yml` - Production deployment

### Manual Deployment Trigger

Both workflows can also be triggered manually:

1. Go to **Actions** tab in your GitHub repository
2. Select the workflow you want to run:
   - "Deploy to Firebase Dev Environment"
   - "Deploy to Firebase Production Environment"
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## Troubleshooting

### Workflow Fails with "Error: Input required: firebaseServiceAccount"

**Cause**: The service account secret is missing or incorrectly named.

**Solution**:
1. Verify the secret names match exactly:
   - `FIREBASE_SERVICE_ACCOUNT_DEV`
   - `FIREBASE_SERVICE_ACCOUNT_PROD`
2. Ensure the JSON content is valid
3. Re-add the secret if necessary

### Workflow Fails with "403 Permission Denied"

**Cause**: The service account doesn't have sufficient permissions.

**Solution**:
1. Go to Firebase Console → Project Settings → Users and permissions
2. Ensure the service account has **Firebase Hosting Admin** role
3. If the role is missing, add it manually

### Build Fails in CI/CD

**Cause**: Missing dependencies or build errors.

**Solution**:
1. Test the build locally first:
   ```bash
   npm ci
   npm run build:dev  # or build:prod
   ```
2. Fix any build errors locally
3. Commit and push the fixes

### Wrong Project Deployed

**Cause**: Incorrect Firebase project configuration.

**Solution**:
1. Verify `.firebaserc` has correct project IDs:
   ```json
   {
     "projects": {
       "dev": "ppms-dev-9361e",
       "prod": "ppms-b8d2b"
     }
   }
   ```
2. Check workflow file uses correct `projectId`

## Security Best Practices

1. **Never commit service account JSON files** to the repository
2. **Rotate service account keys** periodically
3. **Use least-privilege principle** - grant only necessary permissions
4. **Monitor workflow logs** for any security issues
5. **Limit branch protection** - only authorized users should merge to main/master

## Monitoring Deployments

### View Deployment History

1. Go to Firebase Console
2. Select the project (dev or prod)
3. Navigate to **Hosting** → **View releases**
4. See all deployment history with timestamps

### Rollback a Deployment

If you need to rollback to a previous version:

1. Go to Firebase Console → Hosting
2. Find the previous release
3. Click the three dots menu → **Rollback**

### GitHub Actions Logs

To view detailed logs of CI/CD runs:

1. Go to repository's **Actions** tab
2. Click on the workflow run
3. Click on the job name
4. Expand each step to see detailed logs

## Local Development vs CI/CD

### Local Development
- Use `npm start` for development server
- Use `npm run build:dev` to test dev build locally
- Use `npm run deploy:dev` to manually deploy to dev

### CI/CD Deployment
- Push to `develop/dev` branch → auto-deploys to dev environment
- Push to `main/master` branch → auto-deploys to prod environment
- Manual trigger available via GitHub Actions UI

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Service Accounts](https://firebase.google.com/docs/admin/setup#initialize-sdk)

---

**Questions or Issues?**
If you encounter any issues setting up CI/CD, please check the troubleshooting section or review the workflow logs in GitHub Actions.
