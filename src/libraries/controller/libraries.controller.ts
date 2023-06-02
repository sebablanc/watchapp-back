import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Video } from 'src/entities/video.entity';
import { parseLibrary, parseVideo } from '../utils';
import { LibraryService } from '../service/library.service';

@UseGuards(AuthGuard)
@Controller('library')
export class LibrariesController {

    constructor(
        private librarySrv: LibraryService,
        private jwtSrv: JwtService
    ) { }

    @Get('/get-libraries')
    async getUserLibraries(@Req() req: Request, @Res() res: Response) {
        try {
            let authDecoded = this.jwtSrv.decode(req.headers.authorization.split(' ')[1]);

            let result = await this.librarySrv.getUserLibraries(authDecoded['subscribed']);
            res.status(HttpStatus.OK).send({
                success: true,
                message: 'Bibliotecas encontradas',
                data: result
            })
        } catch (error) {
            res.status(error.statusCode || error.response.statusCode).send({
                success: false,
                message: error.message || error.response.message,
                data: []
            })
        }
    }

    @Post('/mark-video')
    async addToLibrary(@Body() body: { name: string, video: Video }, @Req() req: Request, @Res() res: Response) {
        try {
            let authDecoded = this.jwtSrv.decode(req.headers.authorization.split(' ')[1]);
            let libraryParsed = parseLibrary(authDecoded['subscribed'], body.name, body.video);

            let result = await this.librarySrv.addVideoToLibrary(libraryParsed);
            res.status(HttpStatus.OK).send({
                success: result !== null && result !== undefined,
                message: result ? 'Tu video se ha añadido a la biblioteca correctamente' : 'El video ya se encontraba en tu biblioteca',
                data: result
            })
        } catch (error) {
            console.log(error);
            res.status(error.statusCode || error.response.statusCode).send({
                success: false,
                message: error.message || error.response.message,
                data: []
            })
        }
    }

    @Post('/unmark-video')
    async deleteFromLibrary(@Body() body: { name: string, video: Video }, @Req() req: Request, @Res() res: Response) {
        try {
            let authDecoded = this.jwtSrv.decode(req.headers.authorization.split(' ')[1]);
            let libraryParsed = parseLibrary(authDecoded['subscribed'], body.name, body.video);

            let result = await this.librarySrv.deleteFromLibrary(libraryParsed);
            res.status(HttpStatus.OK).send({
                success: result !== null && result !== undefined,
                message: result ? 'El video se eliminó de la biblioteca' : 'El video no se encontraba en tu biblioteca',
                data: result
            })
        } catch (error) {
            console.log(error);
            res.status(error.statusCode || error.response.statusCode).send({
                success: false,
                message: error.message || error.response.message,
                data: []
            })
        }
    }
}
