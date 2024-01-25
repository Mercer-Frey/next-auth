"use client";

import { ICardWrapperProps } from "@/types/auth/card-wrapper.props";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

export const CardWrapper = (
	{children, headerLabel, backButtonLabel, backButtonHref, showSocial}: ICardWrapperProps
) => {
	
	return (
		<Card className="w-[400px] shadow-md">
			<CardHeader>
				<Header label={ headerLabel } />
			</CardHeader>
			<CardContent>
				{ children }
			</CardContent>
			{ showSocial && (
				<CardFooter>
					<Social />
				</CardFooter>
			) }
			<CardFooter>
				<BackButton
					label={ backButtonLabel }
					href={ backButtonHref }
				/>
			</CardFooter>
		</Card>
	);
};