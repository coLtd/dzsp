<template>
  <v-app>
    <!-- <v-toolbar v-show="true">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>全景电子沙盘</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>Link One</v-btn>
        <v-btn flat>Link Two</v-btn>
        <v-btn flat>Link Three</v-btn>
      </v-toolbar-items>
    </v-toolbar> -->
    <core-view />
  </v-app>
</template>

<script>
import CoreView from '@/components/core/View'
export default {
  name: 'App',
  data () {
    return {
      //
    }
  },
  components: {
    CoreView
  }
}
</script>
