import { test, expect, request } from '@playwright/test'

let authToken: string
let articleSlug: string

const baseURL = 'https://conduit-api.bondaracademy.com/api'
const email = `test${Date.now()}@gmail.com`
const password = `${Math.random().toString(36).substring(2, 12)}`
const username = `${Math.random().toString(36).substring(3, 12)}`

test.describe.serial('auth flow', () => {
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
        authToken = signUpResponseJSON.user.token

        expect(signUpResponse.status()).toEqual(201)
        expect(signUpResponseJSON.user.email).toEqual(email)
        expect(signUpResponseJSON.user.username).toEqual(username)

        // console.log(signUpResponseJSON)
        // console.log(authtoken)
    })

    test('login success', async ({ request }) => {
        const loginResponse = await request.post(`${baseURL}/users/login`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            },
            data: {
                "user": {
                    "email": email,
                    "password": password
                }
            }
        })

        const loginResponseJSON = await loginResponse.json()
        authToken = loginResponseJSON.user.token


        expect(loginResponse.status()).toEqual(200)
        expect(loginResponseJSON.user.email).toEqual(email)
        expect(loginResponseJSON.user.username).toEqual(username)

        // console.log(loginResponseJSON)
        // console.log(authtoken)
    })

    test('create article', async ({ request }) => {
        const articleCreateResponse = await request.post(`${baseURL}/articles/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            },
            data: {
                "article": {
                    "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    "description": "This is the description of this article",
                    "tagList": [
                        "api"
                    ],
                    "title": "Conduit API v2 has been released"
                }
            }
        })

        const articleCreateResponseJSON = await articleCreateResponse.json()
        articleSlug = await articleCreateResponseJSON.article.slug

        expect(articleCreateResponse.status()).toEqual(201)
        expect(articleCreateResponseJSON.article.title).toEqual('Conduit API v2 has been released')
        expect(articleCreateResponseJSON.article.tagList[0]).toEqual('api'.toUpperCase())

        // console.log(articleCreateResponseJSON)
        // console.log(articleSlug)
    })

    test('get article', async ({ request }) => {
        const articleFetchResponse = await request.get(`${baseURL}/articles/${articleSlug}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            }
        })

        const articleFetchResponseJSON = await articleFetchResponse.json()
        expect(articleFetchResponse.status()).toEqual(200)
        expect(articleFetchResponseJSON.article.title).toEqual("Conduit API v2 has been released")

        // console.log(articleFetchResponseJSON)
    })

    test('update article', async ({ request }) => {
        const updateArticleResponse = await request.put(`${baseURL}/articles/${articleSlug}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            },
            data: {
                "article": {
                    "body": "This is the body of this article v2",
                    "description": "something else v2",
                    "slug": articleSlug,
                    "tagList": [
                        "updates"
                    ],
                    "title": "Conduit API v3 has been released"
                }
            }
        })

        const updateArticleResponseJSON = await updateArticleResponse.json()
        articleSlug = updateArticleResponseJSON.article.slug

        expect(updateArticleResponse.status()).toEqual(200)
        expect(updateArticleResponseJSON.article.title).toEqual("Conduit API v3 has been released")

        // console.log(updateArticleResponseJSON)
    })

    test('delete article', async ({ request }) => {
        const deleteArticleResponse = await request.delete(`${baseURL}/articles/${articleSlug}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            }
        })

        expect(deleteArticleResponse.status()).toEqual(204)
    })
})