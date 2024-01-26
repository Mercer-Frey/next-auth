"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { ELoginSchema, LoginSchema, LoginSchemaInfer } from "@/schemas/validations/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/app/auth/form-error";
import { FormSuccess } from "@/app/auth/form-success";

export const LoginForm = () => {
	const form = useForm<LoginSchemaInfer>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		}
	})
	
	const onLoginSubmit = (values: LoginSchemaInfer) => {
		console.log(values);
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
							name={ ELoginSchema.Email }
							control={ form.control }
							render={ ({field}) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{ ...field }
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
							name={ ELoginSchema.Password }
							control={ form.control }
							render={ ({field}) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{ ...field }
											placeholder='******'
											type='password'
										></Input>
									</FormControl>
									<FormMessage />
								</FormItem>
							) }
						/>
					</div>
					
					<FormError message='Something went wrong'></FormError>
					
					<FormSuccess message='Email sent'></FormSuccess>
					
					<Button
						className='w-full'
						type='submit'
					>
						Login
					</Button>
				
				</form>
			
			</Form>
		</CardWrapper>
	);
};