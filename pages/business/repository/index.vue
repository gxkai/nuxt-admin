<template>
  <div class="repository-wrap">
    <div class="repository">
      <bread-crumb :path="$route.path"/>
      <div class="title-add">
        <h3>知识库</h3>
        <el-button type="primary" @click="dialogFormVisible = true" style="background: #169bd5;">新增</el-button>
      </div>

      <div class="list">
        <d2-crud
          ref="d2Crud"
          :columns="columns"
          :data="repositoryData"
          :loading="loading"
          :pagination="pagination"
          :options="options"
          :rowHandle="rowHandle"
          @custom-emit-list="viewList"

          edit-title="我的修改"
          :edit-template="editTemplate"
          @row-edit="handleRowEdit"


          @row-remove="handleRowRemove"

          :form-options="formOptions"
          @dialog-open="handleDialogOpen"
          @dialog-cancel="handleDialogCancel"
        />

        <!--新增-->

        <el-dialog title="我的新增" :visible.sync="dialogFormVisible">
          <el-form :model="addForm" ref="addForm" :rules="rules">
            <el-form-item label="类别名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="图标" :label-width="formLabelWidth" prop="icon" class="add-icon">

              <div class="select_box">
                <div @click="showlist()" class="select_box--default">
                  <img :src="imgsrc" width="30" height="30"/>
                  <p>{{ addForm.icon }}</p>
                </div>
                <ul v-show="falg" class="select_box--list">
                  <li @click="checkThis(item.text,item.str)" v-for="item in message">
                    <img :src="item.str" width="30" height="30"/>
                    <a href="javascript:void(0);">{{item.text}}</a>
                  </li>
                </ul>
              </div>

              <!--<el-input v-model="addForm.icon"></el-input>-->
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="enterSubmit">确 定</el-button>
          </div>
        </el-dialog>
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
  export default class Repository extends Vue {
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 60
      },
      {
        title: '类别名称',
        key: 'name'
      },
      {
        title: '打开次数',
        key: 'readTimes'
      },
      {
        title: '图标',
        key: 'icon'
      }
    ]
    repositoryData = []
    loading= false
    pagination= {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options = {
      border: true
    }
    rowHandle = {
      edit: {
        text: '编辑',
        type: 'text',
        class: 'repository-edit'
      },

      custom: [
        {
          text: '列表',
          type: 'text',
          emit: 'custom-emit-list',
          class: 'repository-list'
        }
      ],

      remove: {
        text: '删除',
        type: 'text',
        confirm: true
      }
    }

    formOptions = {
      labelWidth: '80px',
      labelPosition: 'right',
      saveLoading: false
    }

    // addTemplate = {
    //   name: {
    //     title: '类别名称',
    //     value: ''
    //   },
    //   icon: {
    //     title: '图标',
    //     value: ''
    //   }
    // }

    editTemplate = {
      name: {
        title: '类别名称',
        value: ''
      },
      icon: {
        title: '图标',
        value: ''
      }
    }

    dialogFormVisible = false
    formLabelWidth = '80px'

    message = [
      {text: 'repository_icon_1', str: 'http://img5.imgtn.bdimg.com/it/u=3770348613,1753312176&fm=200&gp=0.jpg'},
      {text: 'repository_icon_2', str: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3664982702,95222591&fm=27&gp=0.jpg'},
      {text: 'repository_icon_3', str: 'https://f11.baidu.com/it/u=166974344,852423378&fm=72'},
      {text: 'repository_icon_4', str: 'https://f11.baidu.com/it/u=166974344,852423378&fm=72'},
      {text: 'repository_icon_5', str: 'https://f11.baidu.com/it/u=166974344,852423378&fm=72'},
      {text: 'repository_icon_6', str: 'https://f11.baidu.com/it/u=166974344,852423378&fm=72'},
      {text: 'repository_icon_7', str: 'https://f11.baidu.com/it/u=166974344,852423378&fm=72'}
    ]
    falg = false
    imgsrc = require('../../../assets/img/add.png')

    showlist () {
      this.falg = !this.falg
    }
    checkThis (text, str) {
      this.addForm.icon = text
      this.imgsrc = str
      this.falg = !this.falg
    }

    beforeMount () {
      this.getData()
    }
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getData()
    }
    async getData () {
      let params = {
        name: '',
        pageNum: this.pagination.currentPage,
        pageSize: 15
      }
      let data = await axios.get(`/api/supervise/repositoryTypes`, {params: params})
      this.repositoryData = data.data.list
      console.log(this.repositoryData)
      this.repositoryData.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
        if (item.readTimes === null) {
          item.readTimes = 0
        }
      })
      this.pagination.total = data.data.total
    }

    handleDialogOpen ({ mode, row }) {
    }

    // 新增确定
    rules = {
      name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
      icon: [{ required: true, message: '请选择图标', trigger: 'blur' }]
    }
    addForm = {
      name: '',
      icon: '选择图标' // 默认的图标名称
    }
    async enterSubmit () {
      const valid = this.$refs.addForm.validate()
      try {
        if (valid) {
          if (this.addForm.name === '') {
            return false
          }
          if (this.addForm.icon === '选择图标') {
            this.$message.warning('请选择图标')
            return false
          }
          let params = {
            name: this.addForm.name,
            icon: this.addForm.icon,
            readTimes: 0
          }
          await axios.post(`/api/supervise/repositoryTypes`, params).then(res => {
            console.log(res)
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getData()
          }).catch(error => {
            this.$message({
              message: error.message,
              type: 'warning'
            })
          })
        }
      } catch (e) {
      } finally {
      }
    }

    handleDialogCancel (done) {
      done()
    }

    async handleRowRemove ({ index, row }, done) {
      await axios.delete(`/api/supervise/repositoryTypes/${row.id}`, {params: {id: row.id}})
      setTimeout(() => {
        console.log(index)
        console.log(row)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
      }, 300)
    }

    async handleRowEdit ({ index, row }, done) {
      console.log(row)
      let getName = await axios.get(`/api/supervise/repositoryTypes/${row.id}/editCount`, {params: {name: row.name}})
      if (getName.data >= 1) {
        this.$message({
          message: '名称已存在!',
          type: 'warning'
        })
        return false
      }
      await axios.put(`/api/supervise/repositoryTypes/${row.id}`, {name: row.name, icon: row.icon})
      this.getData()

      this.formOptions.saveLoading = true
      setTimeout(() => {
        console.log(index)
        console.log(row)
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        done()
        this.formOptions.saveLoading = false
      }, 300)
    }

    // 列表
    viewList ({index, row}) {
      this.$router.push({
        path: '/business/repository/child',
        query: {
          id: row.id,
          name: row.name
        }
      })
    }
  }
</script>

<style lang="scss">
  /*图标下拉样式*/
  .add-icon{
    height: 40px;
    line-height: 40px;
    .select_box{
      /*border: 1px solid #000;*/
      position: relative;
      &--default{
        cursor: pointer;
        display: flex;
        align-items: center;
        p{
          margin: 0 10px;
          padding: 0;
          line-height: 40px;
          height: 40px;
        }
      }
      &--list{
        width: 200px;
        position: absolute;
        left: 0;
        top: 30px;
        border: 1px solid #eee;
        background: #fff;
        max-height: 200px;
        overflow-y: auto;
        list-style: none;
        padding: 10px;
        li{
          list-style: none;
          text-align: left;
          display: flex;
          align-items: center;
          a{
            display: block;
            color: #333;
            margin-left: 10px;
            &:hover{
              color: #409eff;
            }
          }
        }
      }
    }
  }

  /**/
  .repository-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .repository{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .title-add{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        border-bottom: 1px solid #E9E9E9;
      }

      .list {
        padding: 0 15px;

        .el-table{
          th{
            background-color: #F4F4F4;
            color: #555;
          }
          &__body {
            td{
              padding: 6px 0;
            }
          }
        }
      }

      .cell{
        button:last-child:before{
          content: '|';
          color: #EEE;
          position: relative;
          left: -4px;
          top: -1px;
        }

        .repository-edit,
        .repository-list{
          float: left;
        }
      }
    }
  }
</style>
