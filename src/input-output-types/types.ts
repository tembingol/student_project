import { BlogViewModel } from "./blogs-models"
import { UserViewModel } from "./users-moduls"

export type PaginationResponseType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[]
}

export type ServicesResponseNew<T> = {
    result: boolean,
    status: HTTP_STATUS_CODE,
    data: T,
    errors: OutputErrors,
}

export type OutputErrors = {
    errorsMessages: {
        message: string,
        field: string
    }[]
}

export enum EmailConfirmationStatus {
    confirmed = 1,
    notConfirmed = 2,
}

export enum PhoneConfirmationStatus {
    confirmed = 1,
    notConfirmed = 2,
}

export enum HTTP_STATUS_CODE {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    TooManyRequests = 429,
}
/*
//example user
const responTest: ServicesResponseNew<UserViewModel> = {
    result: false,
    status: HTTP_STATUS_CODE.OK,
    data: {
        id: "",
        login: "",
        email: "",
        createdAt: new Date()
    },
    errors: {
        errorsMessages: []
    }
}

//example blog
const responTestError: ServicesResponseNew<BlogViewModel | {}> = {
    result: false,
    status: HTTP_STATUS_CODE.BadRequest,
    data: {},
    errors: {
        errorsMessages: [{
            message: "string",
            field: "string"
        },
        {
            message: "string",
            field: "string"
        }]
    }
}
*/
export type RequestContextType = {
    currentUser: {
        userId: string
        userLogin: string
    },
    userDeviceInfo: UserDeviceInfoType
}

export type UserDeviceInfoType = {
    deviceId: string
    deviceName: string
    deviceIp: string
}

export type TokenPlayLoadType = {
    iat: number,
    exp: number,
    userId: string,
    userLogin: string,
    deviceId: string
}

export enum LikeStatus {
    NONE = 'None',
    LIKE = 'Like',
    DISLIKE = 'Dislike'
}