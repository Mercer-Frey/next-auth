'use client'

import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { resetPassword } from '@/actions/reset-password.action'
import {
	EResetPasswordSchema,
	ResetPasswordSchema,
	ResetPasswordSchemaInfer
} from '@/schemas/validations/reset-password.schema'
import { ERouteAuth } from '@/routes'

export const ResetPasswordForm = () => {
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')
	const [isPending, startTransition] = useTransition()
	
	const form = useForm<ResetPasswordSchemaInfer>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			[EResetPasswordSchema.Email]: '',
		},
	})
	
	const onSubmit = (values: ResetPasswordSchemaInfer) => {
		setError('')
		setSuccess('')
		
		startTransition(() => {
			resetPassword(values)
				.then((data) => {
					setError(data?.error)
					setSuccess(data?.success)
				})
				.catch(error => setError(error))
		})
	}
	
	return (
		<CardWrapper
			headerLabel="Forgot your password?"
			backButtonLabel="Back to login"
			backButtonHref={ ERouteAuth.Login }
		>
			<Form { ...form }>
				<form
					onSubmit={ form.handleSubmit(onSubmit) }
					className="space-y-6"
				>
					<div className="space-y-4">
						<FormField
							control={ form.control }
							name={ EResetPasswordSchema.Email }
							render={ ({field}) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{ ...field }
											disabled={ isPending }
											placeholder="john.doe@example.com"
											type="email"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							) }
						/>
					</div>
					<FormError message={ error } />
					<FormSuccess message={ success } />
					<Button
						disabled={ isPending }
						type="submit"
						className="w-full"
					>
						Send reset email
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}