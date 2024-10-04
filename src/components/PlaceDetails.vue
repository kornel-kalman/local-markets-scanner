<script setup>
/* eslint no-undef: off */
import axios from "axios";
import {computed, defineEmits, defineProps, onBeforeMount, ref} from "vue";
import VariantButton from "@/components/elements/VariantButton.vue";

const props = defineProps({
  placeData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['place:update']);

const photosFolder = 'assets/_photos/' + props.placeData.item.id;
// TODO Update scraper component to save property according to this logic.
const MAX_NUMBER_OF_PHOTOS_PER_PLACE = 7;

const reviewFields = [
  'rating',
  {key: 'relative_time_description', label: 'Time'},
  'text'
];
const reviews = ref([]);

const currentMarketStatus = ref(props.placeData.item.is_market);

const photosVisible = ref(false);
const reviewsVisible = ref(false);

const collapseIdPhotos = 'collapse-photos-' + props.placeData.item.id;
const collapseIdReviews = 'collapse-reviews-' + props.placeData.item.id;

const cardStyleClass = computed(() => {
  if (currentMarketStatus.value === true) return 'card-market-yes';
  else if (currentMarketStatus.value === false) return 'card-market-no';
  return '';
});

onBeforeMount(() => {
  let placeId = props.placeData.item.id;
  if (!placeId) {
    console.log('Place ID is missing, cannot load reviews.');
    return;
  }
  axios
      .get('http://localhost:5000/places/' + placeId + '/reviews')
      .then((response) => {
        reviews.value = response.data;
      })
      .catch(console.error);
})


function saveMarketStatus(id, marketStatus, recordProcessed = true) {
  axios
      .put('http://localhost:5000/places/' + id, {
        'is_market': marketStatus
      })
      .then((response) => {
        let is_market = response.data?.is_market;
        currentMarketStatus.value = is_market;
        emit('place:update', id, {'is_market': is_market}, recordProcessed)
      })
      .catch(console.error);
}

</script>

<template>
  <b-card :class="cardStyleClass">
    <b-row>
      <b-col sm="10">
        <b-row class="mb-2">
          <b-col cols="3">&nbsp;</b-col>
          <b-col cols="6"><h4>{{ placeData.item.name }}</h4></b-col>
        </b-row>
        <b-row class="mb-2" align-h="center">
          <b-col cols="3">
            <b-card title="Business status" bg-variant="light">
              <b-card-text>{{ placeData.item.business_status || '-' }}</b-card-text>
            </b-card>
          </b-col>
          <b-col cols="3">
            <b-card title="Rating" bg-variant="light">
              <b-card-text>{{ placeData.item.rating || '-' }} ({{ placeData.item.n_user_rating }})</b-card-text>
            </b-card>
          </b-col>
          <b-col cols="3">
            <b-card title="Type(s)" bg-variant="light">
              <b-card-text>
                <div v-for="type in placeData.item.types" :key="type">
                  {{ type.replaceAll('_', ' ') }}
                </div>
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col cols="4">
            <b-button v-b-toggle="collapseIdPhotos" class="m-1" v-if="placeData.item.n_photos > 0">
              <span class="when-closed">Show</span><span class="when-open">Hide</span> photos
            </b-button>
            <b-button v-b-toggle="collapseIdReviews" class="m-1" v-if="placeData.item.n_reviews > 0">
              <span class="when-closed">Show</span><span class="when-open">Hide</span> reviews
            </b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-collapse :id="collapseIdPhotos" v-model="photosVisible" @show="reviewsVisible=false">
            <template v-for="i in Math.min(placeData.item.n_photos, MAX_NUMBER_OF_PHOTOS_PER_PLACE)" :key="i">
              <b-img :src="`${photosFolder}/${i-1}.jpg`" width="360" height="270"/>
            </template>
          </b-collapse>
          <b-collapse :id="collapseIdReviews" v-model="reviewsVisible" @show="photosVisible=false">
            <b-table
                hover caption-top
                caption="5 most relevant reviews"
                :items="reviews"
                :fields="reviewFields"
            />
          </b-collapse>
        </b-row>
      </b-col>
      <b-col sm="2">
        <div class="fix-box">
          <h4>Is a market?</h4>
          <div>
            <VariantButton class="btn-market-yes"
                           :selected="currentMarketStatus === true"
                           :disabled="currentMarketStatus === true"
                           variant-class="success"
                           text="YES"
                           @clicked="saveMarketStatus(placeData.item.id, true)"/>
            <VariantButton class="btn-market-no"
                           :selected="currentMarketStatus === false"
                           :disabled="currentMarketStatus === false"
                           variant-class="danger"
                           text="NO"
                           @clicked="saveMarketStatus(placeData.item.id, false)"/>
          </div>
          <div>
            <a class="empty-link" v-text="'Clear status'" @click="saveMarketStatus(placeData.item.id, null, false)"/>
          </div>
        </div>
      </b-col>
    </b-row>
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

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}

div.fix-box {
  position: sticky;
  top: 20px;
}

a.empty-link {
  color: black;
  cursor: pointer;
  text-decoration: none;
}
</style>