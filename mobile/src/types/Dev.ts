export default interface DevProps {
	avatar_url: string,
	bio: String,
	github_username: string,
	location: {
		type: String,
		coordinates: number[],
		_id: String
	},
	name: String,
	techs: String[],
	_id: String,
	__v: Number
}