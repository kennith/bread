const fetchVerse = async (bibleId: string, passage: string) => {
  const odbBibleUrl = new URL('https://www.odbm.org/api/bible/search/')
  odbBibleUrl.searchParams.append('bibleId', bibleId)
  odbBibleUrl.searchParams.append('query', passage)

  const response = await fetch(odbBibleUrl.toString())

  return response
}

const fetchBible = async (passageReference: string) => {
  try {
    const cun = 'c44765fbdfdb0ed9-01' // CUN
    const niv = '71c6eab17ae5b667-01'

    const response = await fetchVerse(cun, passageReference)
    const { data } = await response.json()

    return data.passages
  } catch (error) {
    console.log(error)
  }
}

export { fetchBible }
