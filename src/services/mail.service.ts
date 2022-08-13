// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default class MailService {
    private transporter: Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.transporter = nodemailer.createTransport({
            // @ts-ignore
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendActivationMail(to: string, link: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Account activation on ' + process.env.API_URL,
            text: '',
            html:
                `
                <div>
                    <h1>Follow the link to activate account</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
        });
    }
}
