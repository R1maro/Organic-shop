import { cookies } from "next/headers";
import config from "@/config/config";

export async function getServerSideAuth() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { user: null, isAuthenticated: false, isAdmin: false };
    }

    try {
        const response = await fetch(`${config.API_URL}/auth-check`, {
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
