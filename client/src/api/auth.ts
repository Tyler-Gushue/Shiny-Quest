const API_URL = import.meta.env.VITE_API_URL;  

export async function loginUser( email: string, password: string ) {

    const response = await fetch(`${API_URL}/auth/login`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })

    })

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message)

    }

    return data;

}

export async function signUpUser( username: string, email: string, password: string, confirmPassword: string ) {

    const response = await fetch(`${API_URL}/auth/signup`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, confirmPassword })

    })

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message)

    }

    return data;

}

export async function verifyEmailCode( email: string, code: string ) {

    const response = await fetch(`${API_URL}/auth/verify-email`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, code })

    })

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message)

    }

    return data;

}

export async function sendEmailVerificationCode( email: string ) {

    const response = await fetch(`${API_URL}/auth/email-code`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email })

    })

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message)

    }

    return data;

}

export async function refreshSession() {

    const response = await fetch(`${API_URL}/auth/refresh`, {

        method: 'POST',
        credentials: 'include'

    })

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message)

    }

    return data;

}

// Tells the server to delete the refresh token and clear the cookie
export async function logoutUser() {

    const response = await fetch(`${API_URL}/auth/logout`, {

        method: 'POST',
        credentials: 'include'

    })

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message)

    }

    return data;

}
