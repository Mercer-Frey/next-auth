'use client'

import { BeatLoader } from 'react-spinners'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { verificationEmail } from '@/actions/verification-email'
import { ERouteAuth } from '@/routes'

export const VerificationEmailForm = () => {
	const [error, setError] = useState<string | undefined>()
	const [success, setSuccess] = useState<string | undefined>()
	
	const searchParams = useSearchParams()
	
	const token = searchParams.get('token')
	
	const onSubmit = useCallback(() => {
		if (success || error) return
		
		if (!token) return setError('Missing token!')
		
		verificationEmail(token)
			.then((data) => {
				setSuccess(data.success)
				setError(data.error)
			})
			.catch(error => setError(error))
	}, [token, success, error])
	
	useEffect(() => onSubmit(), [onSubmit])
	
	return (
		<CardWrapper
			headerLabel="Confirming your verification"
			backButtonLabel="Back to login"
			backButtonHref={ ERouteAuth.Login }
		>
			<div className="flex items-center w-full justify-center">
				{ !success && !error && (<BeatLoader />) }
				
				<FormSuccess message={ success } />
				
				{ !success && (<FormError message={ error } />) }
			</div>
		</CardWrapper>
	)
}