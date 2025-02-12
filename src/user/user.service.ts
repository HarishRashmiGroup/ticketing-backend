import { InjectRepository } from "@mikro-orm/nestjs";
import { HttpCode, Injectable } from "@nestjs/common";
import { User, UserRole } from "./entities/user.entity";
import { EntityManager, EntityRepository, wrap } from "@mikro-orm/postgresql";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { otpTemplate } from "../email/email.template";
import { randomInt } from "crypto";
import { EmailService } from "src/email/email.service";

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
        wrap(user).assign({ passkey: hashedPassword });
        this.emailService.sendEmail(user.email, 'Login OTP For IT Portal', otpTemplate(otp));
        await this.em.flush();
        return { message: 'otp sent successfully.', status: 200 };
    }

    async login({ email, passkey }: { email: string, passkey: string }) {
        const user = await this.userRepository.findOneOrFail({ email });

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

}