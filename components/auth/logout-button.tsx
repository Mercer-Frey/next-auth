"use client";

import { logout } from "@/actions/logout.action";
import { ILogoutButtonProps } from "@/types/auth/logout-button.props";

export const LogoutButton = ({children}: ILogoutButtonProps) => {
	const onLogoutClick = () => {
		logout().then();
	};
	
	return (
		<span onClick={ onLogoutClick }>
            { children }
        </span>
	);
};