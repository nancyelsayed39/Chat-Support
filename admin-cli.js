#!/usr/bin/env node
/**
 * Admin Management CLI
 * Usage: node admin-cli.js add <email> <password> <name>
 *        node admin-cli.js remove <email>
 *        node admin-cli.js list
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from './db/models/admin.model.js';

dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

async function addAdmin(email, password, name) {
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.error(`❌ Admin with email ${email} already exists`);
      process.exit(1);
    }

    const admin = new Admin({
      email,
      password,
      name,
      verified: true
    });

    await admin.save();
    console.log(`✅ Admin added successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name}`);
  } catch (error) {
    console.error('❌ Error adding admin:', error.message);
    process.exit(1);
  }
}

async function removeAdmin(email) {
  try {
    const result = await Admin.findOneAndDelete({ email });
    if (!result) {
      console.error(`❌ Admin with email ${email} not found`);
      process.exit(1);
    }
    console.log(`✅ Admin ${email} removed successfully!`);
  } catch (error) {
    console.error('❌ Error removing admin:', error.message);
    process.exit(1);
  }
}

async function listAdmins() {
  try {
    const admins = await Admin.find({}, 'email name verified createdAt');
    if (admins.length === 0) {
      console.log('No admins found');
      return;
    }
    console.log('\n📋 Registered Admins:');
    console.log('='.repeat(70));
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name}`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   ✓ Verified: ${admin.verified}`);
      console.log(`   📅 Created: ${new Date(admin.createdAt).toLocaleDateString()}`);
      console.log('-'.repeat(70));
    });
  } catch (error) {
    console.error('❌ Error listing admins:', error.message);
    process.exit(1);
  }
}

async function main() {
  const command = process.argv[2];

  if (!command) {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              ChatHub Admin Management CLI                     ║
╚═══════════════════════════════════════════════════════════════╝

Usage:
  node admin-cli.js add <email> <password> <name>
  node admin-cli.js remove <email>
  node admin-cli.js list

Examples:
  node admin-cli.js add admin@example.com "SecurePass123!" "John Admin"
  node admin-cli.js remove admin@example.com
  node admin-cli.js list

Password Requirements:
  - At least 8 characters
  - 1 uppercase letter
  - 1 lowercase letter
  - 1 number
  - 1 special character (#?!@$%^&*-)
    `);
    process.exit(0);
  }

  await connectDB();

  switch (command) {
    case 'add': {
      const email = process.argv[3];
      const password = process.argv[4];
      const name = process.argv[5];

      if (!email || !password || !name) {
        console.error('❌ Usage: node admin-cli.js add <email> <password> <name>');
        process.exit(1);
      }

      // Validate password
      const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      if (!passwordRegex.test(password)) {
        console.error('❌ Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char');
        process.exit(1);
      }

      await addAdmin(email, password, name);
      break;
    }

    case 'remove': {
      const email = process.argv[3];
      if (!email) {
        console.error('❌ Usage: node admin-cli.js remove <email>');
        process.exit(1);
      }
      await removeAdmin(email);
      break;
    }

    case 'list': {
      await listAdmins();
      break;
    }

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('Available commands: add, remove, list');
      process.exit(1);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main();
