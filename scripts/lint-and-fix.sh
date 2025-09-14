#!/bin/bash

echo "🧹 Starting ARPOZAN Code Cleanup..."
echo ""

# Step 1: Run ESLint check
echo "📋 Step 1: Checking code quality with ESLint..."
npm run lint
ESLINT_EXIT_CODE=$?

# Step 2: Auto-format with Prettier
echo ""
echo "✨ Step 2: Auto-formatting code with Prettier..."
npx prettier --write components/ pages/ lib/ --ignore-path .gitignore

# Step 3: Run ESLint again to see remaining issues
echo ""
echo "🔍 Step 3: Final ESLint check..."
npm run lint

# Step 4: Report results
echo ""
if [ $ESLINT_EXIT_CODE -eq 0 ]; then
    echo "✅ All code quality checks passed!"
else
    echo "⚠️  Some ESLint issues may need manual fixing"
fi

echo ""
echo "🎉 Code cleanup complete!"