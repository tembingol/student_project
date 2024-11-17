import { BlogInputModel } from './blogs-models'
import { PostInputModel } from './posts-models'
import { UserInputModel } from './users-moduls'
import { VideoInputModel } from './videos-models'

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel | keyof VideoInputModel | keyof UserInputModel
// const f: FieldsType = 'some' // error

export type OutputErrorsType = {
    errorsMessages: { message: string, field: FieldNamesType }[]
}
