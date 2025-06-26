# CI/CD Pipeline Documentation

This project uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD).

## Workflows

### 1. Main CI/CD Pipeline (`ci-cd.yml`)

This comprehensive workflow includes:

- **Testing**: Runs on multiple Node.js versions (18.x, 20.x)
- **Building**: Creates production build artifacts
- **Security Scanning**: Runs npm audit and Snyk security scans
- **Deployment**: Deploys to staging (develop branch) and production (main branch)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` branch

### 2. Test Suite (`test.yml`)

A focused workflow for running tests:

- Linting with ESLint
- TypeScript type checking
- Jest test execution with coverage
- Test result artifacts upload

**Triggers:**
- Push to `main`, `develop`, or `feature/*` branches
- Pull requests to `main` or `develop` branches

## Coverage Requirements

The project maintains the following coverage thresholds:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Dependencies

### Dependabot Configuration

Dependabot is configured to:
- Update npm dependencies weekly for both root and client directories
- Update GitHub Actions weekly
- Create pull requests with proper commit messages

## Local Development

To run the same checks locally:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm ci

# Run linting
npm run lint

# Run TypeScript check
npx tsc --noEmit

# Run tests with coverage
npm test -- --coverage --watchAll=false
```

## Deployment

### Staging Environment
- Automatically deploys when code is pushed to `develop` branch
- Uses GitHub Environment protection rules

### Production Environment
- Automatically deploys when code is pushed to `main` branch
- Uses GitHub Environment protection rules
- Requires manual approval (configurable)

## Security

The pipeline includes:
- npm audit for known vulnerabilities
- Snyk security scanning (requires `SNYK_TOKEN` secret)

## Setup Requirements

### GitHub Secrets

To fully utilize the CI/CD pipeline, configure these secrets in your GitHub repository:

1. `SNYK_TOKEN` - For Snyk security scanning (optional)
2. Add deployment-specific secrets as needed for your hosting platform

### GitHub Environments

Create these environments in your GitHub repository settings:
- `staging` - for develop branch deployments
- `production` - for main branch deployments

You can add protection rules, required reviewers, and deployment restrictions to these environments.

## Test Results

Test results and coverage reports are automatically uploaded as artifacts after each workflow run. You can download them from the Actions tab in your GitHub repository.

## Customization

To customize the deployment steps:
1. Edit the `deploy-staging` and `deploy-production` jobs in `ci-cd.yml`
2. Add your specific deployment commands
3. Configure any necessary secrets for your hosting platform

Example deployment platforms:
- **Netlify**: Use `netlify-cli` commands
- **Vercel**: Use `vercel` CLI commands
- **AWS S3**: Use AWS CLI or GitHub Actions AWS modules
- **Traditional hosting**: Use SSH/FTP commands
