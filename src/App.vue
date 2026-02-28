<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Title from '@/components/TitleComponent.vue';
import Section from '@/components/SectionComponent.vue';

const odbApiUrl = 'https://api.experience.odb.org/devotionals/v2';
const englishSiteId = 1;
const traditioalChineseSiteId = 7;

const todayUnixTimestamp = new Date().setHours(0, 0, 0, 0);

const englishUrl = new URL(odbApiUrl);
englishUrl.searchParams.append('site_id', englishSiteId.toString());
englishUrl.searchParams.append('status', 'publish');
englishUrl.searchParams.append('country', 'US');
englishUrl.searchParams.append('on', todayUnixTimestamp.toString());

const traditioalChineseUrl = new URL(odbApiUrl);
traditioalChineseUrl.searchParams.append('site_id', traditioalChineseSiteId.toString());
traditioalChineseUrl.searchParams.append('status', 'publish');
traditioalChineseUrl.searchParams.append('country', 'US');
traditioalChineseUrl.searchParams.append('on', todayUnixTimestamp.toString());

type Devotional = {
  title: string;
  verse: string;
  content: string;
  thought: string;
  response: string;
}

const traditionalChinese = ref<Devotional>({
  title: '',
  verse: '',
  content: '',
  thought: '',
  response: '',
});

const english = ref<Devotional>({
  title: '',
  verse: '',
  content: '',
  thought: '',
  response: '',
});
const bible = ref();


onMounted(async () => {
  fetchEnglishDevotional();
  fetchTraditioalChineseDevotional();
})

const fetchTraditioalChineseDevotional = async () => {
  try {
    const response = await fetch(traditioalChineseUrl.toString());
    [traditionalChinese.value] = await response.json();
  } catch (error) {
    console.error(error);
  }
}

const fetchEnglishDevotional = async () => {
  try {
    const response = await fetch(englishUrl.toString());
    [english.value] = await response.json();

    fetchBible(english.value.passage_reference);
  } catch (error) {
    console.error(error);
  }
}

const fetchVerse = async (bibleId: string, passage: string) => {
  const odbBibleUrl = new URL('https://www.odbm.org/api/bible/search');
  odbBibleUrl.searchParams.append('bibleId', bibleId);
  odbBibleUrl.searchParams.append('query', passage);

  const response = await fetch(odbBibleUrl.toString());

  return response;

}

const fetchBible = async (passageReference: string) => {
  try {
    const cun = "c44765fbdfdb0ed9-01"; // CUN
    const niv = '71c6eab17ae5b667-01';

    let response = await fetchVerse(cun, passageReference);

    if (response.status == 500) {
      response = await fetchVerse(niv, passageReference);
    }

    const bibleData = await response.json();


    bible.value = bibleData.data.passages;
  } catch (error) {
    console.log(error);
  }
}

</script>

<template>
  <div class="flex flex-col gap-4 text-lg/10">
    <div v-html="traditionalChinese.title" class="text-2xl font-bold"> </div>
    <div v-html="traditionalChinese.verse"> </div>
    <div>- {{ traditionalChinese.lang_author_name }}</div>

    <Section>
      <div v-for="passage in bible" :key="passage.id">
        <div v-html="passage.reference"></div>
        <div v-html="passage.content"></div>
      </div>
    </Section>

    <Section>
      <Title>
        靈糧透視
      </Title>
      <div v-html="traditionalChinese.insights"></div>
    </Section>

    <Section>
      <div v-html="traditionalChinese.content"> </div>
    </Section>

    <Section>
      <Title>靈修思考</Title>
      <div v-html="traditionalChinese.response"> </div>
    </Section>

    <Section>
      <Title>回應</Title>
      <div v-html="traditionalChinese.thought"> </div>
    </Section>


  </div>
</template>

<style scoped></style>
