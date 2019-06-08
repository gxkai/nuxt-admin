<template>
  <div class="common--content">
    <el-tabs v-model="tabActiveName" type="card" v-if="parentTypeInfo">
      <el-tab-pane :label="item.type" :name="item.activeName" v-for="(item, index) in parentTypeInfo" :key="index">
        <d2-crud
          ref="d2Crud"
          :columns="columns"
          :data="childTypeList[index] || []"
          :options="options"
          selection-row
          :selection-row="selectionRow"
          @selection-change="handleSelectionChange"
          class="drug-table"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import axios from 'axios'

  @Component({
    props: {
      parentData: {}
    },
    computed: {
      parentTypeInfo () {
        this.childTypeList = []
        this.selectedTypeList = []
        this.setActiveName(this.parentData)
        this.tabActiveName = 'first'
        this.fetchData(this.parentData)
        return this.parentData
      }
    }
  })
  export default class TypeChild extends Vue {
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 50,
        align: 'center'
      },
      {
        title: '类型名称',
        key: 'type',
        align: 'center'
      }
    ]
    options = {
      border: true
    }
    selectionRow = {
      align: 'center'
    }
    childTypeList = []
    selectedTypeList = []

    tabActiveName = ''
    setActiveName (parentData) {
      parentData.forEach((item, index) => {
        item.activeName = this.getActiveName(index)
      })
    }

    getActiveName (index) {
      switch (index) {
        case 0:
          return 'first'
        case 1:
          return 'second'
        case 2:
          return 'third'
        case 3:
          return 'fourth'
        case 4:
          return 'fifth'
      }
    }

    handleSelectionChange (selection) {
      if (selection.length) {
        if (this.parentTypeInfo.length > 1) {
          // console.log(this.selectedTypeList)
          if (this.selectedTypeList.length === 0) {
            this.selectedTypeList.push(selection)
          } else {
            this.selectedTypeList.forEach((item, index) => {
              if (item[0].parent === selection[0].parent) {
                this.selectedTypeList[index] = selection
              } else {
                this.selectedTypeList.push(selection)
              }
            })
          }
          let set = Array.from(new Set(this.selectedTypeList)) // 去重
          this.$emit('listenToChildEvent', set)
        } else {
          this.$emit('listenToChildEvent', selection)
        }
      }
    }

    async fetchData (parentTypeInfo) {
      for (let i = 0, len = parentTypeInfo.length; i < len; i++) {
        let {data: childData} = await axios.get(`/api/supervise/drugTypes/${parentTypeInfo[i].id}/children`)
        childData.forEach((item, index) => {
          item.index = index + 1
          item.parent = parentTypeInfo[i].id
        })
        this.childTypeList.push(childData)
      }
    }
    beforeMount () {
    }
  }
</script>

<style lang="scss" scoped>
  .common--content{
    padding: 0 10px;
    &__search{
      display: flex;
      justify-content: Flex-start;
      align-items: center;
      .el-input{
        margin: 0 10px;
      }
    }
  }
  /deep/.drug-table{
    .el-table{
      th{
        background-color: #F4F4F4 !important;
        color: #555 !important;
      }
      td{
        .cell{
          /deep/.el-button+.el-button{
            margin-left: 5px;
            &::before{
              content: '|';
              padding-right: 5px;
              color: #eee;
            }
          }
        }
      }
    }
  }
</style>
