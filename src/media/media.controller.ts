import {
    Controller,
    Post,
    Get,
    Param,
    Res,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { MediaService } from "./media.service";

@Controller("media")
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.mediaService.uploadFile(file);
    }

    @Get("download/:id")
    async downloadFile(@Param("id") id: number, @Res() res: Response) {
        const file = await this.mediaService.getFile(id);

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        res.setHeader("Content-Type", file.mimeType);
        res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);


        res.send(file.data);
    }
}