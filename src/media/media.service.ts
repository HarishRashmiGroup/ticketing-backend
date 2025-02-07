import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Media } from "./entities/media.entity";
import { EntityRepository } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";

@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(Media)
        private readonly mediaRepository: EntityRepository<Media>,

        private readonly em: EntityManager
    ) { }

    async uploadFile(file: Express.Multer.File) {
        const newMedia = new Media({ name: file.originalname, mimeType: file.mimetype, data: file.buffer });

        await this.em.persistAndFlush(newMedia);
        return { id: newMedia.id, name: newMedia.name };
    }

    async getFile(mediaId: number) {
        const media = await this.mediaRepository.findOneOrFail({
            id: mediaId
        })
        return {
            id: media.id,
            name: media.name,
            mimeType: media.mimeType,
            data: media.data,
        };
    }
}
