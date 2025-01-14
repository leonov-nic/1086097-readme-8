import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PublicationEntity } from './publication.entity';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationRdo } from './rdo/publication.rdo';
import { PublicationFactory } from './publication.factory';
import { PrismaClientService } from '@project/models';
import { Prisma } from '@prisma/client';
import { PublicationQuery } from './publicationQuery';
import { PaginationResult } from '@project/core';
import { getFormatedTags } from '@project/helpers';
import { SortDirection, PublicationStatus } from '@project/core';
import { fillDto } from '@project/helpers';

const DEFAULT_SORTING_TYPE = 'createAt';
const DEFAULT_SORTING_DIRECTION = SortDirection.Desc;
const PUBLIC_STATUS_DRAFT = PublicationStatus.Draft;

@Injectable()
export class PublicationRepository extends PublicationFactory {
  constructor(
    private readonly client: PrismaClientService
    ) {
    super();
  }

  private async getPublicationsCount(where: Prisma.PublicationWhereInput): Promise<number> {
    return this.client.publication.count({ where });
  }

  private calculatePublicationsOnPage(totalCount: number, limit: number): number {
    return Math.ceil(totalCount / limit);
  }

  public async createPublication(dto: CreatePublicationDto): Promise<PublicationEntity> {
    let newPublicationEntity = this.create(dto);

    const record = await this.client.publication.create({
      data: {
        ...newPublicationEntity.toPOJO(),
        tags: dto.tags && getFormatedTags(dto.tags),
        comments: {
          connect: [],
        },
      },
    });
    newPublicationEntity.publicationId = record.publicationId;
    return newPublicationEntity;
  }

  public async findPublicationById(publicationId: string): Promise<PublicationEntity> {

    const publication = await this.client.publication.findFirst({
      where: {
        publicationId,
      },
    });

    if (!publication) {
      // return null;
      throw new NotFoundException(`Publication with id ${publicationId} not found.`);
    }
    return this.create(publication);
  }

  public async deletePublicationById(publicationId: string): Promise<void> {
    await this.findPublicationById(publicationId);

    await this.client.publication.delete({
      where: {
        publicationId,
      },
    });
  }

  public async updatePublication(publicationId: string, dto: UpdatePublicationDto): Promise<PublicationEntity> {
    await this.findPublicationById(publicationId);
    const pojo = this.create(dto).toPOJO();
    const updatedPublication = await this.client.publication.update({
      where: { publicationId },
      data: {
        userId: pojo.userId,
        titleVideo: pojo.titleVideo,
        video: pojo.video,
        titleText: pojo.titleText,
        announcement: pojo.announcement,
        text: pojo.text,
        quote: pojo.quote,
        author: pojo.author,
        photo: pojo.photo,
        link: pojo.link,
        descriptionLink: pojo.descriptionLink,
        tags: pojo.tags,
        createAt: pojo.createAt,
        publicStatus: pojo.publicStatus,
        publicType: pojo.publicType,
        isRepost: pojo.isRepost,
        originalAuthorId: pojo.originalAuthorId,
        originalPublicationId: pojo.originalPublicationId,
        commentsCount: pojo.commentsCount,
        likesCount: pojo.likesCount,
      },
      include: {
        comments: true,
      }
    });

    return this.create(updatedPublication);
  }

  public async find(query: PublicationQuery):Promise<PaginationResult<PublicationEntity>> {
    const skip = query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const take = query?.limit;
    const where: Prisma.PublicationWhereInput = {};
    const orderBy: Prisma.PublicationOrderByWithRelationInput[] = [];
    const sortingType = query?.sortingType ? query.sortingType : DEFAULT_SORTING_TYPE;
    const sortDirection = query?.sortingDirection ? query.sortingDirection : DEFAULT_SORTING_DIRECTION;

    // или сортировка по одному из ключей
    // orderBy[sortingType] = sortDirection;

    if (sortDirection) {
      orderBy.push({ createAt: sortDirection });
      orderBy.push({ likesCount: sortDirection });
      orderBy.push({ commentsCount: sortDirection });
    }

    if (query?.userId) {
      where.userId = query.userId;
    }

    if (query.publicationType) {
      where.publicType = query.publicationType;
    }

    if (query.publicationStatus) {
      where.publicStatus = query.publicationStatus;
    }

    if (query?.tag) {
      where.tags = { has: query.tag };
    }

    const [records, publicationsCount] = await Promise.all([
      this.client.publication.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { comments: true },
      }),
      this.getPublicationsCount(where),
    ]);

    return {
      entities: records.map((record) => this.create(record)),
      currentPage: query?.page,
      totalPages: this.calculatePublicationsOnPage(publicationsCount, take),
      itemsPerPage: take,
      totalItems: publicationsCount,
    };
  }

  public async findPublicationsByTitle(title: string): Promise<PublicationEntity[]> {
    const publications = await this.client.publication.findMany({
      where: {
        OR: [
          { titleText: title },
          { titleVideo: title },
        ],
      },
      include: {
        comments: true,
        likes: true,
      },
    });

    if (!publications || publications.length === 0) {
      throw new NotFoundException(`Publication with title ${title} not found.`);
    }
    return publications.map((publication) => this.create(publication));
  }

  public async findDrafts(userId: string): Promise<PublicationEntity[]> {
    const where: Prisma.PublicationWhereInput = {};
    where.userId = userId;
    where.publicStatus = PUBLIC_STATUS_DRAFT;
    const draftsPublications = await this.client.publication.findMany({
      where,
    });

    if (!draftsPublications || draftsPublications.length === 0) {
      throw new NotFoundException(`Drafts Publication not found.`);
    }

    return draftsPublications.map((publication) => this.create(publication));
  }

  public async findRepost(publicationId: string, userId: string): Promise<void> {
    const where: Prisma.PublicationWhereInput = {};
    where.originalPublicationId = publicationId;
    where.originalAuthorId = userId;
    const repostPublication = await this.client.publication.findFirst({
      where,
    });

    if (repostPublication) {
      throw new ConflictException(`Repost is already exist`);
    }
  }
}
