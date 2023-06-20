import crypto from 'node:crypto'
import { fileTypeFromBuffer } from 'file-type'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function post({ params, request }) {
    const formData = await request.formData()

    if (await formData.get('secret') != import.meta.env.PASSWORD_HASH) {
        const confirm = await (await fetch('https://hcaptcha.com/siteverify', {
            method: 'POST',
            body: new URLSearchParams({
                'response': await formData.get('h-captcha-response'),
                'secret': import.meta.env.CAPTCHA_SECRET,
            })
        })).json()
    
        if (!confirm.success) {
            return new Response('You lil goober messed with the captcha...', {
                status: 418
            })
        }
    }

    const file = await formData.get('file')
    const fileHash = crypto.createHash('sha256').update(Array.from(new Int8Array(await file.arrayBuffer()).values()).toString()).digest('hex')
    const alreadyPhotos = await prisma.photos.findFirst({
        where: {
            hash: fileHash
        }
    }) 
    const alreadyUnlisted = await prisma.unlisted.findFirst({
        where: {
            hash: fileHash
        }
    })

    if (alreadyPhotos || alreadyUnlisted) return new Response('That file has already been uploaded...', {
        status: 409
    })

    const fileType = await fileTypeFromBuffer(await file.arrayBuffer())
    const form = new FormData()
    form.append('files[]', file, `unknowndotsbs-cat.${fileType.ext}`)

    const upload = await fetch('https://pomf.lain.la/upload.php', {
        method: 'POST',
        body: form
    })
    const fileUrl = (await upload.json()).files[0].url

    const record = await prisma.unlisted.create({
        data: {
            tags: (await formData.get('tags')).split(','),
            hash: fileHash,
            source: fileUrl
        }
    })

    return new Response(JSON.stringify(record), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
}