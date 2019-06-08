<template>
  <new-discount></new-discount>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import NewDiscount from '@/components/business/Discount'

  @Component({
    components: {
      'new-discount': NewDiscount
    }
  })
  export default class Discount extends Vue {

  }
</script>
