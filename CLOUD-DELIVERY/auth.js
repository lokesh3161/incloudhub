const AUTH_USER_KEY = 'incloudhub_user';
const AUTH_EXP_KEY = 'incloudhub_expiry';
const AUTH_TIMEOUT_MS = 30 * 60 * 1000;

function setAuthSession(user) {
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    sessionStorage.setItem(AUTH_EXP_KEY, String(Date.now() + AUTH_TIMEOUT_MS));
    sessionStorage.setItem('user', JSON.stringify(user));
}

function getAuthSession() {
    const rawUser = sessionStorage.getItem(AUTH_USER_KEY);
    const rawExpiry = sessionStorage.getItem(AUTH_EXP_KEY);
    if (!rawUser || !rawExpiry) {
        clearAuthSession();
        return null;
    }

    const expiry = Number(rawExpiry);
    if (Number.isNaN(expiry) || Date.now() > expiry) {
        clearAuthSession();
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch (error) {
        clearAuthSession();
        return null;
    }
}

function clearAuthSession() {
    sessionStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_EXP_KEY);
    sessionStorage.removeItem('user');
}

function watchAuthExpiry() {
    const rawExpiry = sessionStorage.getItem(AUTH_EXP_KEY);
    const expiry = Number(rawExpiry);
    if (!rawExpiry || Number.isNaN(expiry)) {
        return;
    }
    const delay = expiry - Date.now();
    if (delay <= 0) {
        clearAuthSession();
        window.location.href = 'login.html';
        return;
    }
    setTimeout(() => {
        clearAuthSession();
        window.location.href = 'login.html';
    }, delay);
}

function requireAuth() {
    if (!getAuthSession()) {
        window.location.href = 'login.html';
        return false;
    }
    watchAuthExpiry();
    return true;
}

function redirectIfAuthenticated() {
    if (getAuthSession()) {
        window.location.href = 'home.html';
        return true;
    }
    return false;
}
