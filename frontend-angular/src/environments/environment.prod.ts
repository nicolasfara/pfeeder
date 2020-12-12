// environment.prod.ts environment variables
export const environment = {
  production: true,
  apiBaseUrl: 'API_BASE_URL',
};

// To run with docker run:
// docker run -p 3000:3000 -e API_BASE_URL=http://myawesomebackend.com/api front
