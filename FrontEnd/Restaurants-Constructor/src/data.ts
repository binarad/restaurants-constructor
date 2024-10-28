export type AddedRestaurantType = {
	title: string
	description: string
	imgUrl: string
}

export type AddRestaurantType = {
	title: string | null
	setTitle: (name: React.SetStateAction<string | null>) => void
	description: string | null
	setDescription: (desc: React.SetStateAction<string | null>) => void
	imgUrl: string
	setImgUrl: (imgUrl: React.SetStateAction<string | null>) => void
}

export type fetchedRestaurantsType = {
	id: number
	name: string
	description: string
	imgUrl: string
}[]
