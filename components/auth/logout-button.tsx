'use client'

import { logout } from '@/actions/logout.action'
import { ILogoutButtonProps } from '@/types/auth/logout-button.props'
import { toast } from 'sonner'

export const LogoutButton = ({children}: ILogoutButtonProps) => {
	const onLogoutClick = () => {
		logout()
			.catch(error => toast.error(error))
	}
	
	return (
		<span onClick={ onLogoutClick }>
            { children }
        </span>
	)
}