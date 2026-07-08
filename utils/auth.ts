import { APIRequestContext } from '@playwright/test'

export const baseURL = 'https://conduit-api.bondaracademy.com/api'

export async function generateUser() {
    const email = `test${Date.now()}@gmail.com`
    const password = `${Math.random().toString(36).substring(2, 12)}`
    const username = `${Math.random().toString(36).substring(3, 12)}`

    return { email, password, username }
}

export async function getAuthToken(request: APIRequestContext) {
    const userObject = await generateUser()
    await request.post(`${baseURL}/users`, {
        headers: { "Content-Type": "application/json" },
        data: { user: userObject }
    })

    const loginResponse = await request.post(`${baseURL}/users/login`, {
        data: { user: userObject }
    })
    const body = await loginResponse.json()

    return { status: loginResponse.status(), responseBody: body, token: body.user.token }
}