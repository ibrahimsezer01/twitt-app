import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { PrismaClient, User } from "@prisma/client"

const prisma = new PrismaClient()
const JWT_SECRET = "JWT_SUPER_SECRET_KEY"

type Authrequest = Request & { user?: User }

export async function authenticateToken(req: Authrequest, res: Response, next: NextFunction) {

    // authenditace
    const authHeader = req.headers["authorization"]
    const jwtToken = authHeader?.split(" ")[1]

    if (!jwtToken) {
        return res.sendStatus(401)
    }

    try {
        const payload = (await jwt.verify(jwtToken, JWT_SECRET) as { tokenId: number })

        if (!payload?.tokenId) {
            return res.sendStatus(401)
        }

        const dbToken = await prisma.token.findUnique({
            where: { id: payload.tokenId },
            include: { user: true }
        })

        if (!dbToken?.valid || dbToken.expiration < new Date()) {
            return res.status(401).json({ error: "API token Expired" })
        }
        
        req.user = dbToken.user

    } catch (error) {
        res.sendStatus(401)
    }

    next()
}