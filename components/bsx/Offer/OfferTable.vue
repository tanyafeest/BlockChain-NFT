<template>
  <div class="offer-table-container">
    <NeoTable
      :data="displayOffers(offers)"
      :paginated="displayOffers(offers).length > itemsPerPage"
      :per-page="itemsPerPage"
      :class="{ scrollable: offers.length > 0 }"
      :current-page.sync="currentPage"
      td-class="is-vcentered is-narrow"
      pagination-position="top">
      <div v-if="headerText" class="has-text-centered offer-title mb-2">
        {{ headerText }}
      </div>
      <NeoSelect v-model="selectedStatus">
        <option
          v-for="option in getUniqType(offers)"
          :key="option.type"
          :value="option.type">
          {{ option.value }}
        </option>
      </NeoSelect>
      <NeoTableColumn
        v-if="displayCollection"
        v-slot="props"
        :label="$t('offer.collection')"
        field="nft.collection.name"
        sortable>
        <nuxt-link
          :to="`/${urlPrefix}/collection/${props.row.nft.collection.id}`">
          <p
            class="limit-width-text"
            :title="
              props.row.nft.collection.name
                ? props.row.nft.collection.name
                : props.row.nft.collection.id
            ">
            {{
              props.row.nft.collection.name
                ? props.row.nft.collection.name
                : props.row.nft.collection.id
            }}
          </p>
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-if="isBsxStats"
        v-slot="props"
        :label="$t('offer.nftName')"
        field="nft.name"
        sortable>
        <nuxt-link :to="`/${urlPrefix}/gallery/${props.row.nft.id}`">
          <p
            class="limit-width-text"
            :title="props.row.nft.name ? props.row.nft.name : props.row.nft.id">
            {{ props.row.nft.name ? props.row.nft.name : props.row.nft.id }}
          </p>
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        field="caller"
        :label="$t('offer.caller')"
        sortable>
        <nuxt-link :to="`/${urlPrefix}/u/${props.row.caller}`">
          <Identity :address="props.row.caller" />
        </nuxt-link>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="formatPrice"
        :label="$t('offer.price')"
        sortable>
        <Money :value="props.row.price" :token-id="assetId" inline />
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        field="expirationBlock"
        :label="$t('offer.expiration')"
        sortable>
        <NeoTooltip
          v-if="!isExpired(props.row.expiration)"
          :label="calcExpirationDate(props.row.expiration)">
          {{ calcExpirationTime(props.row.expiration) }}
        </NeoTooltip>
        <span v-else>
          {{ calcExpirationTime(props.row.expiration) }}
        </span>
      </NeoTableColumn>
      <NeoTableColumn
        v-if="!isBsxStats"
        v-slot="props"
        :label="$t('offer.action')"
        width="120"
        sortable>
        <div class="buttons">
          <NeoTooltip
            v-if="isOwner"
            :label="$t('offer.expired')"
            :active="calcExpirationTime(props.row.expiration) === 'expired'"
            class="mr-2">
            <NeoButton
              variant="success"
              no-shadow
              icon-left="money-bill"
              :disabled="calcExpirationTime(props.row.expiration) === 'expired'"
              @click="tellFrens(props.row.caller, false)" />
          </NeoTooltip>
          <NeoButton
            v-if="props.row.caller === accountId || isOwner"
            variant="warning"
            no-shadow
            icon-left="times"
            @click="tellFrens(props.row.caller, true)" />
        </div>
      </NeoTableColumn>
      <NeoTableColumn
        v-if="isBsxStats"
        v-slot="props"
        field="status"
        :label="$t('nft.offer.status')"
        sortable>
        <p>{{ props.row.status }}</p>
      </NeoTableColumn>
      <NeoTableColumn
        v-if="isBsxStats"
        v-slot="props"
        field="createdAt"
        :label="$t('nft.offer.date')"
        sortable>
        <p>
          {{ new Date(props.row.createdAt) | formatDistanceToNow }}
        </p>
      </NeoTableColumn>
      <template #empty>
        <div class="w-100 has-text-centered">
          {{ $t('nft.offer.empty') }}
        </div>
      </template>
    </NeoTable>
  </div>
</template>

<script lang="ts">
import { emptyArray } from '@kodadot1/minimark/utils'
import { Attribute } from '@kodadot1/minimark/common'
import { Component, Emit, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { formatDistanceToNow } from 'date-fns'

import { Offer } from './types'
import OfferMixin from '@/utils/mixins/offerMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import {
  NeoButton,
  NeoSelect,
  NeoTable,
  NeoTableColumn,
  NeoTooltip,
} from '@kodadot1/brick'

const components = {
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  Money: () => import('@/components/bsx/format/TokenMoney.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  NeoTable,
  NeoTableColumn,
  NeoTooltip,
  NeoSelect,
  NeoButton,
}

@Component({ components, filters: { formatDistanceToNow } })
export default class OfferTable extends mixins(OfferMixin, PrefixMixin) {
  @Prop({ type: Array, default: () => emptyArray<Attribute>() })
  public offers!: Offer[]
  @Prop(Boolean) public isOwner!: boolean
  @Prop(Boolean) public isBsxStats!: boolean
  @Prop({ type: String, default: '' }) public headerText!: string
  @Prop(Boolean) public isCollection!: boolean
  @Prop({ type: Boolean, default: false }) public displayCollection!: boolean
  public currentBlock = 0
  public itemsPerPage = 20
  public currentPage = parseInt(this.$route.query?.page as string) || 1

  @Emit('select')
  tellFrens(caller: string, withdraw: boolean) {
    return {
      caller,
      withdraw,
    }
  }

  get assetId() {
    return getKusamaAssetId(this.urlPrefix)
  }

  @Watch('currentPage')
  watchPageValue(val) {
    this.replaceUrl(String(val))
  }

  @Debounce(100)
  replaceUrl(value: string, key = 'page') {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, [key]: value },
      })
      .catch(this.$consola.warn /*Navigation Duplicate err fix later */)
  }
}
</script>
<style lang="scss">
.offer-table-container {
  .scrollable.table-wrapper {
    overflow-x: scroll;
  }
  .limit-width-text {
    max-width: 20ch;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .offer-title {
    line-height: 2rem;
    font-size: 1.2rem;
  }
  .pagination-list {
    margin: 0;
  }
}
</style>
