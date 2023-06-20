import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function get({ params, request }) {
    const tags = new URL(request.url).searchParams.get('q')?.split(' ')
    if (!tags) {
        const data = await prisma.photos.findMany({
            take: 10
        })

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    const data = await prisma.photos.findMany({
        where: {
            tags: {
                hasEvery: tags.filter(function (tag) {
                    return tag != '';
                })
            }
        }
    })

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
}