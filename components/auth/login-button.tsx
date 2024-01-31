'use client'

import { useRouter } from 'next/navigation'
import { ILoginButtonProps } from '@/types/auth/login-button.props'
import { ERouteAuth } from '@/routes'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { LoginForm } from '@/components/auth/login-form'

export const LoginButton = (
	{children, mode = 'redirect', asChild}: ILoginButtonProps
) => {
	const router = useRouter()
	
	const onClick = () => {
		router.push(ERouteAuth.Login)
	}
	
	if (mode === 'modal') {
		return (
			<Dialog>
				<DialogTrigger asChild={ asChild }>
					{ children }
				</DialogTrigger>
				<DialogContent className="p-0 w-auto bg-transparent border-none">
					<LoginForm />
				</DialogContent>
			</Dialog>
		)
	}
	
	return (
		<span onClick={ onClick } className="cursor-pointer">
            { children }
        </span>
	)
}