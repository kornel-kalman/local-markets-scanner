<script setup>
/* eslint no-undef: off */
import axios from "axios";
import {computed, defineProps, onBeforeMount, ref} from "vue";
import VariantButton from "@/components/elements/VariantButton.vue";

const props = defineProps({
  placeData: {
    type: Object,
    required: true
  }
})

const photosFolder = 'assets/_photos/' + props.placeData.item.id;

const reviewFields = [
  'rating',
  {key: 'relative_time_description', label: 'Time'},
  'text'
]
const reviews = ref([])
const has_reviews = computed(() => {
  return reviews.value.length > 0
})

const currentMarketStatus = ref(props.placeData.item.is_market)

const cardStyleClass = computed(() => {
  if (currentMarketStatus.value === true) return 'card-market-yes';
  else if (currentMarketStatus.value === false) return 'card-market-no';
  return '';
})

onBeforeMount(() => {
  axios
      .get('http://localhost:5000/places/' + props.placeData.item.id + '/reviews')
      .then((response) => {
        reviews.value = response.data;
      })
      .catch(console.error);
})


const saveMarketStatus = function (id, marketStatus) {
  axios.put('http://localhost:5000/places/' + id, {
    'is_market': marketStatus
  }).then((response) => {
    currentMarketStatus.value = response.data?.is_market;
  })
      .catch(console.error);
}

</script>

<template>
  <b-card :class="cardStyleClass">
    <b-row>
      <b-col sm="10">
        <b-row class="mb-2">
          <b-col cols="3" class="text-sm-right"><b>Name:</b></b-col>
          <b-col cols="6">{{ placeData.item.name }}</b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="3" class="text-sm-right"><b>Business status:</b></b-col>
          <b-col cols="6">{{ placeData.item.business_status }}</b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="3" class="text-sm-right"><b>Rating:</b></b-col>
          <b-col cols="6">{{ placeData.item.rating }} ({{ placeData.item.n_user_rating }})</b-col>
        </b-row>
      </b-col>
      <b-col sm="2">
        <h4>Is a market?</h4>
        <div>
          <VariantButton class="btn-market-yes"
                         :active="currentMarketStatus === true"
                         variant-class="success"
                         text="YES"
                         @clicked="saveMarketStatus(placeData.item.id,true)"/>
          <VariantButton class="btn-market-no"
                         :active="currentMarketStatus === false"
                         variant-class="danger"
                         text="NO"
                         @clicked="saveMarketStatus(placeData.item.id,false)"/>
        </div>
      </b-col>
    </b-row>

    <b-button v-b-toggle.collapse-photos class="m-1">Show photos</b-button>
    <b-button v-b-toggle.collapse-reviews class="m-1" v-if="has_reviews">Show reviews</b-button>

    <b-collapse id="collapse-photos">
      <template v-for="i in placeData.item.n_photos" :key="i">
        <b-img :src="`${photosFolder}/${i-1}.jpg`" width="360" height="270"/>
      </template>
    </b-collapse>

    <b-collapse id="collapse-reviews">
      <b-table
          hover caption-top
          caption="5 most relevant reviews"
          :items="reviews"
          :fields="reviewFields"
      />
    </b-collapse>

  </b-card>
</template>

<style scoped>
img {
  margin: 2px;
}

.card-market-yes {
  background-color: rgba(66, 185, 131, 0.25);
}

.card-market-no {
  background-color: rgba(240, 120, 120, 0.25);
}
</style>