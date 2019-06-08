<template>
  <div class="common-wrap">
    <div class="common-list">
      <bread-crumb :path="$route.path"/>
      <h3 class="h3-title">日对账单</h3>

      <div class="simple-detail">
        <h2 class="h2-title">2018年4月3日汇总账单</h2>

        <table cellspacing="0" cellpadding="0" class="table1">
          <tr>
            <td>店铺名称：XXXXXXX</td>
            <td>币种：人民币</td>
          </tr>
          <tr>
            <td>起始日期：2018-04-03 00：00</td>
            <td>截至日期：2018-04-03 23：59：59</td>
          </tr>
        </table>

        <table width="100%" cellspacing="0" cellpadding="0" class="table2">
          <tr>
            <th>上期余额</th>
            <th>本期收入</th>
            <th>本期支出</th>
            <th>本期余额</th>
          </tr>
          <tr>
            <td>100</td>
            <td>10</td>
            <td>1</td>
            <td>95</td>
          </tr>
        </table>

        <div class="table3">
          <div class="table3-left">
            <h4>本期收入</h4>
            <table>
              <tr>
                <td><strong>业务类型</strong></td>
                <td><strong>收入金额</strong></td>
              </tr>
              <tr>
                <td>交易收入</td>
                <td>100</td>
              </tr>
              <tr>
                <td>交易手续费补贴</td>
                <td>10</td>
              </tr>
              <tr>
                <td>合计收入</td>
                <td>110</td>
              </tr>
            </table>
          </div>
          <div class="table3-left table3-right">
            <h4>本期支出</h4>
            <table>
              <tr>
                <td><strong>业务类型</strong></td>
                <td><strong>支出金额</strong></td>
              </tr>
              <tr>
                <td>退单</td>
                <td>-10</td>
              </tr>
              <tr>
                <td>合计支出</td>
                <td>-10</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="back-btn">
          <el-button @click="back">返回</el-button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  // import axios from 'axios'
  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class DaySimpleDetails extends Vue {
    back () {
      this.$router.go(-1)
    }
  }
</script>

<style lang="scss" scoped>
  .common {
    &-wrap {
      padding: 0 10px;
      margin-bottom: 30px;
    }
    &-list{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .h3-title{
        border-bottom: 1px solid #E9E9E9;
        padding: 0 15px 15px 15px;
        margin: 15px 0;
      }

      .simple-detail{
        width: 80%;
        margin: 30px auto;
        .h2-title{
          text-align: center;
          line-height: 3;
        }
        
        .table1{
          width: 80%;
          margin: 0 auto 30px;
          td{
            text-align: left;
            font-size: 16px;
            color: #333333;
            padding: 10px;
          }
        }

        .table2{
          width: 80%;
          margin: 20px auto;
          border: 1px solid #E9E9E9;
          border-left: none;
          font-size: 15px;
          th{
            background: #F4F4F4;
            padding: 15px;
            border-left: 1px solid #E9E9E9;
          }
          td{
            text-align: center;
            padding: 10px;
            border-left: 1px solid #E9E9E9;
          }
        }

        .table3{
          width: 80%;
          margin: 20px auto;
          overflow: auto;
          zoom: 1;
          .table3-left{
            float: left;
            width: 50%;
            h4{
              font-size: 20px;
            }
            table{
              width: 100%;
              font-size: 16px;
              td{
                padding: 8px 0;
              }
            }
          }
        }

        .back-btn{
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }
        
      }


    }

  }
</style>
