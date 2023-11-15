import { diskStorage } from 'multer';
import { extname } from 'path';

import { config } from '@/config';

export const multerOptions = {
  limits: {
    fileSize: config.app.maxFileSize,
  },

  storage: diskStorage({
    destination: config.app.uploadsPath,
    filename: (req: any, file: Express.Multer.File, callback: any) => {
      const name = file.originalname.split('.')[0];
      const randomStr = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');

      callback(null, `${name}-${randomStr}${extname(file.originalname)}`);
    },
  }),
};
