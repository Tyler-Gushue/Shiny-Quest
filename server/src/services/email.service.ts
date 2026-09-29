import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = process.env.EMAIL_FROM || 'Shiny Quest <no-reply@shinyquest.app>'
export const VERIFICATION_CODE_EXPIRES_IN = Number(process.env.VERIFICATION_CODE_EXPIRES_IN) || 10

type SendEmailOptions = {

    to: string
    subject: string
    html: string
    text: string

}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {

    const { data, error } = await resend.emails.send({

        from: FROM_ADDRESS,
        to,
        subject,
        html,
        text

    })

    if (error) {

        console.error('Email failed to send:', error)
        throw new Error('Email failed to send')

    }

    return data

}

export async function sendVerificationEmail(to: string, code: string) {

    return sendEmail({

        to,
        subject: 'Your Shiny Quest verification code',
        text: `Your Shiny Quest verification code is ${code}. It expires in ${VERIFICATION_CODE_EXPIRES_IN} minutes. If you didn't create a Shiny Quest account, you can ignore this email.`,
        html: `
            <p>Your Shiny Quest verification code is:</p>
            <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${code}</p>
            <p>It expires in ${VERIFICATION_CODE_EXPIRES_IN} minutes.</p>
            <p>If you didn't create a Shiny Quest account, you can ignore this email.</p>
            <img src="https://shinyquest.app/email-logo.png" alt="Shiny Quest" width="300" style="display: block; margin-bottom: 24px; margin-top: 5px" />
        `

    })

}