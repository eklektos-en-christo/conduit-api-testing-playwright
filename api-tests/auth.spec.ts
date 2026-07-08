import { test, expect, request } from '@playwright/test'
import * as auth from '../utils/auth'

test('sign up success', async ({ request }) => {
    const userObject = await auth.generateUser()

    const signUpResponse = await request.post('users', {
        headers: { "Content-Type": "application/json" },
        data: {
            "user": userObject
        }
    })

    const body = await signUpResponse.json()

    expect(signUpResponse.status()).toEqual(201)
    expect(body.user.email).toEqual(userObject.email)
    expect(body.user.username).toEqual(userObject.username)
    // console.log(signUpResponseJSON)
})

test('login success', async ({ request }) => {
    const result = await auth.getAuthToken(request)

    expect(result.status).toEqual(200)
    expect(result.responseBody.user.email).toBeTruthy()
    expect(result.responseBody.user.token).toBeTruthy()

    // console.log(result)
})