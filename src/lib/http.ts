import "client-only";
import xior from "xior";

import { toast } from "sonner";

export const http = xior.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "",
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  // Better Auth handles sessions automatically via HTTP-only cookies on the web.
  // withCredentials: true ensures cookies are sent with every request.
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        // Avoid infinite redirect loops if already on an auth page
        if (!currentPath.includes("/auth/")) {
          toast.error("Your session has expired. Please log in again.");

          const callbackURL = encodeURIComponent(window.location.href);
          window.location.href = `/auth/sign-in?callbackURL=${callbackURL}`;
        }
      }
    }
    return Promise.reject(error);
  }
);
