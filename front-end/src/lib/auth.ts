import { cookies } from "next/headers";

export async function getServerSideAuth() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { user: null, isAuthenticated: false, isAdmin: false };
    }

    try {
        const response = await fetch("http://localhost:8000/api/auth-check", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            cache: "no-store",
        });

        const data = await response.json();

        if (data.authenticated) {
            const isAdmin = data.user.roles.some((role: any) => role.slug === "admin");

            return {
                user: data.user,
                isAuthenticated: true,
                isAdmin,
            };
        }

        return { user: null, isAuthenticated: false, isAdmin: false };
    } catch (error) {
        return { user: null, isAuthenticated: false, isAdmin: false };
    }
}
