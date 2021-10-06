export default interface DevProps {
	avatar_url: string,
	bio: string,
	github_username: string,
	location: {
		type: string,
		coordinates: number[],
		_id: string
	},
	name: string,
	techs: string[],
	_id: string,
	__v: Number
}