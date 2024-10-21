import { Request, Response } from 'express'

// export type ParamType = {
//     id: string
// }

// export type BodyType = {
//     id: number
//     title: string
//     // ...
// }

// export type QueryType = {
//     search?: string
// }


export type videoType = {
    author: string;
    availableResolutions: string[] | undefined;
    canBeDownloaded: boolean | undefined;
    createdAt: Date;
    id: number;
    minAgeRestriction: null | string;
    publicationDate: Date;
    title: string;

}

export type OutputErrorsType = {
    errorsMessages: object[]

}

export type OutputType = void /*| OutputErrorsType | OutputVideoType*/

// export const someController = (
//     req: Request<ParamType, OutputType, BodyType, QueryType>,
//     res: Response<OutputType>
// ) => {

// }