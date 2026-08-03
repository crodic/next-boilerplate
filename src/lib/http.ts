import xior, { type XiorInterceptorRequestConfig, type XiorError } from "xior";
import { routing } from "@/i18n/routing";

// Function to get the correct Base URL dynamically depending on the environment
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") return "/api"; // Client-side relative path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`; // Vercel edge/server
  return "http://localhost:3000/api"; // Local server
};

// Create a global xior instance
export const http = xior.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
http.interceptors.request.use(
  (config: XiorInterceptorRequestConfig) => {
    // You can attach tokens or custom headers here if needed.
    // Note: Better Auth uses secure HTTP-only cookies by default,
    // so credentials will be automatically sent by the browser.
    return config;
  },
  (error: XiorError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
http.interceptors.response.use(
  (response) => {
    // Return only the data by default, or keep full response based on your preference
    return response.data;
  },
  (error: XiorError) => {
    // Handle global errors here (e.g., 401 Unauthorized -> redirect to login)
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        const parts = pathname.split("/");
        // Determine if the first URL segment is a supported locale (e.g., 'vi' or 'en')
        const currentLocale = routing.locales.includes(parts[1])
          ? `/${parts[1]}`
          : "";
        window.location.href = `${currentLocale}/auth/sign-in`;
      }
    }

    // Format error message for easy consumption
    const customError = new Error(
      error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred"
    );

    return Promise.reject(customError);
  }
);

export default http;
