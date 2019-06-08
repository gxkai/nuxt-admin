<template>
  <div class="detail--wrap">
    <div class="main-con">
      <bread-crumb :path="$route.path"/>
      <div class="chatDetail">
        <ul>
          <li v-for="(item, index) in detailList" :key="index">
            <div class="account" v-if="item.type === 'ACCOUNT'">
              <p class="date">{{ item.createdDate }}</p>
              <div class="main" :class="item.messageType === 'PIC' ? 'pic' : ''">
                <span class="name">{{ item.accountName }}</span>
                <span v-if="item.messageType === 'TEXT'" class="text">
                {{ item.message }}
              </span>
                <span v-else class="img">
                <img :src="item.picUrl">
              </span>
              </div>
            </div>

            <div class="pharmacist" v-else>
              <p class="date">{{ item.createdDate }}</p>
              <div class="main" :class="item.messageType === 'PIC' ? 'pic' : ''">
              <span v-if="item.messageType === 'TEXT'" class="text">
                {{ item.message }}
              </span>
                <span v-else class="img">
                <img :src="item.picUrl">
              </span>
                <span class="name">{{ item.userName }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper, total"
          :total="totalPages">
        </el-pagination>
      </div>

      <div class="back">
        <el-button @click="$router.push('/business/chat/list')">返回</el-button>
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
  export default class ChatDetail extends Vue {
    currentPage = 1; // 当前页
    pageSize = 15; // 每页显示条数
    totalPages = 0;
    chatID = ''
    detailList = []

    handleCurrentChange (page) {
      this.currentPage = page
      this.getDetail(this.chatID)
    }

    async getDetail (id) {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      let {data: detail} = await axios.get(`/api/supervise/chats/${id}`, {params})
      console.log(detail)
      this.detailList = detail.list
      this.totalPages = detail.total

      this.detailList.forEach(item => {
        item.createdDate = moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
      })
    }

    mounted () {
      this.chatID = this.$route.query.id
      this.getDetail(this.chatID)
    }
  }
</script>

<style scoped lang="scss">
  .detail--wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .main-con{
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .back{
        text-align: center;
      }
    }
  }

  /deep/.pagination{
    margin: 30px 0;
    .el-pagination__total{
      float: right;
    }
  }

  .chatDetail {
    width: 80%;
    height: 600px;
    margin-left: 10px;
    padding: 10px;
    overflow-y: scroll;
    background: #eee;
    ul{
      padding: 0 15px;

      li {
        margin-bottom: 20px;
        list-style: none;

        .date{
          color: #aaa;
          font-size: 15px;
          text-align: center;
        }

        .main{
          &.pic{
            display: flex;
          }
          .name{
            font-size: 14px;
            padding-right: 15px;
          }

          .img{
            img{
              width: 100px;
              border-radius: 5px;
            }
          }

          .text {
            display: inline-block;
            position: relative;
            padding: 0 10px;
            max-width: 90%;
            min-height: 30px;
            line-height: 2.5;
            font-size: 12px;
            text-align: left;
            word-break: break-all;
            background-color: #fafafa;
            border-radius: 4px;

            &:before {
              content: " ";
              position: absolute;
              top: 9px;
              right: 100%;
              border: 6px solid transparent;
              border-right-color: #fafafa;
            }
          }
        }

        .pharmacist{
          .main{
            text-align: right;

            .name{
              padding-right: 0;
              padding-left: 15px;
            }

            .text{
              &:before{
                right: -6px;
                border-right: transparent;
                border-left-color: #fafafa;
              }
            }
          }
        }
      }
    }

    .avatar {
      float: left;
      margin: 0 10px 0 0;
      border-radius: 3px;
    }
  }
</style>
