#!/bin/bash

# Stop on errors
set -e

# Parse arguments
USE_DOCKER=""
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --docker) USE_DOCKER="1"; shift ;;
        --local) USE_DOCKER="2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
done

echo "🚀 Starting Next Boilerplate setup..."

# 1. Setup .env
if [ ! -f .env ]; then
  echo "📄 Creating .env from .env.example..."
  cp .env.example .env
else
  echo "📄 .env file already exists, skipping copy."
fi

# 2. Install dependencies
echo "📦 Installing dependencies using pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm is not installed. Please install pnpm (npm i -g pnpm) and try again."
    exit 1
fi
pnpm install

# 3. Docker vs Local
echo ""
if [ -z "$USE_DOCKER" ]; then
    echo "🐳 Do you want to use Docker Compose for services (Postgres, Redis, Mailpit)?"
    echo "  1) Yes (Automatically start via docker-compose)"
    echo "  2) No (Skip Docker. Requires manually running Postgres/Redis locally and configuring .env)"
    read -p "Enter your choice (1/2): " choice
else
    choice=$USE_DOCKER
fi

if [ "$choice" == "1" ]; then
    echo "🐳 Starting services via Docker Compose..."
    if ! command -v docker &> /dev/null; then
        echo "❌ Error: Docker is not installed on your machine!"
        exit 1
    fi
    docker compose up -d
    echo "⏳ Waiting a few seconds for the database to be ready..."
    sleep 3
else
    echo "💻 You chose to skip Docker. Please ensure local services are running and configured correctly in .env."
    if [ -z "$USE_DOCKER" ]; then
        echo "⏳ Press Enter to continue when you are ready..."
        read -r
    fi
fi

# 4. Database Setup
echo "🗄️  Configuring Prisma (Generate & Push)..."
pnpm prisma:generate
pnpm prisma:push

echo ""
echo "🎉 Setup completed successfully!"
echo "👉 Run 'pnpm dev' to start the project."
