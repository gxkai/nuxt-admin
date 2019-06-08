<template>
  <new-advert></new-advert>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import NewAdvert from '@/components/business/Advert'

  @Component({
    components: {
      BreadCrumb,
      'new-advert': NewAdvert
    }
  })
  export default class Advert extends Vue {

  }
</script>

