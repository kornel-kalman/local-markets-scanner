<script setup>
import PlaceDetails from "@/components/PlaceDetails.vue";
import axios from "axios";
import {onBeforeMount, ref} from "vue";


/*** Table data ***/
const places = ref([]);
const dataAvailable = ref(false)

onBeforeMount(() => {
  axios
      .get('http://localhost:5000/places')
      .then((response) => {
        let items = response.data;
        // Generate synthetic fields
        for (let idx in items) {
          items[idx]['_showDetails'] = false
        }
        places.value = items;
        dataAvailable.value = true;
      })
      .catch((error) => {
        console.error(error);
      });
})

/*** Table properties ***/
const fields = [
  {key: 'id', sortable: true},
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

const rowClass = (item, type) => {
  console.log(item.is_market);
  if (!item || type !== 'row') return;
  else if (item.is_market === true) return 'table-success';
  else if (item.is_market === false) return 'table-danger';
  return '';
}

const showPlaceDetails = (item, index, event) => {
  item._showDetails = !item._showDetails;
  event.preventDefault();

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
             :tbody-tr-class="rowClass"
             primary-key="id"
             @row-contextmenu="showPlaceDetails"
    >
      <template #cell(name)="row">
        <a :href="getLink(row.item.place_id)" target="_blank" title="Open in Google Maps">
          {{ row.item.name }}
        </a>
      </template>

      <template #row-details="row">
        <PlaceDetails :placeData="row"/>
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