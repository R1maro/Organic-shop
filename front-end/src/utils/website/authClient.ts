/**
 * Helper functions for client-side authentication
 */

export function dispatchLoginEvent() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_status', 'logged_in');

        window.dispatchEvent(new Event('auth-state-change'));

    }
}

export function dispatchLogoutEvent() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_status');

        window.dispatchEvent(new Event('auth-state-change'));

    }
}

export async function logout() {
    try {
        const response = await fetch('/api/auth', {
            method: 'DELETE',
        });

        if (response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('auth_status');

            dispatchLogoutEvent();

            return true;
        }
        return false;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
}