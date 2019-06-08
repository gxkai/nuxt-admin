<template>
  <div class="system-wrap">
    <div class="system-form">
      <bread-crumb :path="$route.path"/>
      <el-form ref="form" :model="form" label-width="180px" style="margin-right: 200px;">
        <el-form-item label="距离显示（KM）">
          <el-input v-model="form.distant"></el-input>
        </el-form-item>
      </el-form>
      <div class="sys-btn">
        <el-button type="primary">保存</el-button>
      </div>
    </div>
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
  export default class System extends Vue {
    form = {
      distant: ''
    }
  }
</script>

<style scoped lang="scss">
  .system {
    &-wrap {
      padding: 0 10px;
      margin-bottom: 30px;
    }

    &-form {
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .sys-btn{
        display: flex;
        margin-right: 200px;
        justify-content: center;
      }
    }
  }
</style>
