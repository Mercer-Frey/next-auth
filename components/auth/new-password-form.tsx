'use client'

import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { newPassword } from '@/actions/new-password.action'
import {
	ENewPasswordSchema,
	NewPasswordSchema,
	NewPasswordSchemaInfer
} from '@/schemas/validations/new-password.schema'
import { ERouteAuth } from '@/routes'

export const NewPasswordForm = () => {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')
	const [isPending, startTransition] = useTransition()
	
	const form = useForm<NewPasswordSchemaInfer>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			[ENewPasswordSchema.Password]: '',
		},
	})
	
	const onSubmit = (values: NewPasswordSchemaInfer) => {
		setError('')
		setSuccess('')
		
		startTransition(() => {
			newPassword(values, token)
				.then((data) => {
					setError(data?.error)
					setSuccess(data?.success)
				})
				.catch(error => setError(error))
		})
	}
	
	return (
		<CardWrapper
			headerLabel="Enter a new password"
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
							name={ ENewPasswordSchema.Password }
							render={ ({field}) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{ ...field }
											disabled={ isPending }
											placeholder="******"
											type="password"
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
						Reset password
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}