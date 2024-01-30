import { ExtendedUser } from "@/next-auth";

export interface IUserInfoProps {
	user?: ExtendedUser;
	label: string;
}