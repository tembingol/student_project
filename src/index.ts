import { app } from './app'
import { connectMongoDB } from './db/mongodb'
import { SETTINGS } from './settings'

const startApp = async () => {
    await connectMongoDB()
    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT)
    })
}

startApp()
