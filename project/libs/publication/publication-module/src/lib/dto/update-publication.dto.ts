import { ApiProperty } from '@nestjs/swagger';
import { IsString,
  MaxLength, MinLength,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidateIf,
  IsArray,
  ArrayMaxSize,
  Matches
} from 'class-validator';
import { MinLengthCheck, MaxLengthCheck } from '@project/core'
import { PublicationStatus } from '@project/core';
import { PublicationType } from '@project/core';
import { Comment } from "@project/comment-module";

export class UpdatePublicationDto {
  @ApiProperty({
    description: 'Publication ID',
    example: '12345',
  })
  @ValidateIf(o => o.publicationId != null)
  @IsString()
  @IsOptional()
  public publicationId?: string;

  @ApiProperty({
    description: 'User ID',
    example: '12345',
  })
  @ValidateIf(o => o.userId != null)
  @IsString()
  @IsMongoId()
  @IsOptional()
  public userId!: string;


  @ApiProperty({
    description: 'Video Title',
    example: 'Video Title',
  })
  @ValidateIf(o => o.titleVideo != null)
  @IsString()
  @IsNotEmpty()
  @MinLength(MinLengthCheck.Title)
  @MaxLength(MaxLengthCheck.Title)
  public titleVideo?: string;
  @ApiProperty({
    description: 'Video Link',
    example:
      'https://www.youtube.com/watch?v=2BcYD_F3QrA&list=RD2BcYD_F3QrA&start_radio=1',
  })
  @ValidateIf(o => o.video != null)
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  public video?: string;


  @ApiProperty({
    description: 'Text Title',
    example: 'Text Title',
  })
  @ValidateIf(o => o.titleText != null)
  @IsString()
  @MinLength(MinLengthCheck.Title)
  @MaxLength(MaxLengthCheck.Title)
  public titleText?: string;
  @ApiProperty({
    description: 'Announcement text',
    example: 'Время подключить базу данных.',
  })
  @ValidateIf(o => o.announcement != null)
  @IsString()
  @IsNotEmpty()
  @MinLength(MinLengthCheck.Announcement)
  @MaxLength(MaxLengthCheck.Announcement)
  public announcement?: string;
  @ApiProperty({
    description: 'Text Description',
    example: 'Пришло время подключить базу данных для первого микросервиса.',
  })
  @ValidateIf(o => o.text != null)
  @IsString()
  @IsNotEmpty()
  @MinLength(MinLengthCheck.Text)
  @MaxLength(MaxLengthCheck.Text)
  public text?: string;


  @ApiProperty({
    description: 'Quote Text',
    example: 'Сервисы, предоставляющие REST API содержат документацию в формате OpenAPI',
  })
  @ValidateIf(o => o.quote != null)
  @IsString()
  @IsNotEmpty()
  @MinLength(MinLengthCheck.Quote)
  @MaxLength(MaxLengthCheck.Quote)
  public quote?: string;
  @ApiProperty({
    description: 'Quote Author Name',
    example:
      'Игорь Антонов',
  })
  @ValidateIf(o => o.author != null)
  @IsString()
  @IsNotEmpty()
  @MinLength(MinLengthCheck.Author)
  @MaxLength(MaxLengthCheck.Author)
  public author?: string;


  @ApiProperty({
    description: 'Photo Link',
    example:
      'https://yandex.ru/images/search?text=%D0%9C%D0%BE%D1%80%D1%81%D0%BA%D0%B0%D1%8F%20%D0%A1%D0%B2%D0%B8%D0%BD%D0%BA%D0%B0&nl=1&source=morda',
  })
  @ValidateIf(o => o.photo != null)
  @IsString()
  @IsNotEmpty()
  public photo?: string;


  @ApiProperty({
    description: 'Link',
    example: 'https://htmlacademy.ru',
  })
  @ValidateIf(o => o.link != null)
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  public link?: string;
  @ApiProperty({
    description: 'Link Description',
    example: 'HTMLAcademy',
  })
  @ValidateIf(o => o.descriptionLink != null)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(MaxLengthCheck.Description)
  public descriptionLink?: string;


  @ApiProperty({
    description: 'Tags',
    example: 'Друзья',
  })
  @ValidateIf(o => o.tags != null)
  @IsArray()

  @ArrayMaxSize(8)
  @MinLength(MinLengthCheck.Tag, { each: true })
  @MaxLength(MaxLengthCheck.Tag, { each: true })
  @IsString({ each: true })
  @Matches(/^[a-zA-Zа-яА-ЯЁё].*/, { each: true })
  @IsOptional()
  public tags?: string[];

  @ApiProperty({
    description: 'Publication Status',
    example: 'Published',
  })
  public publicStatus?: keyof typeof PublicationStatus;

  @ApiProperty({
    description: 'Publication Type',
    example: 'Video',
  })
  public publicType?: keyof typeof PublicationType;


  @ApiProperty({
    description: 'Repost Public',
    example: 'false',
  })
  @ValidateIf(o => o.isRepost != null)
  @IsBoolean()
  public isRepost?: boolean;

  @ApiProperty({
    description: 'Original Author ID',
    example: '12345',
  })
  @ValidateIf(o => o.originalAuthorId != null)
  @IsBoolean()
  @IsOptional()
  public originalAuthorId?: string;

  @ApiProperty({
    description: 'Original Publication ID',
    example: '1234',
  })
  @ValidateIf(o => o.originalPublicationId != null)
  @IsBoolean()
  @IsOptional()
  public originalPublicationId?: string;

  @ApiProperty({
    description: 'Comments Count',
    example: '1',
  })
  public commentsCount?: number;

  @ApiProperty({
    description: 'Likes Count',
    example: '1',
  })
  public likesCount?: number;

  @ApiProperty({
    description: 'Comment',
    example: 'Гавно',
  })
  public comments?: Comment[];
}
