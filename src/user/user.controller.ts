import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { User as UserEntity, UserRole } from "./entities/user.entity";
import { Auth } from "../common/decorators/auth.decorator";
import { UserService } from "./user.service";
import { EmailDto, LoginDto, PasswordDto, ResetPassword } from "./dto/login.dto";
import { GetUserFromToken, User } from "src/common/decorators/user.decorator";
import { CombineAccess } from "src/common/decorators/combine-access.decorator";
import { BulkUsersDto, UserDto } from "./dto/bulkUsers.dto";
import { PageDto } from "src/ticketing/dto/createTicket.dto";

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
    resetPassword(@Body() dto: ResetPassword, @GetUserFromToken() user: UserEntity) {
        return this.userService.resetPassword(dto.id, user);
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

    @CombineAccess([UserRole.admin, UserRole.it])
    @Put('edit-user')
    editUser(@Body() dto: UserDto) {
        return this.userService.editUser(dto);
    }

    @CombineAccess([UserRole.admin, UserRole.it])
    @Delete('edit-user/:id')
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @CombineAccess([UserRole.admin, UserRole.it])
    @Get('/it-users')
    getITPersons() {
        return this.userService.getITUsers();
    }

    @CombineAccess([UserRole.admin, UserRole.it])
    @Get('/users')
    getUsers(@Query('searchText') searchText: string) {
        return this.userService.getUsers(searchText);
    }

    @CombineAccess([UserRole.admin, UserRole.it])
    @Get('/super-admin/users')
    getPaginatedUsers(@Query() dto: PageDto) {
        return this.userService.getPaginatedUsers(dto);
    }
}