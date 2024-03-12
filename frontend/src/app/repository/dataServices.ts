import { Injectable } from "@angular/core";
import { DiscussionPointsDataService } from "./discussion-points/discussion-points-data.service";
import { CouncilsDataService } from "./council/council.service";
import { PostsDataService } from "./posts/posts-data.service";
import { ThemesDataService } from "./themes/themes-data.service";
import { UsersDataService } from "./users/users-data.service";
import { CommentsDataService } from "./comments/comments-data.service";

@Injectable({providedIn: 'root'})
export class DataServices {
  constructor(
    public discussionPoints: DiscussionPointsDataService,
    public councils: CouncilsDataService,
    public posts: PostsDataService,
    public themes: ThemesDataService,
    public users: UsersDataService,
    public comments: CommentsDataService
  ) {}
}