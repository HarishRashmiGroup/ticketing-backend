import { applyDecorators, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../user/jwt-auth.guards"

export function Auth() {
    return applyDecorators(
        UseGuards(
            JwtAuthGuard
        )
    )
}