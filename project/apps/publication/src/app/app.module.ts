import { Module } from '@nestjs/common';
import { PublicationModule } from '@project/publication-module';
import { CommentModule } from '@project/comment-module';
import { LikeModule } from '@project/like-module';

@Module({
  imports: [PublicationModule, CommentModule, LikeModule],
  controllers: [],
  providers: [PublicationModule, CommentModule, LikeModule],
})
export class AppModule {}
