#!/bin/bash

set -e

echo "🚀 Starting local CI/CD checks..."
echo ""
echo "📂 Navigating to client directory..."
cd client

echo "📦 Installing dependencies..."
npm ci
echo "✅ Dependencies installed"
echo ""

echo "🔍 Running ESLint..."
npm run lint
echo "✅ Linting passed"
echo ""

echo "🔧 Running TypeScript check..."
npx tsc --noEmit
echo "✅ TypeScript check passed"
echo ""

echo "🧪 Running tests with coverage..."
npm test -- --coverage --watchAll=false --verbose
echo "✅ Tests passed"
echo ""

echo "🏗️  Building application..."
npm run build
echo "✅ Build completed"
echo ""

echo "🔒 Running security audit..."
npm audit --audit-level moderate
echo "✅ Security audit completed"
echo ""

echo "🎉 All checks passed! Your code is ready for CI/CD pipeline."
