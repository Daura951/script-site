const { VITE_API_BASE_URL, VITE_BASE_URL, ...otherViteConfig } = import.meta
  .env;

export const Env = {
  API_BASE_URL: VITE_API_BASE_URL as string, // base url + /api
  BASE_URL: VITE_BASE_URL as string, // base url or path for backend
  __vite__: otherViteConfig,
};

// To make it easy to figure out the frontend environment config at any moment
console.log(Env);
