<template>
  <new-module></new-module>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import NewModule from '@/components/business/Module'

  @Component({
    components: {
      BreadCrumb,
      'new-module': NewModule
    }
  })

  export default class Module extends Vue {

  }
</script>
