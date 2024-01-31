'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { IBackButtonProps } from '@/types/auth/back-button.props'

export const BackButton = ({href, label}: IBackButtonProps) => {
	
	return (
		<Button
			className="font-normal w-full"
			variant="link"
			size="sm"
			asChild
		>
			<Link href={ href }>
				{ label }
			</Link>
		</Button>
	)
}