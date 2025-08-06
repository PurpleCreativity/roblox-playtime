# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Build the extension
Write-Host "Building extension..."
npm run build

# Package the XPI
Write-Host "Packaging..."
npm run build:xpi
