<template>
  <div class="content is-hidden-mobile">
    <NeoField :position="position">
      <NeoTooltip :label="$t('tooltip.largeDisplay')">
        <NeoRadioButton
          v-model="preferenceLayout"
          type="is-primary"
          class="collection-radio-btn"
          native-value="is-half-desktop is-half-tablet"
          :disabled="disabled"
          data-cy="large-display">
          <span>
            <NeoIcon icon="th-large" />
          </span>
        </NeoRadioButton>
      </NeoTooltip>
      <NeoTooltip :label="$t('tooltip.smallDisplay')">
        <NeoRadioButton
          v-model="preferenceLayout"
          type="is-primary"
          class="collection-radio-btn"
          native-value="is-one-quarter-desktop is-one-third-tablet"
          :disabled="disabled"
          data-cy="small-display">
          <span>
            <NeoIcon icon="th" />
          </span>
        </NeoRadioButton>
      </NeoTooltip>
    </NeoField>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { RmrkType } from '@/components/rmrk/service/scheme'
import { usePreferencesStore } from '@/stores/preferences'

import { NeoField, NeoIcon, NeoRadioButton, NeoTooltip } from '@kodadot1/brick'

@Component({ components: { NeoIcon, NeoRadioButton, NeoTooltip, NeoField } })
export default class Layout extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string
  @Prop({ default: 'rmrk/detail' }) public link!: string
  @Prop({ type: Boolean, default: false }) public readonly disabled!: boolean
  @Prop({ type: String, default: 'is-right' }) public readonly position!:
    | 'is-left'
    | 'is-right'
  @Prop() public items!: RmrkType[]

  get preferencesStore() {
    return usePreferencesStore()
  }

  get preferenceLayout() {
    return this.preferencesStore.getLayoutClass
  }

  set preferenceLayout(data) {
    this.$emit('change')
    this.preferencesStore.setLayoutClass(data)
  }
}
</script>
