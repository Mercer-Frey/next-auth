export enum ERoute {
	Root = '/',
	Settings = '/settings',
	Server = '/server',
	Client = '/client',
	Admin = '/admin',
}

export enum ERouteAuth {
	Error = '/auth/error',
	Login = '/auth/login',
	Register = '/auth/register',
	VerificationEmail = '/auth/verification-email',
	ResetPassword = '/auth/reset-password',
	NewPassword = '/auth/new-password',
}

export enum ERouteApi {
	Auth = '/api/auth',
	Admin = '/api/admin',
}

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
	ERoute.Root,
	ERouteAuth.VerificationEmail
]

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged-in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
	ERouteAuth.Login,
	ERouteAuth.Register,
	ERouteAuth.Error,
	ERouteAuth.ResetPassword,
	ERouteAuth.NewPassword,
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = ERouteApi.Auth

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = ERoute.Settings
