const fetchVerse = async (bibleId: string, passage: string) => {
  const odbBibleUrl = new URL("https://www.odbm.org/api/bible/search/");
  odbBibleUrl.searchParams.append("bibleId", bibleId);
  odbBibleUrl.searchParams.append("query", passage);

  const response = await fetch(odbBibleUrl.toString());

  return response;
};

const fetchBible = async (passageReference: string) => {
  try {
    console.log(passageReference);
    const niv = "71c6eab17ae5b667-01";

    // let response = await fetchVerse(cun, passageReference);

    // If the CUN Bible doesn't have the passage, try the NIV Bible
    // if (!response.ok) {
    const response = await fetchVerse(niv, passageReference);
    // }

    const { data } = await response.json();
    return data.passages;
  } catch (error) {
    console.log(error);
  }
};

export { fetchBible };
