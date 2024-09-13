<script setup>
import PlaceDetails from "@/components/PlaceDetails.vue";
import axios from "axios";
import {onMounted, ref} from "vue";
import reviewsJson from '@/assets/reviews.json'


/*** Table data ***/
const places = ref([]);
const dataAvailable = ref(false)

onMounted(() => {
  axios
      .get('http://localhost:5000/places', {
        headers: {"Access-Control-Allow-Origin": "*"}
      })
      .then((response) => {
        console.log(response)
        let items = response.data;
        // Generate synthetic fields
        for (let idx in items) {
          items[idx]['seq_no'] = idx
          items[idx]['_showDetails'] = false
        }
        // callback(items);
        places.value = items;
        // return items || [];
        dataAvailable.value = true;
      })
      .catch((error) => {
        console.error(error);
      });
})

/*const placesProvider = (ctx/!*, callback*!/) => {
  axios
      .get(ctx.apiUrl, {
        headers: {"Access-Control-Allow-Origin": "*"}
      })
      .then((response) => {
        console.log(response)
        let items = response.data;
        // callback(items);
        // places.value = items;
        return items || [];
      })
      .catch((error) => {
        console.error(error);
      });
}*/

const reviews = reviewsJson

/*** Table properties ***/
const fields = [
  {key: 'seq_no', sortable: true},
  {key: 'n_photos', sortable: true},
  {key: 'n_reviews', sortable: true},
  {key: 'name', sortable: true},
  {key: 'rating', sortable: true}
];

// TODO Pagination does not affect table
const perPage = 20;
const currentPage = 1;


const MAP_LINK_TEMPLATE = 'https://www.google.com/maps/place/?q=place_id:PLACE_ID'

const getLink = (place_id) => MAP_LINK_TEMPLATE.replace('PLACE_ID', place_id)

const showPlaceDetails = (item) => {
  item._showDetails = !item._showDetails;
}
</script>

<template>
  <div class="content" v-if="dataAvailable">
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
             api-url="http://localhost:5000/places"
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