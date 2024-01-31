import { Resend } from 'resend'
import { ERouteAuth } from '@/routes'
import { toast } from 'sonner'

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const sendVerificationEmail = async (
	email: string,
	token: string
) => {
	const confirmLink = `${ domain }${ ERouteAuth.VerificationEmail }?token=${ token }`
	
	await resend.emails.send({
		from: 'Acme <onboarding@resend.dev>',
		to: email,
		subject: 'Confirm your email',
		html: `<p>Click <a href="${ confirmLink }">here</a> to confirm email.</p>`
	})
		.then(res => console.log(res))
		.catch(error => toast.error(error))
}

export const sendPasswordResetEmail = async (
	email: string,
	token: string,
) => {
	const resetLink = `${ domain }${ ERouteAuth.NewPassword }?token=${ token }`
	
	await resend.emails.send({
		from: 'Acme <onboarding@resend.dev>',
		to: email,
		subject: 'Reset your password',
		html: `<p>Click <a href="${ resetLink }">here</a> to reset password.</p>`
	})
		.then(res => console.log(res))
		.catch(error => toast.error(error))
}

export const sendTwoFactorTokenEmail = async (
	email: string,
	token: string
) => {
	await resend.emails.send({
		from: 'Acme <onboarding@resend.dev>',
		to: email,
		subject: '2FA Code',
		html: `<p>Your 2FA code: ${ token }</p>`
	})
		.then(res => console.log(res))
		.catch(error => toast.error(error))
}
