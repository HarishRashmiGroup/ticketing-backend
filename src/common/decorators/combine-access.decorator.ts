import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { UserRole } from "src/user/entities/user.entity";
import { JwtAuthGuard } from "src/user/jwt-auth.guards";
import { COMBINE_ACCESS_KEY, CombineAccessGuard } from "./combine-access.guard";

export function CombineAccess(roles: UserRole[]) {
    return applyDecorators(
        UseGuards(JwtAuthGuard, CombineAccessGuard),
        SetMetadata(COMBINE_ACCESS_KEY, roles),
    )
}