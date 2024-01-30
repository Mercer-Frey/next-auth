import { currentUser } from '@/lib/auth'
import { UserInfo } from '@/components/user-info'

const Page = async () => {
	const user = await currentUser()
	
	return (
		<UserInfo
			label="💻 Server component"
			user={ user }
		/>
	)
}

export default Page