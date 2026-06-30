# Opportune Frontend

A modern frontend application for the Opportune platform built with cutting-edge web technologies.

## Overview

Opportune Frontend is a responsive web application that provides a user-friendly interface for the Opportune platform. It's built with modern JavaScript/TypeScript frameworks and is designed to work seamlessly with the OpportuneBackend API.

## Tech Stack

- **Language**: JavaScript / TypeScript
- **Package Manager**: npm or yarn
- **Build Tool**: Webpack, Vite, or similar
- **Testing**: Jest or Vitest
- **Version Control**: Git

## Project Structure

```
Opportune-Frontend/
├── src/                          # Source code directory
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Page components
│   ├── services/                # API services and utilities
│   ├── styles/                  # Global styles
│   ├── assets/                  # Images, fonts, static files
│   ├── App.tsx/App.jsx          # Main app component
│   └── index.tsx/index.js       # Entry point
├── public/                       # Static files
├── dist/                         # Build output (generated)
├── node_modules/                 # Dependencies (generated)
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration (if using TS)
├── webpack.config.js            # Webpack configuration (if using Webpack)
├── vite.config.js               # Vite configuration (if using Vite)
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher (or yarn v1.22.0+)
- **Git**: For version control

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MalakWaleed00/Opportune-Frontend.git
cd Opportune-Frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=10000

# Feature Flags
REACT_APP_DEBUG_MODE=false
```

### 4. Start Development Server

Using npm:
```bash
npm run dev
```

Or using yarn:
```bash
yarn dev
```

The application will start on `http://localhost:3000` by default.

### 5. Build for Production

Using npm:
```bash
npm run build
```

Or using yarn:
```bash
yarn build
```

This creates an optimized production build in the `dist/` directory.

## Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
npm run start        # Start development server
```

### Building
```bash
npm run build        # Build for production
npm run build:prod   # Build with production optimizations
```

### Testing
```bash
npm run test         # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

### Preview
```bash
npm run preview      # Preview production build locally
```

## Project Features

✅ **Responsive Design** - Works on desktop, tablet, and mobile devices  
✅ **Modern UI** - Clean and intuitive user interface  
✅ **API Integration** - Seamless integration with OpportuneBackend  
✅ **State Management** - Efficient state handling  
✅ **Error Handling** - Comprehensive error management and user feedback  
✅ **Authentication** - Secure user authentication  
✅ **Type Safety** - Full TypeScript support  
✅ **Testing** - Comprehensive test coverage  

## API Integration

The frontend communicates with the OpportuneBackend API. Make sure the backend is running before starting the frontend development server.

### Backend URL Configuration

Update the `REACT_APP_API_URL` in your `.env` file to point to your backend:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

### API Documentation

Access the backend API documentation at:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `http://localhost:8080/v3/api-docs`

## Development Guidelines

### Component Structure

```typescript
// components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};
```

### Service Layer

```typescript
// services/api.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
});

export const fetchData = async (endpoint: string) => {
  const response = await apiClient.get(endpoint);
  return response.data;
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting and lazy loading
- Asset minification and compression
- Tree shaking for unused code removal
- Image optimization
- Caching strategies

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:
```bash
docker build -t opportune-frontend .
docker run -p 3000:3000 opportune-frontend
```

## Testing

### Run Tests

```bash
npm run test
```

### Test Coverage

```bash
npm run test:coverage
```

### Example Test

```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders button with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# On macOS/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear build cache
rm -rf dist/

# Rebuild
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style

This project follows ESLint and Prettier configurations. Run before committing:

```bash
npm run lint
npm run format
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API endpoint | `http://localhost:8080/api` |
| `REACT_APP_API_TIMEOUT` | API request timeout in ms | `10000` |
| `REACT_APP_DEBUG_MODE` | Enable debug logging | `false` |

## Performance Tips

- Use React DevTools Profiler to identify bottlenecks
- Implement code splitting for large routes
- Optimize images and lazy load assets
- Use memoization for expensive computations
- Monitor bundle size with `npm run build`

## Security Best Practices

- Never commit sensitive data (.env secrets)
- Use HTTPS in production
- Validate and sanitize user inputs
- Implement proper authentication tokens
- Use Content Security Policy (CSP)
- Keep dependencies updated

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Webpack Documentation](https://webpack.js.org)
- [ESLint Guide](https://eslint.org/docs/user-guide/)
- [Prettier Documentation](https://prettier.io/docs/)

## Support

For issues, questions, or suggestions, please create an issue in the GitHub repository.

## License

This project is part of the Opportune initiative.

---

**Last Updated**: June 2026  
**Repository**: [MalakWaleed00/Opportune-Frontend](https://github.com/MalakWaleed00/Opportune-Frontend)
