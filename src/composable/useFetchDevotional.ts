const odbApiUrl = 'https://api.experience.odb.org/devotionals/v2/'
const todayUnixTimestamp = new Date().setHours(0, 0, 0, 0)

const fetchTraditioalChineseDevotional = async () => {
  const traditioalChineseSiteId = 7
  const traditioalChineseUrl = new URL(odbApiUrl)
  traditioalChineseUrl.searchParams.append('site_id', traditioalChineseSiteId.toString())
  traditioalChineseUrl.searchParams.append('status', 'publish')
  traditioalChineseUrl.searchParams.append('country', 'US')
  traditioalChineseUrl.searchParams.append('on', todayUnixTimestamp.toString())

  try {
    const response = await fetch(traditioalChineseUrl.toString())
    const data = await response.json()

    return data
  } catch (error) {
    console.error(error)
  }
}

const fetchEnglishDevotional = async () => {
  const englishUrl = new URL(odbApiUrl)
  const englishSiteId = 1

  englishUrl.searchParams.append('site_id', englishSiteId.toString())
  englishUrl.searchParams.append('status', 'publish')
  englishUrl.searchParams.append('country', 'US')
  englishUrl.searchParams.append('on', todayUnixTimestamp.toString())

  try {
    const response = await fetch(englishUrl.toString())
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

export { fetchTraditioalChineseDevotional, fetchEnglishDevotional }
