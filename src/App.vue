<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Title from '@/components/TitleComponent.vue';
import Section from '@/components/SectionComponent.vue';
import { fetchTraditioalChineseDevotional, fetchEnglishDevotional } from '@/composable/useFetchDevotional';
import { fetchBible } from '@/composable/useBible';
import type { Devotional } from '@/types/devotional';

const devotional = {
  title: '',
  verse: '',
  content: '',
  thought: '',
  response: '',
  passage_reference: '',
  lang_author_name: '',
  insights: '',
  passage_url: '',
}

const traditionalChinese = ref<Devotional>(devotional);
const english = ref<Devotional>(devotional);

const bible = ref();

onMounted(async () => {
  [english.value] = await fetchEnglishDevotional();
  [traditionalChinese.value] = await fetchTraditioalChineseDevotional();
  bible.value = await fetchBible(english.value.passage_reference);
})

</script>

<template>
  <div class="flex flex-col xl:flex-col text-lg/10 lg:mx-auto xl:max-w-7xl max-w-[80ch] mx-8">
    <div class="mx-auto w-full">
      <Section>
        <div v-html="traditionalChinese.title" class="text-2xl font-bold"> </div>
        <a v-html="traditionalChinese.passage_reference" :href="traditionalChinese.passage_url" class="text-xs italic" target="_blank" rel="noopener noreferrer"></a>
        <div v-html="traditionalChinese.verse"> </div>
        <div>- {{ traditionalChinese.lang_author_name }}</div>
      </Section>
    </div>
    <div class="xl:flex xl:flex-row xl:gap-8 justify-evenly">
      <div class="xl:w-1/2">
        <Section>
          <Title>經文</Title>

          <div v-for="passage in bible" :key="passage.id">
            <div v-html="passage.reference"></div>
            <div v-html="passage.content"></div>
          </div>
        </Section>

        <Section>
          <Title> 靈糧透視 </Title>
          <div v-html="traditionalChinese.insights"></div>
        </Section>

      </div>

      <div class="xl:w-1/2">
        <Section>
          <Title>文章</Title>
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
    </div>

  </div>
</template>

<style scoped></style>
