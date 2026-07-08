import { test, expect } from '@playwright/test'
import * as auth from '../utils/auth'

test('create article', async ({ request }) => {
    const result = await auth.getAuthToken(request)

    const articleCreateResponse = await request.post(`${auth.baseURL}/articles/`, {
        headers: { 'content-type': 'application/json', 'Authorization': `Token ${result.token}` },
        data: {
            "article": {
                "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "description": "This is the description of this article",
                "tagList": [
                    "version"
                ],
                "title": "Conduit API v1 has been released"
            }
        }
    })

    const body = await articleCreateResponse.json()

    expect(body.article.title).toEqual('Conduit API v1 has been released')
    expect(body.article.author.username).toEqual(result.responseBody.user.username)

    console.log(body)
    console.log(result.responseBody)
})

test('create article without authentication', async ({ request }) => {

    const articleCreateResponse = await request.post(`${auth.baseURL}/articles/`, {
        headers: { 'content-type': 'application/json' },
        data: {
            "article": {
                "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "description": "This is the description of this article",
                "tagList": [
                    "version"
                ],
                "title": "Conduit API v1 has been released"
            }
        }
    })


    expect(articleCreateResponse.status()).toEqual(401)
})

test('create article with incorrect token', async ({ request }) => {
    const articleCreateResponse = await request.post(`${auth.baseURL}/articles/`, {
        headers: { 'content-type': 'application/json', 'Authorization': `Token kjdkfdhfwrongtoken` },
        data: {
            "article": {
                "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "description": "This is the description of this article",
                "tagList": [
                    "version"
                ],
                "title": "Conduit API v1 has been released"
            }
        }
    })

    expect(articleCreateResponse.status()).toEqual(401)
})