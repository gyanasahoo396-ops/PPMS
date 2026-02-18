/**
 * User Onboarding Script for PPMS
 * This script creates a new user in Firebase Authentication and Firestore
 * 
 * Usage:
 *   node onboard-user.mjs <email> <password> <displayName> <role> [department]
 * 
 * Example:
 *   node onboard-user.mjs minister@example.com SecurePass123 "John Doe" minister "Finance"
 * 
 * Available Roles: minister, admin, manager, viewer
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 4) {
  console.error('❌ Error: Missing required arguments\n');
  console.log('Usage:');
  console.log('  node onboard-user.mjs <email> <password> <displayName> <role> [department]\n');
  console.log('Example:');
  console.log('  node onboard-user.mjs minister@example.com SecurePass123 "John Doe" minister "Finance"\n');
  console.log('Available Roles: minister, admin, manager, viewer');
  process.exit(1);
}

const [email, password, displayName, role, department] = args;

// Validate role
const validRoles = ['minister', 'admin', 'manager', 'viewer'];
if (!validRoles.includes(role.toLowerCase())) {
  console.error(`❌ Error: Invalid role "${role}"`);
  console.log(`Valid roles: ${validRoles.join(', ')}`);
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error(`❌ Error: Invalid email format "${email}"`);
  process.exit(1);
}

// Validate password length
if (password.length < 6) {
  console.error('❌ Error: Password must be at least 6 characters long');
  process.exit(1);
}

console.log('\n🚀 Starting User Onboarding Process...\n');

// Initialize Firebase Admin SDK
try {
  // Try to load service account key from file
  let serviceAccount;
  try {
    const serviceAccountPath = resolve('./firebase-admin-key.json');
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    console.log('✅ Loaded service account from firebase-admin-key.json');
  } catch (error) {
    console.log('⚠️  Warning: Could not load firebase-admin-key.json');
    console.log('   Make sure to download it from Firebase Console:');
    console.log('   Project Settings > Service Accounts > Generate New Private Key\n');
    
    // Try to use environment variables as fallback
    console.log('   Attempting to use environment variables...\n');
    
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error('FIREBASE_PROJECT_ID environment variable not set');
    }
    
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };
  }

  initializeApp({
    credential: cert(serviceAccount)
  });

  console.log('✅ Firebase Admin SDK initialized\n');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  console.log('\nPlease ensure you have either:');
  console.log('1. A firebase-admin-key.json file in the project root, OR');
  console.log('2. These environment variables set:');
  console.log('   - FIREBASE_PROJECT_ID');
  console.log('   - FIREBASE_CLIENT_EMAIL');
  console.log('   - FIREBASE_PRIVATE_KEY\n');
  process.exit(1);
}

const auth = getAuth();
const db = getFirestore();

async function onboardUser() {
  try {
    // Step 1: Create user in Firebase Authentication
    console.log('📝 Creating user in Firebase Authentication...');
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: false
    });

    console.log(`✅ User created with UID: ${userRecord.uid}\n`);

    // Step 2: Create user document in Firestore
    console.log('💾 Creating user document in Firestore...');
    const userDoc = {
      email: email,
      displayName: displayName,
      phoneNumber: null,
      role: role.toLowerCase(),
      department: department || null,
      createdAt: Timestamp.now(),
      lastLogin: null,
      isActive: true
    };

    await db.collection('users').doc(userRecord.uid).set(userDoc);
    console.log('✅ User document created in Firestore\n');

    // Step 3: Send password reset email (optional)
    console.log('📧 Generating password reset link...');
    try {
      const resetLink = await auth.generatePasswordResetLink(email);
      console.log(`✅ Password reset link: ${resetLink}\n`);
      console.log('   Send this link to the user to set their own password.\n');
    } catch (error) {
      console.log('⚠️  Could not generate password reset link (optional)');
      console.log(`   Error: ${error.message}\n`);
    }

    // Display summary
    console.log('━'.repeat(60));
    console.log('✨ User Successfully Onboarded!');
    console.log('━'.repeat(60));
    console.log(`📧 Email:       ${email}`);
    console.log(`👤 Name:        ${displayName}`);
    console.log(`🏷️  Role:        ${role.toUpperCase()}`);
    if (department) {
      console.log(`🏢 Department:  ${department}`);
    }
    console.log(`🔑 UID:         ${userRecord.uid}`);
    console.log(`🔐 Password:    ${password}`);
    console.log('━'.repeat(60));
    console.log('\n✅ The user can now log in to the PPMS system!\n');

  } catch (error) {
    console.error('\n❌ Error during onboarding:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      console.log('\n💡 This email is already registered in the system.');
      console.log('   Use a different email or delete the existing user first.\n');
    }
    
    process.exit(1);
  }
}

// Run the onboarding process
onboardUser();
