#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Function to remove unused imports from a file
function removeUnusedImports(filePath, unusedImports) {
  const content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  
  // Track which imports to remove
  const toRemove = new Set(unusedImports);
  
  lines = lines.map(line => {
    // Handle import statements
    if (line.trim().startsWith('import')) {
      // Check if this line contains unused imports
      let newLine = line;
      
      // Handle named imports like: import { A, B, C } from 'module'
      if (line.includes('{') && line.includes('}')) {
        const match = line.match(/import\s*\{([^}]+)\}\s*from\s*['"][^'"]+['"]/);
        if (match) {
          const imports = match[1].split(',').map(i => i.trim());
          const filteredImports = imports.filter(imp => !toRemove.has(imp));
          
          if (filteredImports.length === 0) {
            return ''; // Remove entire line
          } else if (filteredImports.length !== imports.length) {
            newLine = line.replace(match[1], filteredImports.join(', '));
          }
        }
      }
      
      // Handle default imports like: import Something from 'module'
      else {
        const match = line.match(/import\s+(\w+)/);
        if (match && toRemove.has(match[1])) {
          return ''; // Remove entire line
        }
      }
      
      return newLine;
    }
    return line;
  });
  
  // Remove empty lines that were import statements
  lines = lines.filter((line, index) => {
    if (line.trim() === '') {
      // Check if this empty line was previously an import
      const prevLine = lines[index - 1];
      const nextLine = lines[index + 1];
      if (prevLine && (prevLine.includes('import') || prevLine.trim() === '') && 
          nextLine && (nextLine.includes('import') || nextLine.includes('from'))) {
        return false;
      }
    }
    return true;
  });
  
  fs.writeFileSync(filePath, lines.join('\n'));
}

// Define unused imports per file (sample - you'd expand this)
const unusedImportsMap = {
  'components/Carousel.js': ['ChevronLeft', 'ChevronRight'],
  'components/LoadingSpinner.js': ['motion'],
  'components/SEO.js': ['Head'],
  'components/PaymentIcons.js': ['Image'],
  'components/PaymentIconsDark.js': ['Image'],
  // Add more files here...
};

// Process each file
Object.entries(unusedImportsMap).forEach(([relPath, unusedImports]) => {
  const fullPath = path.join('/workspaces/ARPOZAN', relPath);
  if (fs.existsSync(fullPath)) {
    console.log(`Processing ${relPath}...`);
    removeUnusedImports(fullPath, unusedImports);
  }
});

console.log('ESLint fixes applied!');