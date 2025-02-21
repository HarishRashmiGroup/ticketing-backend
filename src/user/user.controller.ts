import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { UserRole } from "./entities/user.entity";
import { Auth } from "../common/decorators/auth.decorator";
import { NewUserDto } from "./dto/newUser.dto";
import { UserService } from "./user.service";
import { EmailDto, LoginDto, PasswordDto, ResetPassword } from "./dto/login.dto";
import { User } from "src/common/decorators/user.decorator";
import { CombineAccess } from "src/common/decorators/combine-access.decorator";
import { BulkUsersDto } from "./dto/bulkUsers.dto";

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

    @Post('verify-pass')
    loginUserWithPass(@Body() dto: PasswordDto) {
        return this.userService.loginWithPass(dto);
    }

    @Auth()
    @Get('basic')
    getBasicDetails(@User() id: string) {
        return this.userService.getBasicDetails(id);
    }

    @Auth()
    @Post('change-password')
    changePassword(@User() id: string, @Body() dto: { password: string }) {
        return this.userService.changePassword(id, dto.password);
    }

    @CombineAccess([UserRole.it, UserRole.admin])
    @Post('reset-password')
    resetPassword(@Body() dto: ResetPassword) {
        return this.userService.resetPassword(dto.id);
    }

    @CombineAccess([UserRole.admin, UserRole.it])
    @Get('info')
    getUserInfo(@Query('id') id: string) {
        return this.userService.getUserInfo(id);
    }

    @CombineAccess([UserRole.admin, UserRole.it])
    @Post('bulk-user')
    uploadBulkUsers(@Body() dto: BulkUsersDto) {
        return this.userService.uploadBulkUsers(dto.data);
    }
}