import { ApiProperty } from '@nestjs/swagger';
import { IsString,
  MaxLength, MinLength,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsNumber,
  IsEnum,
  ValidateIf,
  IsArray,
  ArrayMaxSize,
  Matches
} from 'class-validator';
import { MinLengthCheck, MaxLengthCheck } from '@project/core'
import { PublicationStatus } from '@project/core';
import { PublicationType } from '@project/core';

export class CreatePublicationDto {
  @ApiProperty({
    description: 'User ID',
    example: '12345',
  })
  @IsString()
  @IsMongoId()
  public userId!: string;

  @ApiProperty({
    description: 'Video Title',
    example: 'Video Title',
  })
  @ValidateIf(o => o.publicType === "Video")
  @IsString()
  @MinLength(MinLengthCheck.Title)
  @MaxLength(MaxLengthCheck.Title)
  @IsOptional()
  @IsNotEmpty()
  public titleVideo?: string;
  @ApiProperty({
    description: 'Video Link',
    example:
      'https://www.youtube.com/watch?v=2BcYD_F3QrA&list=RD2BcYD_F3QrA&start_radio=1',
  })
  @ValidateIf(o => o.publicType === "Video")
  @IsString()
  @IsUrl()
  public video?: string;

  @ApiProperty({
    description: 'Text Title',
    example: 'Text Title',
  })
  @ValidateIf(o => o.publicType === "Text")
  @IsString()
  @MinLength(MinLengthCheck.Title)
  @MaxLength(MaxLengthCheck.Title)
  public titleText?: string;
  @ApiProperty({
    description: 'Announcement text',
    example: 'Время подключить базу данных.',
  })
  @ValidateIf(o => o.publicType === "Text")
  @IsString()
  @MinLength(MinLengthCheck.Announcement)
  @MaxLength(MaxLengthCheck.Announcement)
  public announcement?: string;
  @ApiProperty({
    description: 'Text Description',
    example: 'Пришло время подключить базу данных для первого микросервиса.',
  })
  @ValidateIf(o => o.publicType === "Text")
  @IsString()
  @MinLength(MinLengthCheck.Text)
  @MaxLength(MaxLengthCheck.Text)
  public text?: string;


  @ApiProperty({
    description: 'Quote Text',
    example:
      'Сервисы, предоставляющие REST API содержат документацию в формате OpenAPI',
  })
  @ValidateIf(o => o.publicType === "Quote")
  @IsString()
  @MinLength(MinLengthCheck.Quote)
  @MaxLength(MaxLengthCheck.Quote)
  public quote?: string;
  @ApiProperty({
    description: 'Quote Author Name',
    example:
      'Игорь Антонов',
  })
  @ValidateIf(o => o.publicType === "Quote")
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
  @ValidateIf(o => o.publicType === "Photo")
  @IsString()
  @IsNotEmpty()
  public photo?: string;


  @ApiProperty({
    description: 'Link',
    example: 'https://htmlacademy.ru',
  })
  @ValidateIf(o => o.publicType === "Link")
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  public link?: string;
  @ApiProperty({
    description: 'Link Description',
    example: 'HTMLAcademy',
  })
  @ValidateIf(o => o.publicType === "Link")
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
    example: 'published',
  })
  @IsEnum(PublicationStatus)
  public publicStatus!: keyof typeof PublicationStatus;

  @ApiProperty({
    description: 'Publication Type',
    example: 'video',
  })
  @IsEnum(PublicationType)
  public publicType!: keyof typeof PublicationType;

  @ApiProperty({
    description: 'Repost Public',
    example: 'false',
  })
  @IsBoolean()
  @IsNotEmpty()
  public isRepost!: boolean;

  @ApiProperty({
    description: 'Original Author ID',
    example: '12345',
  })
  @ValidateIf(o => o.isRepost === true)
  @IsNotEmpty()
  @IsString()
  public originalAuthorId?: string;

  @ApiProperty({
    description: 'Original Publication ID',
    example: '1234',
  })
  @ValidateIf(o => o.isRepost === true)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public originalPublicationId?: string;

  @ApiProperty({
    description: 'Comments Count',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  public commentsCount!: number;
  @ApiProperty({
    description: 'Likes Count',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  public likesCount!: number;
}
