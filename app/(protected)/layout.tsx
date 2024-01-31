import { ILayoutProps } from '@/types/layout.props'
import { Navbar } from '@/app/(protected)/_components/navbar'

const ProtectedLayout = ({children}: Readonly<ILayoutProps>) => {
	return (
		<div className="app-bg-primary h-full w-full flex flex-col gap-y-10 items-center justify-center">
			<Navbar />
			{ children }
		</div>
	)
}

export default ProtectedLayout
