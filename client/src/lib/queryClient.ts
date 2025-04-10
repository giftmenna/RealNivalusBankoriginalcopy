import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Token storage helpers - duplicated from AuthContext to avoid circular dependencies
const TOKEN_STORAGE_KEY = 'nivalus_auth_token';

// Helper function to get stored token
const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (e) {
    console.error('Error reading token from localStorage:', e);
    return null;
  }
};

// Helper to get auth headers for all requests
const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {} as Record<string, string>;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Log requests in development for debugging
  if (import.meta.env.DEV) {
    console.log(`API Request: ${method} ${url}`, data ? { data } : '');
  }
  
  try {
    // Get authentication headers
    const authHeaders = getAuthHeaders();
    
    const res = await fetch(url, {
      method,
      headers: {
        ...(data ? { "Content-Type": "application/json" } : {}),
        ...authHeaders
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", // Keep for backward compatibility
      mode: "cors",
      cache: "no-cache",
    });
    
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${res.status} ${url}`, res.ok ? 'OK' : 'Error');
    }

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    // Log query requests in development
    if (import.meta.env.DEV) {
      console.log(`Query Request: GET ${url}`);
    }
    
    try {
      // Get authentication headers
      const authHeaders = getAuthHeaders();
      
      const res = await fetch(url, {
        credentials: "include", // Keep for backward compatibility
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Accept": "application/json",
          ...authHeaders
        }
      });
      
      // Log query responses in development
      if (import.meta.env.DEV) {
        console.log(`Query Response: ${res.status} ${url}`, res.ok ? 'OK' : 'Error');
      }
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.error("Auth check failed with status:", res.status);
        return null;
      }
  
      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error(`Query failed for ${url}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
