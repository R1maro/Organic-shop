export function dispatchLoginEvent() {
    window.dispatchEvent(new Event('auth-state-change'));
}


export function dispatchLogoutEvent() {
    window.dispatchEvent(new Event('auth-state-change'));
}