<template>
  <div class="medicare-statistics">
    <el-date-picker
      v-model="mounthValue"
      type="month"
      placeholder="选择月">
    </el-date-picker>

    <el-button type="primary">搜索</el-button>
    <el-button>清空</el-button>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'class-component'

  @Component
  export default class Medicaid extends Vue {
    mounthValue = '';
  }
</script>
