import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPipe } from "../../user.pipe";

export const User = createParamDecorator((_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.id;
});
export const GetUserFromToken = () => User(UserPipe);