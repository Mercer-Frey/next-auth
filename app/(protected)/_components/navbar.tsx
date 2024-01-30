"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { ERoute } from "@/routes";

export const Navbar = () => {
	const pathname = usePathname();
	
	return (
		<nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
			<div className="flex gap-x-2">
				<Button
					asChild
					variant={ pathname === "/server" ? "default" : "outline" }
				>
					<Link href={ ERoute.Server }>
						Server
					</Link>
				</Button>
				<Button
					asChild
					variant={ pathname === "/client" ? "default" : "outline" }
				>
					<Link href={ ERoute.Client }>
						Client
					</Link>
				</Button>
				<Button
					asChild
					variant={ pathname === "/admin" ? "default" : "outline" }
				>
					<Link href={ ERoute.Admin }>
						Admin
					</Link>
				</Button>
				<Button
					asChild
					variant={ pathname === "/settings" ? "default" : "outline" }
				>
					<Link href={ ERoute.Settings }>
						Settings
					</Link>
				</Button>
			</div>
			<UserButton />
		</nav>
	);
};