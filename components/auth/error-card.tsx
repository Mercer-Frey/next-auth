import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { ERouteAuth } from "@/routes";

export const ErrorCard = () => {
	return (
		<CardWrapper
			headerLabel="Oops! Something went wrong!"
			backButtonHref={ ERouteAuth.Login }
			backButtonLabel="Back to login"
		>
			<div className="w-full flex justify-center items-center">
				<ExclamationTriangleIcon className="text-destructive" />
			</div>
		</CardWrapper>
	);
};