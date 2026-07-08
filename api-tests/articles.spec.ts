import { test, expect } from '@playwright/test'
import * as auth from '../utils/auth'

test('create and get article', async ({ request }) => {
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

    let body = await articleCreateResponse.json()
    const artilceSlug = body.article.slug

    expect(body.article.title).toEqual('Conduit API v1 has been released')
    expect(body.article.author.username).toEqual(result.responseBody.user.username)

    // console.log(body)
    // console.log(result.responseBody)

    const getArticleResponse = await request.get(`${auth.baseURL}/articles/${artilceSlug}`, {
        headers: { 'content-type': 'application/json', 'Authorization': `Token ${result.token}` }
    })

    body = await getArticleResponse.json()

    expect(getArticleResponse.status()).toEqual(200)
    expect(body.article.title).toEqual('Conduit API v1 has been released')
    expect(body.article.author.username).toEqual(result.responseBody.user.username)

    // console.log(body)
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