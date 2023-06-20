import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function get({ params, request, redirect }) {
    const unlistedUuid = new URL(request.url).searchParams.get('uuid')
    if (new URL(request.url).searchParams.get('password') != import.meta.env.PASSWORD_HASH) return redirect('/admin/login', 307);

    const unlistedData = await prisma.unlisted.findFirst({
        where: {
            uuid: unlistedUuid
        }
    })

    await prisma.unlisted.delete({
        where: {
            uuid: unlistedUuid
        }
    })

    const data = await prisma.photos.create({
        data: {
            tags: unlistedData.tags,
            hash: unlistedData.hash,
            source: unlistedData.source,
            date: unlistedData.date
        }
    })

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
}