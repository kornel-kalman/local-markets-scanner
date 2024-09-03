<script setup>
/* eslint no-undef: off */
const props = defineProps({
  placeData: {
    type: Object,
    required: true
  },
  placeReviews: {
    type: Object,
    required: false
  }
})
const photosFolder = 'assets/_photos/' + props.placeData.item.seq_no;

const reviewFields = ['rating', 'relative_time_description', 'text'/*, 'time'*/]

</script>

<template>
  <b-card>
    <b-row>
      <b-col sm="12">
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
    </b-row>

    <b-button v-b-toggle.collapse-photos class="m-1">Show photos</b-button>
    <b-button v-b-toggle.collapse-reviews class="m-1">Show reviews</b-button>

    <b-collapse id="collapse-photos">
      <template v-for="i in placeData.item.n_photos" :key="i">
        <b-img :src="`${photosFolder}/${i-1}.jpg`" width="360" height="270"/>
      </template>
    </b-collapse>

    <b-collapse id="collapse-reviews">
      <b-table
          hover caption-top
          caption="5 most relevant reviews"
          :items="placeReviews"
          :fields="reviewFields"
      />
    </b-collapse>

  </b-card>
</template>

<style scoped>
#photos_row {
  display: none;
}

img {
  margin: 2px;
}
</style>