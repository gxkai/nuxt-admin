<template>
  <div>
    <el-date-picker
      v-model="dataTimeVlaue"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  // import axios from 'axios'
  @Component({
    props: {
    }
  })
  export default class UploadImage extends Vue {
    dataTimeVlaue = ''
  }
</script>

<style scoped type="text/scss" lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    line-height: 78px;
    text-align: center;
  }
  .avatar {
    width: 78px;
    height: 78px;
    display: block;
  }
</style>
