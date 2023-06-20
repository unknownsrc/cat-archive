import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function get({ params, request, redirect }) {
    const unlistedUuid = new URL(request.url).searchParams.get('uuid')
    if (new URL(request.url).searchParams.get('password') != import.meta.env.PASSWORD_HASH) return redirect('/admin/login', 307);

    const data = await prisma.unlisted.updateMany({
        where: {
            uuid: unlistedUuid
        },
        data: {
            tags: ["untagged"],
            adminRequired: false
        }
    })

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
}