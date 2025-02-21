import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, HttpCode, Injectable } from "@nestjs/common";
import { User, UserRole } from "./entities/user.entity";
import { EntityManager, EntityRepository, wrap } from "@mikro-orm/postgresql";
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
        const user = await this.userRepository.findOneOrFail({ id });
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
        const user = await this.userRepository.findOneOrFail({ id: email });

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
        const user = await this.userRepository.findOneOrFail({ id }, { populate: ['reportingTo'] });
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
        const user = await this.userRepository.findOneOrFail({ id }, { populate: ['reportingTo'] });
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

    async changePassword(id: string, password: string) {
        if (!password.toString().trim()) throw new BadRequestException("password not received.");
        const user = await this.userRepository.findOneOrFail(id);
        const hash = await bcrypt.hash(password.toString().trim(), saltRounds);
        wrap(user).assign({ passkey: hash });
        await this.em.flush();
        return ({
            message: 'Password changed successfully.',
            status: 200 as const,

        })
    }

    async resetPassword(id: string) {
        const user = await this.userRepository.findOneOrFail(id);
        if (user.role != UserRole.employee) {
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
        const users = dto?.map(async (user) => new User({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            contact: user.contact,
            department: user.department,
            passkey: user.passkey ? await bcrypt.hash(user.passkey.toString(), saltRounds) : null,
            reportingTo: user.reportingTo ? this.em.getReference(User, user.reportingTo) : null
        }));
        await this.em.persistAndFlush(users);
        return ({
            message: 'user created successfully.',
            status: 201 as const
        });
    }

}