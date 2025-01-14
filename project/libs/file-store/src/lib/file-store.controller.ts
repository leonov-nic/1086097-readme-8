import 'multer';
import { Express } from 'express';
import { Controller, Post, Get, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/helpers';
import { StoredFileRdo } from './rdo/stored-file.rdo';
import { FileStoreService } from './file-store.service';

@Controller('files')
export class FileStoreController {
  constructor(
    private readonly fileStoreService: FileStoreService,
  ) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileEntity = await this.fileStoreService.saveFile(file);
    return fillDto(StoredFileRdo, fileEntity.toPOJO())
  }

  @Get(':fileId')
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string) {
    const existFile = await this.fileStoreService.getFile(fileId);
    return fillDto(StoredFileRdo, existFile);
  }
}
