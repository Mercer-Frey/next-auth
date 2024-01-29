"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { ELoginSchema, LoginSchema, LoginSchemaInfer } from "@/schemas/validations/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login.action";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { EResetPasswordSchema } from "@/schemas/validations/reset-password.schema";

export const LoginForm = () => {
	const searchParams = useSearchParams()
	const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email already in use with different provider!' : ''
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')
	const [isPending, startTransition] = useTransition()
	const form = useForm<LoginSchemaInfer>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		}
	})
	
	const onLoginSubmit = (values: LoginSchemaInfer) => {
		setError('')
		setSuccess('')
		
		startTransition(() => {
			login(values)
				.then(data => {
					setError(data?.error)
					setSuccess(data?.success)
				})
		})
	}
	
	return (
		<CardWrapper
			headerLabel="Welcome back"
			backButtonLabel="Don't have an account?"
			backButtonHref="/auth/register"
			showSocial
		>
			<Form { ...form }>
				<form
					className='space-y-6'
					onSubmit={ form.handleSubmit(onLoginSubmit) }
				>
					
					<div className='space-y-4'>
						<FormField
							name={ EResetPasswordSchema.Email }
							control={ form.control }
							render={ ({field}) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{ ...field }
											disabled={ isPending }
											placeholder='john.email@huy.com'
											type='email'
										></Input>
									</FormControl>
									<FormMessage />
								</FormItem>
							) }
						/>
					</div>
					
					<div className='space-y-4'>
						<FormField
							name={ ELoginSchema.Password }
							control={ form.control }
							render={ ({field}) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{ ...field }
											disabled={ isPending }
											placeholder='******'
											type='password'
										></Input>
									</FormControl>
									
									<Button
										className='px-0 font-normal'
										size='sm'
										variant='link'
										asChild
									>
										<Link href='/auth/reset-password'>
											Forgot password?
										</Link>
									</Button>
									
									<FormMessage />
								</FormItem>
							) }
						/>
					</div>
					
					<FormError message={ error || urlError }></FormError>
					
					<FormSuccess message={ success }></FormSuccess>
					
					<Button
						className='w-full'
						disabled={ isPending }
						type='submit'
					>
						Login
					</Button>
				
				</form>
			
			</Form>
		</CardWrapper>
	);
};