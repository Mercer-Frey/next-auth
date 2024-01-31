'use client'

import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { EProviders } from '@/types/auth/providers.enum'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { toast } from 'sonner'

export const Social = () => {
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl')
	
	const onClick = (provider: EProviders) => {
		signIn(provider, {callbackUrl: DEFAULT_LOGIN_REDIRECT})
			.catch(error => toast.error(error))
	}
	
	return (
		<div className="flex items-center w-full gap-x-2">
			<Button
				className="w-full"
				size="lg"
				variant="outline"
				onClick={ () => onClick(EProviders.Google) }
			>
				<FcGoogle className="h-5 w-5" />
			</Button>
			<Button
				className="w-full"
				size="lg"
				variant="outline"
				onClick={ () => onClick(EProviders.GitHub) }
			>
				<FaGithub className="h-5 w-5" />
			</Button>
		</div>
	)
}