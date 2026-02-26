<script setup lang="ts">
import { onMounted, ref } from 'vue';

const odbApiUrl = 'https://api.experience.odb.org/devotionals/v2';
const englishSiteId = 1;
const traditioalChineseSiteId = 7;

const currentDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).replace(/\//g, '-');

const englishUrl = new URL(odbApiUrl);
englishUrl.searchParams.append('site_id', englishSiteId.toString());
englishUrl.searchParams.append('status', 'publish');
englishUrl.searchParams.append('country', 'US');
englishUrl.searchParams.append('on', currentDate);

const traditioalChineseUrl = new URL(odbApiUrl);
traditioalChineseUrl.searchParams.append('site_id', traditioalChineseSiteId.toString());
traditioalChineseUrl.searchParams.append('status', 'publish');
traditioalChineseUrl.searchParams.append('country', 'US');
traditioalChineseUrl.searchParams.append('on', currentDate);

const traditionalChinese = ref({});
const english = ref({});
const bible = ref();


onMounted(async () => {
  fetchEnglishDevotional();
  fetchTraditioalChineseDevotional();
  // fetchBible("Exodus 20:1-4, 7-8, 12-17");
  // fetchBible(english.value.passage_reference);
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

const fetchBible = async (passageReference: string) => {
  try {
    const u = 'https://www.odbm.org/api/bible/search?bibleId=c44765fbdfdb0ed9-01&query=' + encodeURIComponent(passageReference);
    const bibleResponse = await fetch(u);
    const bibleData = await bibleResponse.json();

    bible.value = bibleData.data.passages;
  } catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <div v-for="passage in bible" :key="passage.id">
    <div v-html="passage.reference"></div>
    <div v-html="passage.content"></div>
  </div>

  <div>Title</div>
  <div v-html="traditionalChinese.title"> </div>
  <div>Verse</div>
  <div v-html="traditionalChinese.verse"> </div>
  <div>Content</div>
  <div v-html="traditionalChinese.content"> </div>
  <div>Thought</div>
  <div v-html="traditionalChinese.thought"> </div>
  <div>Response</div>
  <div v-html="traditionalChinese.response"> </div>


</template>

<style scoped></style>
