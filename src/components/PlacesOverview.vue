<script setup>
import PlaceDetails from "@/components/PlaceDetails.vue";
import axios from "axios";
import {onBeforeMount, ref} from "vue";


/*** Table data ***/
const places = ref([]);
const displayedPlaces = ref([]);
const dataAvailable = ref(false);

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
});

/*** Table properties ***/
const fields = [
  {key: 'id', sortable: true},
  {key: 'n_photos', sortable: true},
  {key: 'n_reviews', sortable: true},
  {key: 'name', sortable: true},
  {key: 'rating', sortable: true}
];

const perPage = 20;
const currentPage = ref(1);


const MAP_LINK_TEMPLATE = 'https://www.google.com/maps/place/?q=place_id:PLACE_ID';

function getLink(place_id) {
  return MAP_LINK_TEMPLATE.replace('PLACE_ID', place_id)
}

function rowClass(item, type) {
  if (!item || type !== 'row') return;
  else if (item.is_market === true) return 'table-success';
  else if (item.is_market === false) return 'table-danger';
  return '';
}

function togglePlaceDetails(item, index, event) {
  event.preventDefault();
  let newState = !item._showDetails;
  for (const place of places.value)
    if (place._showDetails)
      place._showDetails = false;

  item._showDetails = newState;
}

function updatePlaceData(placeId, placeData) {
  // Update place record
  let idx = places.value.findIndex((placeObj) => placeObj.id === placeId);
  for (let prop in placeData) {
    places.value[idx][prop] = placeData[prop];
  }

  // Hide details of current record
  idx = displayedPlaces.value.findIndex((placeObj) => placeObj.id === placeId);
  displayedPlaces.value[idx]._showDetails = false;
  // Show details of next displayed & unmarked record
  for (let i = idx; i < displayedPlaces.value.length - 1; i++) {
    if (displayedPlaces.value[i + 1].is_market === null) {
      displayedPlaces.value[i + 1]._showDetails = true;
      break;
    }
  }
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
             v-model="displayedPlaces"
             :fields=fields
             :items=places
             primary-key="id"
             outlined hover caption-top
             caption="Local markets in Sri Lanka"
             :striped=true
             :small=true
             api-url="http://localhost:5000/places"
             :per-page=perPage
             :current-page=currentPage
             :tbody-tr-class="rowClass"
             @row-contextmenu="togglePlaceDetails"
    >
      <template #cell(name)="row">
        <a :href="getLink(row.item.place_id)" target="_blank" title="Open in Google Maps">
          {{ row.item.name }}
        </a>
      </template>

      <template #row-details="row">
        <PlaceDetails :placeData="row" @place:update="(placeId, placeData)=>updatePlaceData(placeId, placeData)"/>
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