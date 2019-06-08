<template>
  <div class="type-wrap">
    <div class="repository__type">
      <bread-crumb :path="$route.path"/>
      <div class="title">
        <h3>{{ this.$route.query.name }}</h3>
        <el-button size="small" type="primary" @click="dialogFormVisible = true">新增</el-button>
      </div>

      <div class="list">
        <d2-crud
          :columns="columns"
          :data="childData"
          :loading="loading"
          :pagination="pagination"
          :options="options"
          :rowHandle="rowHandle"
          @editHandle="editHandle"
        />
      </div>

      <!--新增知识库-->
      <el-dialog title="新增知识库" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="标题" :label-width="formLabelWidth">
            <el-input v-model="form.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="来源" :label-width="formLabelWidth">
            <el-input v-model="form.source" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="内容" :label-width="formLabelWidth">
            <div class="edit_container">
              <quill-editor ref="myTextEditor"
                            :content="form.content"
                            :config="editorOption"
                            @change="onEditorChange($event)">
              </quill-editor>
            </div>
          </el-form-item>
          <el-form-item label="是否置顶" :label-width="formLabelWidth">
            <el-select v-model="form.home" placeholder="是否置顶">
              <el-option
                v-for="item in homeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <!--编辑知识库-->
      <el-dialog title="编辑知识库" :visible.sync="dialogEdit">
        <el-form :model="editForm">
          <el-form-item label="标题" :label-width="formLabelWidth">
            <el-input v-model="editForm.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="来源" :label-width="formLabelWidth">
            <el-input v-model="editForm.source" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="内容" :label-width="formLabelWidth">
            <div class="edit_container">
              <quill-editor ref="myTextEditor"
                            :content="editForm.content"
                            :config="editorOption2"
                            @change="onEditorChange2($event)">
              </quill-editor>
            </div>
          </el-form-item>
          <el-form-item label="是否置顶" :label-width="formLabelWidth">
            <el-select v-model="editForm.home" placeholder="是否置顶">
              <el-option
                v-for="item in homeOptions2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEdit = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import axios from 'axios'
  import moment from 'moment'
  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class RepositoryCategoryList extends Vue {
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 50
      },
      {
        title: '标题',
        key: 'title'
      },
      {
        title: '来源',
        key: 'source'
      },
      {
        title: '打开次数',
        key: 'readTimes'
      },
      {
        title: '内容',
        key: 'text',
        showOverflowTooltip: true,
        minWidth: 200,
        className: 'columnsContent'
      },
      {
        title: '是否置顶',
        key: 'home'
      },
      {
        title: '更新时间',
        key: 'lastModifiedDate'
      }
    ]
    childData = []
    loading = false
    pagination= {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options = {
      border: true
    }
    rowHandle = {
      remove: {
        text: '删除',
        type: 'text',
        confirm: true
      },
      custom: [
        {
          text: '编辑',
          size: 'text',
          emit: 'editHandle'
        }
      ]
    }

    // 增加弹窗
    dialogFormVisible = false
    form = {
      title: '',
      source: '',
      content: '',
      home: ''
    }
    formLabelWidth = '80px'
    homeOptions = [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]

    repalceHtml (str) {
      let s1 = str.replace(/<\/?.+?>/g, '')
      let s2 = s1.replace(/ /g, '')// 去html
      let s3 = s2.replace(/&nbsp;/ig, '') // &nbsp;转为空格
      // let s4 = s3.replace(/\s*/g, '')// 去空格;
      return s3
    }

    beforeMount () {
      this.getData()
    }

    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getData()
    }
    async getData () {
      let id = this.$route.query.id
      let params = {
        repositoryTypeId: id,
        title: '',
        pageNum: this.pagination.currentPage,
        pageSize: 15
      }
      let data = await axios.get(`/api/supervise/repositories`, {params: params})
      this.childData = data.data.list
      this.childData.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
        item.text = this.repalceHtml(item.content)// 内容格式化
        item.lastModifiedDate = moment(item.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
        if (item.home.toString() === 'true') {
          item.home = '是'
        } else {
          item.home = '否'
        }
        if (item.readTimes === null) {
          item.readTimes = '0'
        }
      })
      this.pagination.total = data.data.total
    }

    // 富文本编辑器 && 新增功能
    editorOption = {}
    onEditorChange ({ editor, html, text }) {
      this.form.content = html
    }
    async onSubmit () {
      let repository = {
        title: this.form.title,
        source: this.form.source,
        home: this.form.home,
        content: this.form.content,
        repositoryTypeId: this.$route.query.id
      }
      await axios.post(`/api/supervise/repositories`, repository)
      this.dialogFormVisible = false
      this.getData()
    }
    // 删除
    async handleRowRemove ({ index, row }, done) {
      await axios.post(`/api/supervise/repositories/${row.id}`)
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

    // 编辑弹窗
    dialogEdit = false
    editForm = {
      title: '',
      source: '',
      content: '',
      home: '',
      id: ''
    }
    homeOptions2 = [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]

    editHandle ({index, row}) {
      console.log(row)
      this.dialogEdit = true
      this.editForm.title = row.title
      this.editForm.source = row.source
      this.editForm.home = row.home
      this.editForm.content = row.content
      this.editForm.id = row.id
    }

    editorOption2 = {}
    onEditorChange2 ({ editor, html, text }) {
      this.editForm.content = html
    }

    async editSubmit () {
      if (this.editForm.home === '是') {
        this.editForm.home = true
      } else {
        this.editForm.home = false
      }
      // console.log(this.editForm.id)
      let repository = {
        title: this.editForm.title,
        source: this.editForm.source,
        home: this.editForm.home,
        content: this.editForm.content,
        repositoryTypeId: this.$route.query.id
      }
      await axios.put(`/api/supervise/repositories/${this.editForm.id}`, repository)
      this.dialogEdit = false
      this.getData()
    }
  }
</script>

<style lang="scss">
  .el-tooltip__popper.is-dark{
    width: 60% !important;
  }
  .type-wrap{
    padding: 0 10px;
    .repository__type{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .title{
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
        }
      }

      .cell{
        button:last-child:before{
          content: '|';
          color: #EEE;
          position: relative;
          left: -6px;
          top: -1px;
        }
      }
    }
  }

</style>
