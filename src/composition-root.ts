
import 'reflect-metadata';
import { Container, inject, injectable } from 'inversify';
import { AuthController } from "./features/auth/auth-controller"
import { AuthRepository } from "./features/auth/repo/auth-repository"
import { AuthService } from "./features/auth/services/auth-service"
import { UsersRepository } from "./features/users/repo/Users-repository"
import { UsersQueryRepository } from "./features/users/repo/UsersQuery-repository"
import { UsersQueryService } from "./features/users/services/usersQuery-service"
import { UsersService } from "./features/users/services/users-service"
import { UsersController } from "./features/users/users-controller"
import { CommentsService } from './features/comments/services/comments-service';
import { CommentsQueryService } from './features/comments/services/comments-query-service';
import { CommentsQueryRepository } from './features/comments/repo/comments-query-repository';
import { CommentsRepository } from './features/comments/repo/comments-repository';
import { CommentsController } from './features/comments/comments-controller';
import { PostsService } from './features/posts/services/posts-service';
import { PostsQueryService } from './features/posts/services/posts-query-service';
import { PostsQueryRepository } from './features/posts/repo/posts-query-repository';
import { PostsRepository } from './features/posts/repo/posts-repository';
import { PostsController } from './features/posts/posts-controller';
import { BlogsService } from './features/blogs/services/blogs-service';
import { BlogsQueryService } from './features/blogs/services/blogs-query-service';
import { BlogsQueryRepository } from './features/blogs/repo/blogs-query-repository';
import { BlogsRepository } from './features/blogs/repo/blogs-repository';
import { BlogsController } from './features/blogs/blogs-controller';

export const container: Container = new Container();
//Users +
container.bind(UsersService).to(UsersService)
container.bind(UsersQueryService).to(UsersQueryService)
container.bind(UsersQueryRepository).to(UsersQueryRepository)
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersController).to(UsersController)
//Users -

//Auth +
container.bind(AuthService).to(AuthService)
container.bind(AuthRepository).to(AuthRepository)
container.bind(AuthController).to(AuthController)
//Auth -

//Comments +
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsQueryService).toConstantValue(new CommentsQueryService(new CommentsQueryRepository()))
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(CommentsController).to(CommentsController)
//Comments -

//Posts +
container.bind(PostsService).to(PostsService)
container.bind(PostsQueryService).to(PostsQueryService)
container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(PostsRepository).to(PostsRepository)
container.bind(PostsController).to(PostsController)
//Posts -

//Blogs +
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsQueryService).to(BlogsQueryService)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsController).to(BlogsController)
//Blogs -