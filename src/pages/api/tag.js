import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function post({ params, request }) {
    const formData = await request.formData()
    const confirm = await (await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        body: new URLSearchParams({
            'response': await formData.get('h-captcha-response'),
            'secret': import.meta.env.CAPTCHA_SECRET
        })
    })).json()

    if (!confirm.success) {
        return new Response('You lil goober messed with the captcha...', {
            status: 418
        })
    }

    await prisma.unlisted.updateMany({
        where: {
            uuid: await formData.get('uuid')
        },
        data: {
            tags: (await formData.get('tags')).split(','),
            adminRequired: true
        }
    })

    return new Response('Success! Redirecting back... <script>setTimeout(async () => window.location.href = window.location.origin + "/tag", 1000)</script>', {
        status: 200,
        headers: {
            "Content-Type": "text/html"
        }
    })
}