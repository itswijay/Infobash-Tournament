#!/usr/bin/env node

/**
 * Database Setup Script for InfoBash Tournament
 *
 * This script helps set up the database tables by running the SQL scripts.
 * You'll need to manually execute the SQL scripts in your Supabase dashboard.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 InfoBash Tournament Database Setup')
console.log('=====================================\n')

console.log('📋 To set up your database, please follow these steps:\n')

console.log('1. Go to your Supabase project dashboard')
console.log('2. Navigate to the SQL Editor')
console.log('3. Run the following SQL scripts in order:\n')

// Read and display the SQL scripts
const sqlFiles = ['ADMIN_AUDIT_LOGS_SETUP.sql', 'MATCHES_TABLE_SETUP.sql']

sqlFiles.forEach((file) => {
  const filePath = path.join(__dirname, file)
  if (fs.existsSync(filePath)) {
    console.log(`📄 ${file}:`)
    console.log(
      '   Copy and paste this content into your Supabase SQL Editor:\n'
    )

    const content = fs.readFileSync(filePath, 'utf8')
    console.log(content)
    console.log('\n' + '─'.repeat(80) + '\n')
  } else {
    console.log(`❌ ${file} not found`)
  }
})

console.log('✅ After running the SQL scripts, your database will be ready!')
console.log('🚀 You can now start your application with: npm run dev\n')

console.log(
  '💡 Note: Make sure you have the correct environment variables set:'
)
console.log('   - VITE_SUPABASE_URL')
console.log('   - VITE_SUPABASE_ANON_KEY')
