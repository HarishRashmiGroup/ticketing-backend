import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, HttpCode, Injectable, InternalServerErrorException } from "@nestjs/common";
import { User, UserRole } from "./entities/user.entity";
import { EntityManager, EntityRepository, FilterQuery, wrap } from "@mikro-orm/postgresql";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { otpTemplate } from "../email/email.template";
import { randomInt } from "crypto";
import { EmailService } from "src/email/email.service";
import { BulkUsersDto, UserDto } from "./dto/bulkUsers.dto";

const saltRounds = 10;
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,

        private readonly jwtService: JwtService,

        private readonly emailService: EmailService,

        private readonly em: EntityManager,
    ) { }
    async getUserById(id: string) {
        const user = await this.userRepository.findOneOrFail({ id: id.replace(/[a-z]/g, c => c.toUpperCase()) });
        return ({
            id: user.id,
            name: user.name,
            role: user.role
        })
    }

    generateOtp(): number {
        const otp = randomInt(1000, 10000);
        return otp;
    }
    async sendOtp(email: string) {
        const user = await this.userRepository.findOneOrFail({ email })
        const otp = this.generateOtp();
        const hashedPassword = await bcrypt.hash(otp.toString(), saltRounds);
        wrap(user).assign({ otp: hashedPassword });
        this.emailService.sendEmail(user.email, 'Login OTP For IT Portal', otpTemplate(otp));
        await this.em.flush();
        return { message: 'otp sent successfully.', status: 200 };
    }

    async login({ email, passkey }: { email: string, passkey: string }) {
        const user = await this.userRepository.findOneOrFail({ email });

        const isPasswordValid = await bcrypt.compare(passkey, user.otp);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const payload = {
            id: user.id,
            name: user.name,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);
        wrap(user).assign({ otp: null });
        this.em.flush();
        return {
            message: 'Login successful',
            status: 200 as const,
            token,
        };
    }

    async loginWithPass({ email, passkey }: { email: string, passkey: string }) {
        //email is  Rml id in dto
        const user = await this.userRepository.findOneOrFail({ id: email.replace(/[a-z]/g, c => c.toUpperCase()) });

        const isPasswordValid = await bcrypt.compare(passkey, user.passkey);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const payload = {
            id: user.id,
            name: user.name,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);

        return {
            message: 'Login successful',
            status: 200 as const,
            token,
        };
    }

    async getBasicDetails(id: string) {
        const user = await this.userRepository.findOneOrFail({ id: id.trim().replace(/[a-z]/g, c => c.toUpperCase()) }, { populate: ['reportingTo'] });
        return ({
            id: user.id,
            name: user.name,
            role: user.role,
            contact: user.contact,
            department: user.department,
            reportingTo: user.reportingTo ? user.reportingTo.name : '',
            email: user.email
        })
    }

    async getUserInfo(id: string) {
        const user = await this.userRepository.findOneOrFail({ id: id.trim().replace(/[a-z]/g, c => c.toUpperCase()) }, { populate: ['reportingTo'] });
        return ({
            id: user.id,
            name: user.name,
            role: user.role,
            contact: user.contact,
            department: user.department,
            reportingToId: user.reportingTo ? user.reportingTo.id : '',
            reportingTo: user.reportingTo ? user.reportingTo.name : '',
            email: user.email
        })
    }

    async changePassword(id: string, password: string) {
        if (!password.toString().trim()) throw new BadRequestException("password not received.");
        const user = await this.userRepository.findOneOrFail(id.replace(/[a-z]/g, c => c.toUpperCase()));
        const hash = await bcrypt.hash(password.toString().trim(), saltRounds);
        wrap(user).assign({ passkey: hash });
        await this.em.flush();
        return ({
            message: 'Password changed successfully.',
            status: 200 as const,

        })
    }

    async resetPassword(id: string, reqUser: User) {
        const user = await this.userRepository.findOneOrFail(id.replace(/[a-z]/g, c => c.toUpperCase()));
        if (user.role === UserRole.admin && reqUser.role !== UserRole.admin) {
            throw new BadRequestException("Password can not be changed.")
        }
        const hash = await bcrypt.hash(user.id.toString().trim(), saltRounds);
        wrap(user).assign({ passkey: hash });
        await this.em.flush();
        return ({
            message: 'Password changed successfully.',
            status: 200 as const,

        })
    }

    async uploadBulkUsers(dto: UserDto[]) {
        for (const user of dto || []) {
            const hashedPasskey = await bcrypt.hash(user.passkey?.toString() || user.id.replace(/[a-z]/g, c => c.toUpperCase()).toString(), saltRounds);
            const newUser = new User({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role === UserRole.admin ? UserRole.employee : user.role,
                contact: user.contact,
                department: user.department,
                passkey: hashedPasskey,
                reportingTo: user.reportingTo ? this.em.getReference(User, user.reportingTo.replace(/[a-z]/g, c => c.toUpperCase())) : null
            });
            this.em.persist(newUser);
        }
        await this.em.flush();
        return ({
            message: 'user created successfully.',
            status: 201 as const
        });
    }

    async editUser(dto: UserDto) {
        const user = await this.userRepository.findOneOrFail({ id: dto.id.replace(/[a-z]/g, c => c.toUpperCase()) });
        wrap(user).assign({
            name: dto.name,
            email: dto.email,
            department: dto.department,
            reportingTo: dto.reportingTo ? this.em.getReference(User, dto.reportingTo.replace(/[a-z]/g, c => c.toUpperCase())) : user.reportingTo,
            contact: dto.contact,
            role: dto.role === UserRole.admin ? user.role : dto.role
        })
        await this.em.flush();
        return ({
            message: 'User data updated.',
            status: 204 as const
        })
    }

    async deleteUser(id: string) {
        const user = await this.userRepository.findOneOrFail({ id: id.replace(/[a-z]/g, c => c.toUpperCase()) });
        try {
            await this.em.removeAndFlush(user);
        } catch (error) {
            if (error.code === '23503') {
                throw new BadRequestException('User cannot be deleted because he has raised tickets.');
            }
            throw new InternalServerErrorException('An unexpected error occurred.');
        }

        return {
            message: 'User deleted successfully.',
            status: 200 as const,
        };
    }

    async getITUsers() {
        const iTUsers = await this.userRepository.find({ role: UserRole.it });
        if (iTUsers.length == 0) return [];
        return iTUsers.map((u) => ({
            id: u.id,
            label: u.name
        }));
    }

    async getUsers(searchText: string) {
        const options: FilterQuery<User> = { id: { $ne: null } };
        if (searchText?.trim()) {
            options.name = { $ilike: `%${searchText.trim()}%` };
        }
        else return [];
        const [users, userById] = await Promise.all([this.userRepository.find(options, { limit: 5, orderBy: { name: 'ASC' } }),
        this.userRepository.findOne({ id: searchText.trim().replace(/[a-z]/g, c => c.toUpperCase()) })]);
        if (userById)
            return ([{ value: userById.id, label: userById.name + "( " + userById.id + " )" }]);
        if (users.length == 0) return [];
        return users.map((u) => ({
            value: u.id,
            label: u.name + "( " + u.id + " )"
        }));
    }

}