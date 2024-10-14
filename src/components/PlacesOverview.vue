<script setup>
import PlaceDetails from "@/components/PlaceDetails.vue";
import axios from "axios";
import {computed, onBeforeMount, ref} from "vue";


/*** Table data ***/
const places = ref([]);
const displayedPlaces = ref([]);
const dataAvailable = ref(false);

/*** Table properties ***/
const fields = [
  {key: 'id', sortable: true},
  {key: 'n_photos', sortable: true},
  {key: 'n_reviews', sortable: true},
  {key: 'name', sortable: true},
  {key: 'rating', sortable: true},
  {key: 'is_market', sortable: true}
];

const perPage = 20;
const currentPage = ref(1);
const totalRows = ref(0)

const types = ref([])
const typeFilter = ref(null)
const textFilter = ref(null);

const filter = computed(() => {
  if (textFilter.value === null && typeFilter.value === null) {
    return null;
  }
  return {'text': textFilter.value, 'type': typeFilter.value}
})

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
        totalRows.value = places.value.length;
      })
      .catch(console.error);

  axios
      .get('http://localhost:5000/places/types')
      .then((response) => {
        for (const typeData of response.data) {
          types.value.push({
            value: typeData[0],
            text: `${typeData[0].replaceAll('_', ' ')} (${typeData[1]})`
          })
        }
      })
      .catch(console.error);
});


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
  // Hide all,
  for (const place of places.value)
    if (place._showDetails)
      place._showDetails = false;
  // toggle selected.
  item._showDetails = newState;
}

function updatePlaceData(placeId, placeData, recordProcessed) {
  // Update place record
  let idx = places.value.findIndex((placeObj) => placeObj.id === placeId);
  for (let prop in placeData) {
    places.value[idx][prop] = placeData[prop];
  }

  if (recordProcessed) {
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
}

function doFilter(item, filterProp) {
  let text = filterProp.text;
  let type = filterProp.type;

  let filterText = (text !== null && text !== '');
  let filterType = (type !== null && type !== '');

  let textMatch = filterText && item.name.includes(text);
  let typeMatch = filterType && item.types.includes(type);

  return (!filterText || textMatch) && (!filterType || typeMatch);
}

function onFiltered(filteredItems) {
  // Trigger pagination to update the number of buttons/pages due to filtering
  totalRows.value = filteredItems.length
  currentPage.value = 1
}

</script>

<template>
  <div class="content" v-if="dataAvailable">
    <b-container fluid>
      <!-- User Interface controls -->
      <b-row>
        <b-col lg="4">
          <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              aria-controls="places-table"
          />
        </b-col>
        <b-col lg="4">
          <b-input-group size="sm">
            <b-form-input
                id="filter-input"
                v-model="textFilter"
                type="search"
                placeholder="Type to Search"
            />
            <b-input-group-append>
              <b-button :disabled="!textFilter" @click="textFilter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col lg="4">
          <select v-model="typeFilter">
            <option value="">Select an option</option>
            <option v-for="type in types" :key="type.value" :value="type.value">{{ type.text }}</option>
          </select>
        </b-col>
      </b-row>
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
               :filter="filter"
               :filter-function="doFilter"
               :tbody-tr-class="rowClass"
               @row-contextmenu="togglePlaceDetails"
               @filtered="onFiltered"
      >
        <template #cell(name)="row">
          <a :href="getLink(row.item.place_id)" target="_blank" title="Open in Google Maps">
            {{ row.item.name }}
          </a>
        </template>

        <template #row-details="row">
          <transition name="fade" mode="out-in">
            <PlaceDetails
                :placeData="row"
                @place:update="(placeId, placeData, recordProcessed)=>updatePlaceData(placeId, placeData, recordProcessed)"
            />
          </transition>
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<style scoped>
.content {
  width: 80vw;
  margin: 0 auto;
}
</style>