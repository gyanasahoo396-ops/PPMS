# Quick Start Checklist: Setting Up Firebase Multi-Environment CI/CD

Follow these steps to complete the setup of your Firebase multi-environment deployment with CI/CD.

## ✅ Prerequisites Checklist

Before you begin, ensure you have:
- [ ] Access to Firebase Console
- [ ] Owner/Admin access to both Firebase projects
- [ ] Admin access to GitHub repository
- [ ] Firebase CLI installed locally (optional, for testing)

## 🔧 Step-by-Step Setup

### Step 1: Create Firebase Development Project
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Click "Add project" or select existing project
- [ ] Create/verify project: `ppms-dev-9361e`
- [ ] Enable Firebase Hosting for the dev project
- [ ] Note down the project ID

### Step 2: Update Development Environment Configuration
- [ ] Go to Firebase Console → Project Settings for dev project
- [ ] Copy the Firebase configuration (apiKey, authDomain, etc.)
- [ ] Update `src/environments/environment.ts` with the actual dev Firebase config
- [ ] Commit and push this change

### Step 3: Generate Firebase Service Accounts

#### For Development Project:
- [ ] Open Firebase Console → Select `ppms-dev-9361e` project
- [ ] Go to Project Settings (gear icon) → Service Accounts
- [ ] Click "Generate New Private Key"
- [ ] Download and save the JSON file as `firebase-dev-service-account.json`
- [ ] Copy the entire JSON content to clipboard

#### For Production Project:
- [ ] Open Firebase Console → Select `ppms-b8d2b` project  
- [ ] Go to Project Settings (gear icon) → Service Accounts
- [ ] Click "Generate New Private Key"
- [ ] Download and save the JSON file as `firebase-prod-service-account.json`
- [ ] Copy the entire JSON content to clipboard

### Step 4: Add GitHub Secrets

- [ ] Go to your GitHub repository
- [ ] Navigate to: **Settings** → **Secrets and variables** → **Actions**
- [ ] Click **"New repository secret"**

#### Add Dev Secret:
- [ ] Name: `FIREBASE_SERVICE_ACCOUNT_DEV`
- [ ] Value: Paste the entire JSON from dev service account file
- [ ] Click "Add secret"

#### Add Prod Secret:
- [ ] Name: `FIREBASE_SERVICE_ACCOUNT_PROD`
- [ ] Value: Paste the entire JSON from prod service account file
- [ ] Click "Add secret"

### Step 5: Set Up Branch Structure

- [ ] Ensure you have a `develop` or `dev` branch
  ```bash
  git checkout -b develop
  git push -u origin develop
  ```
- [ ] Ensure you have a `main` or `master` branch (should already exist)

### Step 6: Configure Branch Protection (Recommended)

- [ ] Go to GitHub repository → Settings → Branches
- [ ] Add branch protection rule for `main` branch:
  - [ ] Require pull request reviews before merging
  - [ ] Require status checks to pass
  - [ ] Include administrators (optional)

### Step 7: Test Development Deployment

- [ ] Make a small change in the codebase
- [ ] Commit and push to `develop` branch:
  ```bash
  git checkout develop
  # make a change
  git add .
  git commit -m "Test dev deployment"
  git push origin develop
  ```
- [ ] Go to GitHub Actions tab
- [ ] Verify "Deploy to Firebase Dev Environment" workflow runs
- [ ] Check workflow logs for any errors
- [ ] Visit `https://ppms-dev-9361e.web.app` to see your changes

### Step 8: Test Production Deployment

- [ ] Create a pull request from `develop` to `main`
- [ ] Review and merge the PR
- [ ] Go to GitHub Actions tab
- [ ] Verify "Deploy to Firebase Production Environment" workflow runs
- [ ] Check workflow logs for any errors
- [ ] Visit `https://ppms-b8d2b.web.app` to see your changes

## 🎉 You're Done!

Your CI/CD pipeline is now fully operational. Here's what happens automatically:

### Development Flow:
1. Push to `develop` or `dev` branch
2. GitHub Actions builds with development config
3. Auto-deploys to `ppms-dev-9361e`
4. Live at: https://ppms-dev-9361e.web.app

### Production Flow:
1. Merge PR to `main` or `master` branch
2. GitHub Actions builds with production config
3. Auto-deploys to `ppms-b8d2b`
4. Live at: https://ppms-b8d2b.web.app

## 🔍 Verification Checklist

- [ ] Dev environment deploys successfully
- [ ] Prod environment deploys successfully
- [ ] Can see deployment history in Firebase Console
- [ ] Can see workflow runs in GitHub Actions
- [ ] Both URLs are accessible
- [ ] Environment configurations are correct

## 📚 Reference Documents

For detailed information, refer to:
- **CI_CD_SETUP.md** - Detailed CI/CD setup guide with troubleshooting
- **DEPLOYMENT.md** - Complete deployment guide
- **IMPLEMENTATION_SUMMARY.md** - Overview of all changes made

## 🆘 Troubleshooting

If something doesn't work:

1. **Check GitHub Actions logs** - Go to Actions tab and review failed workflow
2. **Verify secrets** - Ensure secret names match exactly
3. **Check Firebase permissions** - Service accounts need Firebase Hosting Admin role
4. **Test locally** - Try `npm run build:dev` and `npm run build:prod` locally
5. **Review documentation** - Check CI_CD_SETUP.md for common issues

## 🔐 Security Reminders

- ✅ Service account JSON files should NEVER be committed to Git
- ✅ Keep GitHub secrets secure and rotate them periodically
- ✅ Restrict who can push to `main` branch
- ✅ Review all deployments in Firebase Console

## 📝 Notes

- The `.gitignore` file already excludes service account JSON files
- You can manually trigger deployments via GitHub Actions UI
- Local deployments still work with `npm run deploy:dev` or `npm run deploy:prod`
- Both environments are completely isolated from each other

---

**Need Help?** Refer to the detailed guides in the repository or open an issue.
