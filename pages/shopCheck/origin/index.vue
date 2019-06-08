<template>
  <div class="origin--content">
    <bread-crumb :path="$route.path"/>
    暂时忽略
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'

  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class Origin extends Vue {

  }
</script>

<style scoped lang="scss">
  .origin--content{
    padding: 0 10px;
  }
</style>
