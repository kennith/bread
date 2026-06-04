<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Title from '@/components/TitleComponent.vue'
import Section from '@/components/SectionComponent.vue'
import { fetchTraditioalChineseDevotional } from '@/composable/useFetchDevotional'
import { fetchBible } from '@/composable/useBible'
import type { Devotional } from '@/types/devotional'

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
  app_bible_references: '',
}

const traditionalChinese = ref<Devotional>(devotional)

type DevotionalBibleReference = {
  id: string
  reference: string
  content: string
}

const devotionBibleReferences = ref<DevotionalBibleReference[][]>([])

const getBibleReferences = (reference: string): string => {
  const seperator = '-'
  const parts = reference.split(seperator) as [string, string]
  if (parts.length !== 2) {
    return reference
  }
  return validBibleReference(parts)
}

const validBibleReference = (references: [string, string]) => {
  const [firstParts, secondParts] = [references[0].split('.'), references[1].split('.')]

  return firstParts[0] + '.' + firstParts[1] + '.' + firstParts[2] + '-' + secondParts[2]
}

onMounted(async () => {
  ;[traditionalChinese.value] = await fetchTraditioalChineseDevotional()
  const appBibleReferences = traditionalChinese.value.app_bible_references

  const bibleReferences = appBibleReferences.split(';')

  bibleReferences.forEach(async (reference: string) => {
    const passages = await fetchBible(getBibleReferences(reference))
    if (passages) {
      devotionBibleReferences.value.push(passages as DevotionalBibleReference[])
    }
  })
})
</script>

<template>
  <div class="flex flex-col xl:flex-col text-lg/10 lg:mx-auto xl:max-w-7xl max-w-[80ch] mx-8">
    <Section class="flex justify-between flex-col-reverse sm:flex-row gap-3">
      <div class="flex flex-col">
        <div class="flex gap-3 justify-items-end items-center">
          <div class="text-2xl font-bold">
            {{ traditionalChinese.title }}
          </div>
          <div class="text-sm text-gray-700">{{ traditionalChinese.lang_author_name }}</div>
        </div>
        <div>
          <a
            v-html="traditionalChinese.passage_reference"
            :href="traditionalChinese.passage_url"
            class="text-xs italic"
            target="_blank"
            rel="noopener noreferrer"
          ></a>
          <div v-html="traditionalChinese.verse"></div>
        </div>
      </div>
      <div>
        <div class="text-sm text-gray-500">
          {{
            new Date().toLocaleDateString('zh-HK', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          }}
        </div>
      </div>
    </Section>
    <div class="xl:flex xl:flex-row xl:gap-8 justify-evenly">
      <div class="xl:w-1/2">
        <Section>
          <Title>經文</Title>

          <div
            v-for="(devotionBibleReference, referenceIndex) in devotionBibleReferences"
            v-bind:key="referenceIndex"
          >
            <div v-for="passage in devotionBibleReference" :key="passage.id">
              <div v-html="passage.reference"></div>
              <div v-html="passage.content"></div>
            </div>
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
          <div v-html="traditionalChinese.content"></div>
        </Section>

        <Section>
          <Title>靈修思考</Title>
          <div v-html="traditionalChinese.response"></div>
        </Section>

        <Section>
          <Title>回應</Title>
          <div v-html="traditionalChinese.thought"></div>
        </Section>
      </div>
    </div>
  </div>
</template>
