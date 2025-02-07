import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserRole } from "./entities/user.entity";
import { Auth } from "../common/decorators/auth.decorator";
import { NewUserDto } from "./dto/newUser.dto";
import { UserService } from "./user.service";
import { EmailDto, LoginDto } from "./dto/login.dto";
import { User } from "src/common/decorators/user.decorator";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('send-otp')
    sendOtp(@Body() dto: EmailDto) {
        return this.userService.sendOtp(dto.email);
    }

    @Post('verify-otp')
    loginUser(@Body() dto: LoginDto) {
        return this.userService.login(dto);
    }

    @Auth()
    @Get('basic')
    getBasicDetails(@User() id: string) {
        return this.userService.getBasicDetails(id);
    }
}