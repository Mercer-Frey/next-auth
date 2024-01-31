import authConfig from '@/auth.config'
import NextAuth from 'next-auth'
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, ERouteAuth, publicRoutes } from '@/routes'

export const {auth} = NextAuth(authConfig)
export default auth((req) => {
	const {nextUrl} = req
	const isLoggedIn = Boolean(req.auth)
	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
	const isPublicRoute = (publicRoutes as string[]).includes(nextUrl.pathname)
	const isAuthRoute = (authRoutes as string[]).includes((nextUrl.pathname))
	
	if (isApiAuthRoute) return null
	if (isAuthRoute) {
		if (isLoggedIn) return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
		return null
	}
	if (!isLoggedIn && !isPublicRoute) return Response.redirect(new URL(ERouteAuth.Login, nextUrl))
	return null
})
// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}