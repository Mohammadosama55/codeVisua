#!/bin/bash
set -e

# Start backend in background with auto-restart on crash
(while true; do
  cd /home/runner/workspace/backend && node server.js
  echo "Backend crashed, restarting in 2s..."
  sleep 2
done) &

# Give backend a moment to start
sleep 1

# Start frontend in foreground
cd /home/runner/workspace/frontend && npm run dev
