import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { CreateMediaDto } from '~~/server/dtos/media/create-media.dto';
import { MediaService } from '~~/server/services/media.service';

interface FileAttr {
  extension: string;
  data: Buffer;
  name: string;
  type: string;
  size?: number;
}

export default defineEventHandler(async (event) => {
  const data = await parseRequestFormData(event);
  const config = useRuntimeConfig();

  await validationPipe(CreateMediaDto, data);

  const service = new MediaService();
  const medias = await Promise.all(
    data.media.map(async (file: FileAttr) => {
      const uniqueSuffix = randomUUID();
      const fileName = `${uniqueSuffix}.${file.extension}`;
      const filePath = `/uploads/${fileName}`;
      const fileUrl = `${config.public.APP_URL}/uploads/${fileName}`;
      await fs.writeFile(`${config.baseDir}${filePath}`, file.data);

      return await service.create({
        title: file.name,
        extension: file.extension,
        mimeType: file.type,
        size: file.size || 0,
        fileUrl,
        filePath,
      });
    }),
  );

  return medias;
});
