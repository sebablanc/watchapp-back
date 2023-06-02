import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../service/auth.service';
import { User } from 'src/interfaces/users.interface';

@Controller('auth')
export class AuthController {

  constructor(
    private authSrv: AuthService
  ) { }

  @Post('/register')
  async register(@Body() registerUser: User, @Res() res: Response) {
    try {
      let user = await this.authSrv.create(registerUser);
      
      if(user == null){
        res.status(HttpStatus.BAD_REQUEST).send({
          success: false,
          message: 'El email ingresado ya se encuentra en uso',
          data: null
        })
      }

      res.status(HttpStatus.CREATED).send({
        success: true,
        message: 'Tu usuario ha sido creado con éxito',
        data: user
      })
    } catch (error) {
      res.status(error.statusCode || error.response.statusCode).send({
        success: false,
        message: error.message || error.response.message,
        data: []
      })
    }
  }

  @Post('/login')
  async login(@Body() registerUser: User, @Res() res: Response) {
    try {
      let user =  await this.authSrv.login(registerUser);
      
      if(user == null){
        res.status(HttpStatus.CREATED).send({
          success: false,
          message: 'El usuario o la contraseña son incorrectas',
          data: null
        })
      }

      res.status(HttpStatus.CREATED).send({
        success: true,
        message: 'Tu usuario se ha logueado',
        data: user
      })
    } catch (e) {
      res.status(e.statusCode || e.response.statusCode).send({
        success: false,
        message: e.message || e.response.message,
        data: null
      })
    }
  }
}
