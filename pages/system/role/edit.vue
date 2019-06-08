<template>
  <div class="edit-wrap">
    <div class="edit-form">
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
          :default-checked-keys='defaultCheck'
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
  export default class RoleEdit extends Vue {
    form = {
      roleName: '',
      roleDescription: ''
    }
    treeData = []
    defaultProps = {
      children: 'children',
      label: 'name'
    }
    defaultCheck = [] // 已选中
    menus = '' // 选中的子从菜单id 拼接 用，隔开
    async beforeMount () {
      let id = this.$route.query.id
      let data = await axios.get(`/api/supervise/roles/${id}`, {params: {id: id}})
      console.log(data)
      this.form.roleName = data.data.name
      this.form.roleDescription = data.data.description
      this.treeData = data.data.menuDTOList
      this.treeData.forEach(item => {
        item.children.forEach(e => {
          if (e.open === true) {
            this.defaultCheck.push(e.id)
          }
        })
      })
      // console.log(this.defaultCheck)
    }
    async submit () {
      // 被选中的节点组成的数组
      let treeList = this.$refs.tree.getCheckedNodes()
      console.log(treeList)
      for (let i = 0; i < treeList.length; i++) {
        treeList[i].open = true
        this.menus += treeList[i].id + ','
      }
      let id = this.$route.query.id
      let roleDTO = {
        id: id,
        name: this.form.roleName,
        description: this.form.roleDescription,
        menus: this.menus,
        type: 'ROLE_ADMIN'
      }
      console.log(roleDTO)
      await axios.put(`/api/supervise/roles/${id}`, roleDTO)
      this.$router.push('/system/role')
    }
  }
</script>

<style scoped lang="scss">
  .edit {
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
