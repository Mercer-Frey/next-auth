'use client'

import { useCurrentRole } from '@/hooks/use-current-role'
import { FormError } from '@/components/form-error'
import { IRoleGateProps } from '@/types/auth/role-gate.props'

export const RoleGate = ({children, allowedRole,}: IRoleGateProps) => {
	const role = useCurrentRole()
	
	if (role !== allowedRole) {
		return (
			<FormError message="You do not have permission to view this content!" />
		)
	}
	
	return (
		<>
			{ children }
		</>
	)
}