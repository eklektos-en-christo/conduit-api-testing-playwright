import { test, expect } from '@playwright/test'

let authtoken

const baseURL = 'https://conduit-api.bondaracademy.com/api'
const email = `test${Date.now()}@gmail.com`
const password = `${Math.random().toString(36).substring(2, 12)}`
const username = `${Math.random().toString(36).substring(4, 12)}`

test('sign up success', async ({ request }) => {
    const signUpResponse = await request.post(`${baseURL}/users`, {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "user": {
                "email": email,
                "password": password,
                "username": username,
            }
        }
    })

    const signUpResponseJSON = await signUpResponse.json()
    authtoken = signUpResponseJSON.user.token

    await expect(signUpResponse.status()).toEqual(201)
    await expect(signUpResponseJSON.user.email).toEqual(email)
    await expect(signUpResponseJSON.user.username).toEqual(username)

    console.log(signUpResponseJSON)
    console.log(authtoken)
})