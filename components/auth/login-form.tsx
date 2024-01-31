'use client'

import { CardWrapper } from '@/components/auth/card-wrapper'
import { useForm } from 'react-hook-form'
import { ELoginSchema, LoginSchema, LoginSchemaInfer } from '@/schemas/validations/login.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { login } from '@/actions/login.action'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ERouteAuth } from '@/routes'

export const LoginForm = () => {
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl')
	const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email already in use with different provider!' : ''
	
	const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false)
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')
	const [isPending, startTransition] = useTransition()
	
	const form = useForm<LoginSchemaInfer>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			[ELoginSchema.Email]: '',
			[ELoginSchema.Password]: '',
			[ELoginSchema.Code]: '',
		}
	})
	
	const onLoginSubmit = (values: LoginSchemaInfer) => {
		setError('')
		setSuccess('')
		
		startTransition(() => {
			login(values, callbackUrl)
				.then((data) => {
					if (data?.error) {
						form.reset()
						setError(data.error)
					}
					
					if (data?.success) {
						form.reset()
						setSuccess(data.success)
					}
					
					if (data?.twoFactor) {
						setShowTwoFactor(true)
					}
				})
				.catch(error => setError(error))
		})
	}
	
	return (
		<CardWrapper
			headerLabel="Welcome back"
			backButtonLabel="Don't have an account?"
			backButtonHref={ ERouteAuth.Register }
			showSocial
		>
			<Form { ...form }>
				<form
					className="space-y-6"
					onSubmit={ form.handleSubmit(onLoginSubmit) }
				>
					{ !showTwoFactor &&
                        <>
                            <div className="space-y-4">
                                <FormField
                                    name={ ELoginSchema.Email }
                                    control={ form.control }
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

                            <div className="space-y-4">
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
													placeholder="******"
													type="password"
												/>
											</FormControl>
											
											<Button
												className="px-0 font-normal"
												size="sm"
												variant="link"
												asChild
											>
												<Link href={ ERouteAuth.ResetPassword }>
													Forgot password?
												</Link>
											</Button>
											
											<FormMessage />
										</FormItem>
									) }
                                />
                            </div>
                        </>
					}
					
					{ showTwoFactor &&
                        <>
                            <div className="space-y-4">
                                <FormField
                                    name={ ELoginSchema.Code }
                                    control={ form.control }
                                    render={ ({field}) => (
										<FormItem>
											<FormLabel>Two Factor Code</FormLabel>
											<FormControl>
												<Input
													{ ...field }
													disabled={ isPending }
													placeholder="123456"
													type="text"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									) }
                                />
                            </div>

                        </>
					}
					
					<FormError message={ error || urlError }></FormError>
					
					<FormSuccess message={ success }></FormSuccess>
					
					<Button
						className="w-full"
						disabled={ isPending }
						type="submit"
					>
						{ showTwoFactor ? 'Confirm' : 'Login' }
					</Button>
				
				</form>
			
			</Form>
		</CardWrapper>
	)
}