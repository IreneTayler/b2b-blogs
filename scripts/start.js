#!/usr/bin/env node
/**
 * Single-command setup: start Docker (backend + DB), run migrations, then start frontend.
 * Run from project root: npm start
 */
const { execSync, spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

function run(cmd, opts = {}) {
  console.log('\n>', cmd);
  execSync(cmd, { stdio: 'inherit', cwd: root, ...opts });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fs = require('fs');

async function main() {
  const frontendDir = path.join(root, 'frontend');
  const nodeModules = path.join(frontendDir, 'node_modules');
  if (!fs.existsSync(nodeModules)) {
    console.log('Installing frontend dependencies (first run)...');
    execSync('npm install', { stdio: 'inherit', cwd: frontendDir });
  }

  console.log('Starting backend (Docker: MySQL + Laravel + Nginx)...');
  run('docker compose up -d --build');

  console.log('\nWaiting for database to be ready...');
  await wait(15000);

  console.log('\nRunning migrations (create tables)...');
  let migrated = false;
  for (let i = 0; i < 5; i++) {
    try {
      run('docker compose exec -T app php artisan migrate --force');
      migrated = true;
      break;
    } catch (e) {
      console.log(`Migration attempt ${i + 1} failed, retrying in 5s...`);
      await wait(5000);
    }
  }
  if (!migrated) {
    console.error('Migrations failed. Check that Docker and the app container are running.');
    process.exit(1);
  }

  console.log('\nStarting frontend (Vite)...');
  const frontend = spawn('npm', ['run', 'dev', '--prefix', 'frontend'], {
    stdio: 'inherit',
    cwd: root,
    shell: true,
  });
  frontend.on('close', (code) => process.exit(code ?? 0));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
