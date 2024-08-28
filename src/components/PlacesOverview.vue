<script setup>
import json from '../assets/places.json'

const items = json
const fields = [
  {key: 'name', sortable: true},
  {key: 'location', sortable: true},
  {key: 'rating', sortable: true}
]
const sortBy = 'rating'
const sortDesc = true

</script>

<template>
  <div class="content">
    <b-table id="places"
             hover caption-top
             caption="Local markets in Sri Lanka"
             per-page="20"
             :fields=fields
             :items="items"
             :sort-by="sortBy"
             :sort-desc="sortDesc"
    />
  </div>
</template>

<style scoped>
.content {
  width: 80vw;
  margin: 0 auto;
}
</style>