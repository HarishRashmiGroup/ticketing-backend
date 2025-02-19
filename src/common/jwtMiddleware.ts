import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { jwtConstants } from "../user/constant";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];
        try {
            if (token) {
                const decoded: string | jwt.JwtPayload = jwt.verify(token, jwtConstants.secret);
                req.headers.id = typeof decoded === 'string'  ? decoded : decoded.id;
            }
            next();
        } catch (err) {
            next();
        }
    }
}