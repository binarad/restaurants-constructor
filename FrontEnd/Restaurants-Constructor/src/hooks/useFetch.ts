import { useEffect, useState } from 'react'
const useFetch = <T>(URL: string) => {
	const [data, setData] = useState<T | null>(null)
	useEffect(() => {
		fetch(URL)
			.then(resp => resp.json())
			.then(data => setData(data))
	}, [URL])

	return data
}

export default useFetch
