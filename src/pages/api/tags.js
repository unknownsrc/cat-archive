import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const types = ['gif', 'photo', 'edit']
const cats = ['komaru', 'komugi', 'cocoa', 'gomu']

export async function get({ params, request }) {
    const photos = await prisma.photos.findMany()
    const uniqueTags = [...new Set(photos.flatMap((photo) => photo.tags))].filter(item => !types.includes(item) && !cats.includes(item));

    return new Response(JSON.stringify({
        types: types,
        cats: cats,
        tags: uniqueTags
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
}