
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

// //Users + 
// const usersQueryRepository = new UsersQueryRepository()
// const usersRepository = new UsersRepository()
// const usersQueryService = new UsersQueryService(usersQueryRepository)
// const usersService = new UsersService(usersQueryService, usersQueryRepository, usersRepository)

// export const usersController = new UsersController(usersService, usersQueryService)
// //Users -

// //Auth +
// const authRepository = new AuthRepository()
// const authService = new AuthService(usersQueryService, usersQueryRepository, usersService, usersRepository, authRepository)

// export const authController = new AuthController(authService, usersQueryService)
// //Auth -

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
container.bind(CommentsQueryService).to(CommentsQueryService)
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