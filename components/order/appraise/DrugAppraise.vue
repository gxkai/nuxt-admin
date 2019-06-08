<template>
  <div class="appraise-wrap">
    <div class="appraise">
      <bread-crumb :path="$route.path"/>

      <div class="appraise-con">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="药店评价" name="first" class="pharmacy-appraise">
            <div class="filter">
              <el-row :gutter="20">
                <el-col :span="5">
                  <el-select v-model="value1" clearable filterable placeholder="药房名称">
                    <el-option
                      v-for="item in list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="inputValue" placeholder="买家姓名"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-col>
                <el-col :span="6" class="action-col">
                  <el-button size="small" type="primary">搜索</el-button>
                  <el-button size="small">清空</el-button>
                </el-col>
              </el-row>
            </div>

            <div class="pharmacy-appraise__list">
              <d2-crud
                :columns="pharmacyColumn"
                :data="pharmacyData"
                :pagination="pharmacyPagination"
                :options="optionData"
                :rowHandle="pharmacyRowHandle"
                @row-remove="pharmacyHandleRowRemove"/>
            </div>
          </el-tab-pane>

          <el-tab-pane class="drug-appraise" label="药品评价" name="second">
            <div class="filter">
              <el-row :gutter="20">
                <el-col :span="5">
                  <el-select v-model="value2" clearable filterable placeholder="药房名称">
                    <el-option
                      v-for="item in list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                    </el-select>
                  </el-col>
                <el-col :span="4">
                  <el-input v-model="drugNameValue" placeholder="药品名称"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="buyerNameValue" placeholder="买家姓名"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-col>
                <el-col :span="5" class="action-col">
                  <el-button size="small" type="primary">搜索</el-button>
                  <el-button size="small">清空</el-button>
                </el-col>
              </el-row>
            </div>

            <div class="drug-appraise__list">
              <d2-crud
                :columns="drugColumn"
                :data="drugData"
                :pagination="drugPagination"
                :loading="loading"
                :options="optionData"

                :rowHandle="drugRowHandle"
                @row-remove="removeDrugAppraise"
                @viewDetail-emit="viewDetail"/>
            </div>
          </el-tab-pane>
        </el-tabs>
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
  export default class Appraise extends Vue {
    activeTab = 'first';
    value2 = '';
    value1 = '';
    inputValue = '';
    dateValue = '';
    drugNameValue = '';
    buyerNameValue = '';

    list = [
      {
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }
    ];

    optionData= {
      border: true
    };

    // 药店评价信息
    pharmacyColumn = [
      {
        title: '药店名称',
        key: 'pharmacyName'
      },
      {
        title: '买家姓名',
        key: 'buyerName'
      },
      {
        title: '配送评分',
        key: 'deliveryRating'
      },
      {
        title: '服务态度',
        key: 'attitude'
      },
      {
        title: '描述相符',
        key: 'descMatch'
      },
      {
        title: '包装评分',
        key: 'packageRating'
      },
      {
        title: '评价时间',
        key: 'evaluationTime'
      }
    ];

    pharmacyData = [
      {
        pharmacyName: '百佳惠',
        buyerName: '顾旭凯',
        deliveryRating: '5.0',
        attitude: '5.0',
        descMatch: '5.0',
        packageRating: '5.0',
        evaluationTime: '2019-03-11 16:00:09'
      }
    ];

    pharmacyPagination = {
      currentPage: 1,
      pageSize: 1,
      total: this.pharmacyData.length
    };

    pharmacyRowHandle = {
      remove: {
        text: '删除',
        type: 'text'
      }
    };

    pharmacyHandleRowRemove ({ index, row }, done) {
      setTimeout(() => {
        // console.log(index)
        // console.log(row)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
      }, 300)
    }

    // 药品评价信息
    drugColumn = [
      {
        title: '药房名称',
        key: 'pharmacyName'
        // width: '150'
      },
      {
        title: '药品名称',
        key: 'buyerName'
        // width: '220'
      },
      {
        title: '药品规格',
        key: 'deliveryRating'
        // width: '250'
      },
      {
        title: '买家姓名',
        key: 'attitude'
        // width: '100'
      },
      {
        title: '药品评分',
        key: 'descMatch'
        // width: '100'
      },
      {
        title: '评价内容',
        key: 'packageRating'
        // width: '320'
      },
      {
        title: '评论时间',
        key: 'evaluationTime'
        // width: '180'
      }
    ];

    drugData = [
      {
        pharmacyName: '百佳惠',
        buyerName: '小儿氨酚黄那敏颗粒',
        deliveryRating: '0.125g(以对乙酰氨基酚计)*10',
        attitude: '顾旭凯',
        descMatch: '5.0',
        packageRating: '111',
        evaluationTime: '2019-03-11 16:00:09'
      },
      {
        pharmacyName: '百佳惠',
        buyerName: '小儿氨酚黄那敏颗粒',
        deliveryRating: '0.125g(以对乙酰氨基酚计)*10',
        attitude: '顾旭凯',
        descMatch: '5.0',
        packageRating: '111',
        evaluationTime: '2019-03-11 16:00:09'
      },
      {
        pharmacyName: '百佳惠',
        buyerName: '小儿氨酚黄那敏颗粒',
        deliveryRating: '0.125g(以对乙酰氨基酚计)*10',
        attitude: '顾旭凯',
        descMatch: '5.0',
        packageRating: '111',
        evaluationTime: '2019-03-11 16:00:09'
      }
    ];

    loading = false;

    drugPagination = {
      currentPage: 1,
      pageSize: 1,
      total: this.drugData.length
    };

    drugRowHandle = {
      custom: [
        {
          text: '查看详情',
          type: 'text',
          class: 'viewBtn',
          emit: 'viewDetail-emit'
        }
      ],
      remove: {
        text: '删除',
        type: 'text'
      }
    };

    removeDrugAppraise ({ index, row }, done) {
      setTimeout(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
      }, 300)
    }

    // 查看详情处理方法
    viewDetail ({index, row}) {
      this.$router.push('/order/appraise/detail')
    }

    mounted () {
    }
  }
</script>

<style lang="scss">
  .appraise-wrap{
    padding: 20px;

    .el-table {
      th {
        background-color: #F4F4F4;
        color: #555;
      }
    }

    .appraise{
      min-height: 850px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;
      padding: 20px;

      .el-select{
        width: 100%;
      }

      .action-col{
        line-height: 40px;
      }

      .drug-appraise__list{
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
  }
</style>
