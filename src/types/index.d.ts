type RequestContext = {
    currentUser: {
        userId: string
        userLogin: string
    },
    userDeviceInfo: {
        deviceId: string
        deviceName: string
        deviceIp: string
    }
}

declare global {
    declare module 'express-serve-static-core' {
        interface Request {
            context?: RequestContext;
        }
    }
}