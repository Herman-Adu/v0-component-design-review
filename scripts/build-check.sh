#!/bin/bash
cd /vercel/share/v0-project
pnpm run build 2>&1 | tail -50
echo ""
echo "EXIT CODE: $?"
