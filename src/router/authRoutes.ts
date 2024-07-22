import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10


// generate emailToken
function generateEmailToken(): string {
    return Math.floor(1000000 + Math.random() * 99999999).toString()
}


// create user, if it dosen't exit
// generate e emailToken and send to their email
router.post("/login", async (req, res) => {
    const { email } = req.body

    // generate token
    const emailToken = generateEmailToken()

    // create experation
    const experation = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000)

    try {
        const createdToken = await prisma.token.create({
            data: {
                type: "EMAİL",
                emailToken: emailToken,
                expiration: experation,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: { email }
                    }
                }
            }
        })

        console.log(createdToken);
        res.sendStatus(200)

    } catch (error) {
        res.status(400).json("Couldn't start the auth process")
    }
})

// validate the emailToken
// generate long/live JWT token
router.post("/authenticate", async (req, res) => {
    
})




export default router;