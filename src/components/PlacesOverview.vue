<script setup>
import places_json from '../assets/places.json'

const places = places_json
// Use index as sequence number
for (let idx in places) {
  places[idx]['seq_no'] = idx
}
const fields = [
  'seq_no',
  {key: 'name', sortable: true},
  {key: 'location', sortable: true, label: '[Latitude, Longitude]'},
  {key: 'rating', sortable: true}
]
const sortBy = 'rating'
const sortDesc = true
const map_link_template = 'https://maps.google.com/maps?q=LAT,LON&z=14'


const get_link = (location) => {
  return map_link_template
      .replace('LAT', location[0])
      .replace('LON', location[1])
}
</script>

<template>
  <div class="content">
    <b-table id="places-table"
             outlined hover caption-top
             caption="Local markets in Sri Lanka"
             :striped=true
             :small=true
             per-page=20
             :fields=fields
             :items=places
             :sort-by=sortBy
             :sort-desc=sortDesc
             primary-key="seq_no"
    >
      <template #cell(location)="data">
        <a :href="get_link(data.item.location)" target="_blank" title="Open in Google Maps">
          {{ data.item.location }}
        </a>
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