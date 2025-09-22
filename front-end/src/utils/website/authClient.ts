// // utils/website/authClient.ts
// /**
//  * Helper functions for client-side authentication
//  * These work with cookie-based authentication, not localStorage
//  */
//
// /**
//  * Dispatch login event for other components to listen to
//  * This is used to trigger auth state updates across the app
//  */
// export function dispatchLoginEvent() {
//     if (typeof window !== 'undefined') {
//         // Dispatch event for components to update their auth state
//         window.dispatchEvent(new Event('user-login'));
//
//         // Optional: Also dispatch the legacy event name for compatibility
//         window.dispatchEvent(new Event('auth-state-change'));
//     }
// }
//
// /**
//  * Dispatch logout event for other components to listen to
//  */
// export function dispatchLogoutEvent() {
//     if (typeof window !== 'undefined') {
//         // Dispatch event for components to update their auth state
//         window.dispatchEvent(new Event('user-logout'));
//
//         // Optional: Also dispatch the legacy event name for compatibility
//         window.dispatchEvent(new Event('auth-state-change'));
//     }
// }
//
// /**
//  * Logout the user
//  * Calls the API to delete the auth cookie and dispatches logout event
//  */
// export async function logout() {
//     try {
//         const response = await fetch('/api/auth', {
//             method: 'DELETE',
//             credentials: 'include', // Important: include cookies
//         });
//
//         if (response.ok) {
//             // Dispatch logout event so components can update
//             dispatchLogoutEvent();
//             return true;
//         }
//
//         return false;
//     } catch (error) {
//         console.error('Logout error:', error);
//         return false;
//     }
// }
//
// /**
//  * Check if user is authenticated
//  * This should call the API which checks the httpOnly cookie
//  */
// export async function checkAuth(): Promise<{ isAuthenticated: boolean; user: any | null }> {
//     try {
//         const response = await fetch('/api/auth/check', {
//             method: 'GET',
//             credentials: 'include', // Important: include cookies
//             cache: 'no-store',
//         });
//
//         if (response.ok) {
//             const data = await response.json();
//             return {
//                 isAuthenticated: data.isAuthenticated,
//                 user: data.user,
//             };
//         }
//
//         return {
//             isAuthenticated: false,
//             user: null,
//         };
//     } catch (error) {
//         console.error('Auth check error:', error);
//         return {
//             isAuthenticated: false,
//             user: null,
//         };
//     }
// }
//
// /**
//  * Get current user
//  * Convenience method that returns just the user object
//  */
// export async function getCurrentUser() {
//     const { user } = await checkAuth();
//     return user;
// }
//
// /**
//  * Check if current user is admin
//  */
// export async function isAdmin(): Promise<boolean> {
//     const { user } = await checkAuth();
//     return user?.roles?.some((role: any) => role.slug === 'admin') || false;
// }
//
// // Updated signin/page.tsx (relevant part)
// /*
// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//
//     try {
//         const response = await fetch("/api/auth", {
//             method: "POST",
//             credentials: "include", // Add this
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//         });
//
//         const data = await response.json();
//
//         if (!response.ok) {
//             throw new Error(data.error || "Authentication failed");
//         }
//
//         // Remove localStorage usage - cookie is set by the API
//         // Just dispatch the event
//         dispatchLoginEvent();
//
//         const isAdmin = data.user?.roles?.some((role: any) => role.slug === "admin");
//
//         if (isAdmin) {
//             router.replace("/dashboard");
//         } else {
//             router.replace("/");
//         }
//     } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred during login");
//     } finally {
//         setLoading(false);
//     }
// };
// */