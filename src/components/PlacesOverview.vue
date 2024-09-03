<script setup>
import placesJson from '@/assets/places.json'
import reviewsJson from '@/assets/reviews.json'
import PlaceDetails from "@/components/PlaceDetails.vue";

/*** Table data ***/
const places = placesJson
// Use index as sequence number
for (let idx in places) {
  places[idx]['seq_no'] = idx
  places[idx]['_showDetails'] = false
}

const reviews = reviewsJson
console.log(reviews)

/*** Table properties ***/
const fields = [
  'seq_no',
  'n_photos',
  'n_reviews',
  {key: 'name', sortable: true},
  {key: 'rating', sortable: true}
]

// TODO Pagination does not affect table
const perPage = 20
const currentPage = 1


const MAP_LINK_TEMPLATE = 'https://www.google.com/maps/place/?q=place_id:PLACE_ID'

const getLink = (place_id) => MAP_LINK_TEMPLATE.replace('PLACE_ID', place_id)

const showPlaceDetails = (item) => {
  item._showDetails = !item._showDetails;
}
</script>

<template>
  <div class="content">
    <b-pagination
        v-model="currentPage"
        :total-rows="places.length"
        :per-page="perPage"
        aria-controls="places-table"
    />
    <b-table id="places-table"
             outlined hover caption-top
             caption="Local markets in Sri Lanka"
             :striped=true
             :small=true
             :per-page=perPage
             :current-page=currentPage
             :fields=fields
             :items=places
             primary-key="seq_no"
             @row-dblclicked="showPlaceDetails"
    >
      <template #cell(name)="data">
        <a :href="getLink(data.item.place_id)" target="_blank" title="Open in Google Maps">
          {{ data.item.name }}
        </a>
      </template>

      <template #row-details="row">
        <PlaceDetails :placeData="row" :place-reviews="Object.values(reviews[row.index])"/>
      </template>
    </b-table>
  </div>
</template>

<style scoped>
.content {
  width: 80vw;
  margin: 0 auto;
}
</style>