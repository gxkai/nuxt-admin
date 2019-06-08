<template>
  <div class="add-wrap">
    <div class="add-form">
      <bread-crumb :path="$route.path"/>
      <div class="role-create">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="用户名称：">
            <el-input v-model="form.roleName" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：">
            <el-input v-model="form.roleDescription" placeholder="请输入角色描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="role-tree">
        <el-tree
          :data="treeData"
          show-checkbox
          check-on-click-node
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
      </div>
      <div class="role-btn">
        <el-button @click="$router.go(-1)">返回</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import axios from 'axios'
  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class RoleCreate extends Vue {
    form = {
      roleName: '',
      roleDescription: ''
    }
    treeData = []
    defaultProps = {
      children: 'children',
      label: 'name'
    }
    menus = '' // 选中的子从菜单id 拼接 用，隔开
    async beforeMount () {
      let roleTree = await axios.get(`/api/supervise/menus`)
      this.treeData = roleTree.data
    }
    async submit () {
      // 被选中的节点组成的数组
      let treeList = this.$refs.tree.getCheckedNodes()
      console.log(treeList)
      for (let i = 0; i < treeList.length; i++) {
        treeList[i].open = true
        this.menus += treeList[i].id + ','
      }
      let roleDTO = {
        name: this.form.roleName,
        description: this.form.roleDescription,
        menus: this.menus,
        type: 'ROLE_ADMIN'
      }
      await axios.post(`/api/supervise/roles`, roleDTO)
      this.$router.push('/system/role')
    }
  }
</script>

<style scoped lang="scss">
  .add {
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

      .role-create{
        margin-right: 200px;
      }
      .role-tree{
        margin-left: 50px;
      }
      .role-btn{
        display: flex;
        justify-content: center;
        padding: 50px;
      }
    }
  }

</style>
