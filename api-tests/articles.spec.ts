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

test('create, update, and delete article', async ({ request }) => {
    const result = await auth.getAuthToken(request)

    const articleCreateResponse = await request.post(`${auth.baseURL}/articles`, {
        headers: { 'content-type': 'application/json', 'Authorization': `Token ${result.token}` },
        data: {
            "article": {
                "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "description": "Description about pros and cons of Conduit API",
                "tagList": [
                    "proscons"
                ],
                "title": "Conduit API - Pros and Cons"
            }
        }
    })

    let body = await articleCreateResponse.json()

    expect(articleCreateResponse.status()).toEqual(201)
    expect(body.article.title).toEqual('Conduit API - Pros and Cons')
    expect(body.article.author.username).toEqual(result.responseBody.user.username)

    let articleSlug = body.article.slug
    console.log(articleSlug)

    const updateArticleResponse = await request.put(`${auth.baseURL}/articles/${articleSlug}`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${result.token}` },
        data: {
            "article": {
                "body": "Lorem ipsum dolor sit amet, consecter.",
                "description": "Features of v3 API",
                "slug": articleSlug,
                "tagList": [
                    "updates"
                ],
                "title": "Conduit API v3 has been released"
            }
        }
    })

    body = await updateArticleResponse.json()
    articleSlug = body.article.slug

    expect(updateArticleResponse.status()).toEqual(200)
    expect(body.article.title).toEqual('Conduit API v3 has been released')
    expect(body.article.author.username).toEqual(result.responseBody.user.username)

    console.log(body.article.slug)

    const deleteArticleResponse = await request.delete(`${auth.baseURL}/articles/${articleSlug}`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${result.token}` }
    })

    expect(deleteArticleResponse.status()).toEqual(204)

    const fetchDeletedArticle = await request.get(`${auth.baseURL}/articles/${articleSlug}`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${result.token}` }
    })

    expect(fetchDeletedArticle.status()).toEqual(404)
})