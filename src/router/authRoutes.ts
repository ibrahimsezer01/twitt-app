import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const router = Router()
const prisma = new PrismaClient()

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10
const AUTHENTICATION_EXPIRATION_HOURS = 12


// generate emailToken
function generateEmailToken(): string {
    return Math.floor(1000000 + Math.random() * 99999999).toString()
}

// jwt token generation
function generateAuthToken(tokenId: number): string {
    const jwtPayload = { tokenId };
  
    return jwt.sign(jwtPayload, "JWT_SUPER_SECRET_KEY", {
      algorithm: 'HS256',
      noTimestamp: true,
    });
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
    const { email, emailToken } = req.body

    const dbEmailToken = await prisma.token.findUnique({
        where: {
            emailToken,
        },
        include: {
            user: true
        }
    })

    console.log(dbEmailToken);

    if (!dbEmailToken || !dbEmailToken.valid) {
        return res.sendStatus(401);
    }

    if (dbEmailToken.expiration < new Date()) {
        return res.status(401).json({ error: "Token Expired!" })
    }

    if (dbEmailToken?.user?.email != email) {
        return res.status(401).json({ error : "Not Your Token!" })
    }   

    
    // create experation
    const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000)

    const apiToken = await prisma.token.create({
        data: {
          type: 'API',
          expiration,
          user: {
            connect: {
              email,
            },
          },
        },
      });
    
      // Invalidate the email
      await prisma.token.update({
        where: { id: dbEmailToken.id },
        data: { valid: false },
      });


    // generate the jwt token
    const authToken = generateAuthToken(apiToken.id)
    

    
    console.log(authToken);
    res.json({ authToken })
})




export default router;