import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

// create user
router.post("/", async (req, res) => {
    const { email, name, username } = req.body

    try {
        const result = await prisma.user.create({
            data: {
                email: email,
                name: name,
                username: username,
                bio: "Hello I'm Ibrahim"
            }
        })

        res.json(result)

    } catch (error) {
        res.status(401).json("email name username should be unique")
    }
})

// get users
router.get("/", async (req, res) => {
    const allUser = await prisma.user.findMany({
        // select: {
        //     id: true,
        //     name: true,
        //     iamge: true,
        //     bio: true
        // }
    });
    res.json(allUser)
})

// get user by id
router.get("/:id", async (req, res) => {
    const { id } = req.params
    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: { tweet: true }
    })

    res.json(user)
})

// put user by id
router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { bio, name, image } = req.body

    try {
        const result = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                bio: bio,
                name: name,
                image: image
            }
        })

        res.status(201).json(result)

    } catch (error) {
        res.status(400).json({ error: "Failed Updated" })
    }
})

// delete user by id
router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {
        await prisma.user.delete({
            where: { id: Number(id) }
        })

        res.status(200).json("Succesfuly Deleted")

    } catch (error) {
        res.status(400).json({ error: "User Not Found or Not Deleting" })
    }
})


export default router;