import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtSrv: JwtService
    ) { }

    async create(user: User): Promise<User> {
        if (!user ||
            !user.email || !user.name ||
            user.email.trim() === '' || user.name.trim() === '') throw new BadRequestException('Error al intentar crear el usuario. Revisá todos los campos necesarios');
        let userFinded = await this.verifyUserEmail(user.email);
        if(userFinded !== null){
            return null;
        }

        user.password = await bcrypt.hash(user.password, 10);
        const createdUser = new this.userModel(user);
        return createdUser.save();

    }

    private async verifyUserEmail(email: string) {
        return await this.userModel.findOne({ email });
    }

    async login(user: User) {
        try {
            let { email, password } = user;
            let userFinded = await this.userModel.findOne({ email });
            let isMatch = await bcrypt.compare(password, userFinded.password)
            
            const payload = { subscribed: userFinded._id, name: userFinded.name };

            return isMatch ?
                {name: userFinded.name, access_token: await this.jwtSrv.signAsync(payload)}
                : null;
        } catch (error) {
            throw this.httpErrorHanlder(error)
        }
    }

    private httpErrorHanlder(e: any) {
        let message = ''
        let statusCode = 400;
        switch (e.code) {
            case '23505':
                message = 'El correo que proporcionaste ya se encuentra en uso';
                break;
            case '22004':
            case '12000':
                message = e.hint;
                break;
            default:
                statusCode = 409;
                message = 'Hubo un problema al intentar registrate. Intentalo más tarde nuevamente';
                break;
        }

        return { message, statusCode, data: null }
    }

}
