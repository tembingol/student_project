import { BlogInputModel } from './blogs-models'
import { PostInputModel } from './posts-models'
import { VideoInputModel } from './videos-models'

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel | keyof VideoInputModel
// const f: FieldsType = 'some' // error

export type OutputErrorsType = {
    errorsMessages: { message: string, field: FieldNamesType }[]
}
