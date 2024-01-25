"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { IBackButtonProps } from "@/types/auth/back-button.props";

export const BackButton = ({href, label}: IBackButtonProps) => {
	
	return (
		<Button
			variant="link"
			className="font-normal w-full"
			size="sm"
			asChild
		>
			<Link href={ href }>
				{ label }
			</Link>
		</Button>
	);
};