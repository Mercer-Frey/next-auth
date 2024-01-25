"use client";

import { useRouter } from "next/navigation";
import { ILoginButtonProps } from "@/types/auth/login-button.props";

export const LoginButton = (
	{children, mode = "redirect", asChild}: ILoginButtonProps
) => {
	const router = useRouter();
	
	const onClick = () => {
		router.push("/auth/login");
	};
	
	if (mode === "modal") {
		return (
			<></>
		)
	}
	
	return (
		<span onClick={ onClick } className="cursor-pointer">
            { children }
        </span>
	);
};