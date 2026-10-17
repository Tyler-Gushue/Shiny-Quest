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