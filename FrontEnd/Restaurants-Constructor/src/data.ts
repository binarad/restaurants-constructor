export type AddedRestaurantType = {
	title: string
	description: string
	imgUrl: string
}

export type AddRestaurantType = {
	title: string
	setTitle: (name: React.SetStateAction<string | null>) => void
	description: string
	setDescription: (desc: React.SetStateAction<string | null>) => void
	imgUrl: string
	setImgUrl: (imgUrl: React.SetStateAction<string | null>) => void
}
