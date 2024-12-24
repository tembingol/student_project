
import nodemailer from 'nodemailer'
import { SETTINGS } from '../settings';
import { error } from 'console';

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

            transporter.sendMail(mailOptions).catch((error) => console.log(error));

            return true
        } catch (err) {
            console.log(err)
        }
        return false
    },

    async sendRegistrationConfirmation(receiversArray: string[], confirmationCode: string) {

        const confirmLink = `https://8fdc6ffba3c499c27ea034bdbffe323d.serveo.net/confirm-email?code=${confirmationCode}`
        const emailText = `<h1>Thank for your registration</h1> <p>To finish registration please follow the link below:<a href=${confirmLink}>complete registration</a></p>`
        const mailOptions: MailOptions = {
            from: '"service app" <stud2025@vk.com>', // sender address
            to: receiversArray.join(','),// list of receivers,
            subject: 'Hello! this is registration',// Subject line,
            text: emailText,// plain text body
            html: "<b>" + emailText + "</b>",// html body,
        };

        const result = this.sendEmail(mailOptions)

        return result
    },

    async resendRegistrationConfirmation(receiversArray: string[]) {

        const mailOptions: MailOptions = {
            from: '"service app" <stud2025@vk.com>', // sender address
            to: receiversArray.join(','),// list of receivers,
            subject: 'Hello! this is registration',// Subject line,
            text: 'registration code = ' + 'confirmationCode',// plain text body
            html: "<b>registration</b>",// html body,
        };

        const result = this.sendEmail(mailOptions)

        return result
    }

}