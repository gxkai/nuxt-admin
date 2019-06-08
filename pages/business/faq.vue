<template>
  <div class="faq-wrap">
    <div class="faq">
      <bread-crumb :path="$route.path"/>
      <div class="title-add">
        <el-row>
          <el-col :span="12">
            <h4>常见问题</h4>
          </el-col>
          <el-col :span="12" class="add-col">
            <el-button type="primary" @click="addRow" style="background: #169bd5;">新增</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="list">
        <d2-crud
          ref="d2Crud"
          :columns="columns"
          :data="faqList"
          :loading="loading"
          :pagination="pagination"
          @pagination-current-change="paginationCurrentChange"
          :options="options"
          :rowHandle="rowHandle"

          add-title="我的新增"
          :add-template="addTemplate"
          @row-add="addFaq"

          @row-remove="removeFaq"

          edit-title="我的修改"
          :edit-template="editTemplate"
          @row-edit="editFaq"

          :form-options="formOptions"
          @dialog-cancel="handleDialogCancel"
        />
      </div>
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
  export default class Faq extends Vue {
    columns = [
      {
        title: '序号',
        key: 'index'
      },
      {
        title: '常见问题标题',
        key: 'question'
      },
      {
        title: '阅读次数',
        key: 'readTimes'
      },
      {
        title: '回复',
        key: 'answer'
      },
      {
        title: '更新时间',
        key: 'lastModifiedDate'
      }
    ];
    faqList = [];
    loading= false;
    pagination= {
      currentPage: 1,
      pageSize: 15,
      total: 0
    };
    options= {
      border: true
    };
    rowHandle= {
      edit: {
        text: '编辑',
        type: 'text'
      },

      remove: {
        text: '删除',
        type: 'text',
        confirm: true
      }
    };

    formOptions = {
      labelWidth: '120px',
      labelPosition: 'left',
      saveLoading: false
    }

    editTemplate = {
      question: {
        title: '常见问题标题',
        value: ''
      },
      answer: {
        title: '回复',
        value: ''
      }
    };

    addTemplate = {
      question: {
        title: '常见问题标题',
        value: ''
      },
      answer: {
        title: '回复',
        value: ''
      }
    };

    handleDialogCancel (done) {
      this.$message({
        message: '取消保存',
        type: 'warning'
      })
      done()
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getFaqs()
    }

    // 点击新增按钮
    addRow () {
      this.$refs.d2Crud.showDialog({
        mode: 'add'
      })
    }

    // 新增
    async addFaq (row, done) {
      this.formOptions.saveLoading = true

      let params = {
        question: row.question,
        answer: row.answer
      }
      let addRes = await axios.post(`/api/supervise/faqs`, params)
      if (addRes) {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        done()
        this.formOptions.saveLoading = false
        this.getFaqs()
      }
    }

    // 删除
    async removeFaq ({row}, done) {
      let delRes = await axios.delete(`/api/supervise/faqs/${row.id}`)
      console.log(delRes)
      if (delRes) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
        this.getFaqs()
      }
    }

    // 编辑
    async editFaq ({row}, done) {
      this.formOptions.saveLoading = true
      let params = {
        question: row.question,
        readTimes: row.readTimes,
        answer: row.answer
      }
      await axios.put(`/api/supervise/faqs/${row.id}`, params)

      this.$message({
        message: '修改成功',
        type: 'success'
      })
      done()
      this.formOptions.saveLoading = false
    }

    // 获取所有常见问题
    async getFaqs () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      let {data: faq} = await axios.get(`/api/supervise/faqs`, {params})
      console.log(faq)
      this.faqList = faq.list
      this.pagination.total = faq.total
      this.faqList.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
        item.lastModifiedDate = moment(item.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
        item.readTimes = item.readTimes || 0
      })
    }

    mounted () {
      this.getFaqs()
    }
  }
</script>

<style lang="scss">
  .faq-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .faq{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .title-add{
        padding: 0 15px;
        border-bottom: 1px solid #E9E9E9;

        .add-col{
          text-align: right;
          line-height: 60px;
        }
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
