<template>
  <div class="breadcrumb-wrap">
    <el-row class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(path, index) in paths_" :key="index">
          <nuxt-link :to="index > 0 ? path : ''">
            {{$t(path)}}
          </nuxt-link>
          </el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'class-component'
@Component({
  props: {
    path: {
      default: '/'
    }
  }
})
export default class Breadcrumb extends Vue {
  paths = [];
  paths_ = [];
  mounted () {
    this.paths = this.path.split('/')
    this.addPath(this.paths)
    this.paths_.reverse()
  }
  addPath (e) {
    if (e.length === 1) {
    } else {
      this.paths_.push(this.paths.map(e => e).join('/'))
      e.splice(e.length - 1, 1)
      this.addPath(e)
    }
  }
}
</script>

<style scoped type="text/scss" lang="scss">
  .breadcrumb {
    padding: 20px 0;
  }
</style>
