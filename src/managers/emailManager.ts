
import nodemailer from 'nodemailer'
import { SETTINGS } from '../settings';

export type MailOptions = {
    from: string
    to: string
    subject: string
    text: string
    html: string
}

export const emailManager = {

    async sendEmail(mailOptions: {}) {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465,
                secure: true,
                auth: {
                    user: SETTINGS.EMAILMANAGERLOGIN,
                    pass: SETTINGS.EMAILMANAGERPASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const info = await transporter.sendMail(mailOptions);

            return info
        } catch (err) {
            console.log(err)
        }
        return false
    },

    async sendRegistrationCode(receiversArray: string[], confirmationCode: string) {

        const mailOptions: MailOptions = {
            from: '"service app" <stud2025@vk.com>', // sender address
            to: receiversArray.join(','),// list of receivers,
            subject: 'Hello! this is registration',// Subject line,
            text: 'registration code = ' + confirmationCode,// plain text body
            html: "<b>registration " + confirmationCode + "</b>",// html body,
        };

        const result = await this.sendEmail(mailOptions)

        console.log(result)

        return result
    },

    async sendRegistrationConfirmation(receiversArray: string[]) {

        const mailOptions: MailOptions = {
            from: '"service app" <stud2025@vk.com>', // sender address
            to: receiversArray.join(','),// list of receivers,
            subject: 'Hello! this is registration',// Subject line,
            text: 'registration code = ' + 'confirmationCode',// plain text body
            html: "<b>registration</b>",// html body,
        };

        const result = this.sendEmail(mailOptions)

        console.log(result)

        return result
    }

}