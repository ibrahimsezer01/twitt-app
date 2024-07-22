import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

// create tweet
router.post("/", async (req, res) => {
    const { content, image, userId } = req.body

    try {
        const result = await prisma.tweet.create({
            data: {
                content: content,
                image: image,
                userId: userId,
            }
        })

        res.json(result)

    } catch (error) {
        res.status(401).json("email name username should be unique")
    }
})

// get tweets
router.get("/", async (req, res) => {
    const allTweet = await prisma.tweet.findMany({
        // getting all data
        // include: { user: true }

        // or select just selected data
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            }
        }

        // select: {
        //     id: true,
        //     content: true,
        //     user: {
        //         select: {
        //             id: true,
        //             name: true,
        //             username: true,
        //             image: true
        //         }
        //     }
        // }
    })
    res.status(200).json(allTweet)
})

// get tweet by id
router.get("/:id", async (req, res) => {
    const id = req.params.id

    try {
        const tweet = await prisma.tweet.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                user: true
            }

        })

        res.status(200).json(tweet)

    } catch (error) {
        res.status(404).json({ error: `Not Found: ${id}` })
    }

})

// put tweet by id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    res.status(501).json({ error: `Not Implemented: ${id}` });
});

// delete tweet by id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.tweet.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
});


export default router;