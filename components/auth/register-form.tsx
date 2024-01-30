"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { ERegisterSchema, RegisterSchema, RegisterSchemaInfer } from "@/schemas/validations/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useState, useTransition } from "react";
import { register } from "@/actions/register.action";
import { ERouteAuth } from "@/routes";

export const RegisterForm = () => {
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')
	const [isPending, startTransition] = useTransition()
	const form = useForm<RegisterSchemaInfer>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
		}
	})
	
	const onRegisterSubmit = (values: RegisterSchemaInfer) => {
		setError('')
		setSuccess('')
		
		startTransition(() => {
			register(values)
				.then(data => {
					setError(data.error)
					setSuccess(data.success)
				})
		})
	}
	
	return (
		<CardWrapper
			headerLabel="Create an account"
			backButtonLabel="Already have an account?"
			backButtonHref={ ERouteAuth.Login }
			showSocial
		>
			<Form { ...form }>
				<form
					className='space-y-6'
					onSubmit={ form.handleSubmit(onRegisterSubmit) }
				>
					
					<div className='space-y-4'>
						<FormField
							name={ ERegisterSchema.Name }
							control={ form.control }
							render={ ({field}) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{ ...field }
											disabled={ isPending }
											placeholder='John Doe'
											type='text'
										></Input>
									</FormControl>
									<FormMessage />
								</FormItem>
							) }
						/>
					</div>
					
					<div className='space-y-4'>
						<FormField
							name={ ERegisterSchema.Email }
							control={ form.control }
							render={ ({field}) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{ ...field }
											disabled={ isPending }
											placeholder='jhon.email@huy.com'
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
							name={ ERegisterSchema.Password }
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
									<FormMessage />
								</FormItem>
							) }
						/>
					</div>
					
					<FormError message={ error }></FormError>
					
					<FormSuccess message={ success }></FormSuccess>
					
					<Button
						className='w-full'
						disabled={ isPending }
						type='submit'
					>
						Register
					</Button>
				
				</form>
			
			</Form>
		</CardWrapper>
	);
};