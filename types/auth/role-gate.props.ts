import { UserRole } from '@prisma/client'
import React from 'react'

export interface IRoleGateProps {
	children: React.ReactNode;
	allowedRole: UserRole;
}