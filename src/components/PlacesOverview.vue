<script setup>
import json from '../assets/places.json'

const items = json

// Update the data
// jsonData.key = 'new value';

// Write the updated data back to the file
// fs.writeFileSync('data.json', JSON.stringify(jsonData));
</script>

<template>
  <div>
    <b-table hover :items="items"></b-table>
  </div>
</template>

<style scoped>

</style>