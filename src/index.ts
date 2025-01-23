import { exit } from 'process'
import { initApp } from './app'
import { SETTINGS } from './settings'
import { db } from './db/db'

const app = initApp()

const startApp = async () => {

    const bdConneted = await db.run(SETTINGS.MONGO_URL)
    if (!bdConneted) {
        console.log('App not started... ')
        exit()
    }

    app.listen(SETTINGS.PORT, () => {
        console.log(`Example app listening on port ${SETTINGS.PORT}`)
    })

    return app

}

startApp()
