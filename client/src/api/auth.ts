const API_URL = import.meta.env.VITE_API_URL;

const GENERIC_ERROR_MESSAGE = 'An error has occurred in our system, please try again later.'

// Shared fetch wrapper so every auth call shows the user a readable message instead of
// browser jargon like "Failed to fetch" or a JSON parse error
async function request( path: string, options: RequestInit ) {

    let response: Response

    try {

        response = await fetch(`${API_URL}${path}`, { credentials: 'include', ...options })

    } catch {

        // Network failure or the server is down, the request never got a response
        throw new Error(GENERIC_ERROR_MESSAGE)

    }

    // Some responses (proxies, crashes) aren't JSON, don't let that surface as a parse error
    const data = await response.json().catch(() => null)

    if (!response.ok) {

        // Server errors are internal details, only show 4xx messages which are written for users
        if ( response.status >= 500 || !data?.message ) {

            throw new Error(GENERIC_ERROR_MESSAGE)

        }

        throw new Error(data.message)

    }

    return data;

}

function postJson( path: string, body: unknown, headers: Record<string, string> = {} ) {

    return request(path, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body)

    })

}

export async function loginUser( email: string, password: string ) {

    return postJson('/auth/login', { email, password })

}

export async function signUpUser( username: string, email: string, password: string, confirmPassword: string ) {

    return postJson('/auth/signup', { username, email, password, confirmPassword })

}

export async function verifyEmailCode( email: string, code: string ) {

    return postJson('/auth/verify-email', { email, code })

}

export async function verifyResetCode( email: string, code: string ) {

    return postJson('/auth/verify-reset', { email, code })

}

export async function sendEmailVerificationCode( email: string ) {

    return postJson('/auth/email-code', { email })

}

export async function sendResetVerificationCode( email: string ) {

    return postJson('/auth/reset-code', { email })

}

export async function refreshSession() {

    return request('/auth/refresh', { method: 'POST' })

}

// Tells the server to delete the refresh token and clear the cookie
export async function logoutUser() {

    return request('/auth/logout', { method: 'POST' })

}

export async function resetPassword( resetToken: string, newPassword: string, confirmPassword: string ) {

    return postJson('/auth/reset-password', { newPassword, confirmPassword }, { 'Authorization': `Bearer ${resetToken}` })

}
