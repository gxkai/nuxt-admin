<template>
  <div class="headbar">
    <header class="header" ref="header">
      <el-row>
        <el-col :span="5">
          <div class="nav-icon" :class="{hide: !isMenuHidden}" @click="toggleMenu">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </el-col>
        <el-col :offset="11" :span="3">
          <p v-if="!!displayName">
            <el-tooltip :content="displayName">
              <a href="javascript:void(0)" class="userIcon">
                <img :src="iconURL" />
              </a>
            </el-tooltip>
            <span> {{displayName}}</span>
          </p>
        </el-col>
        <el-col :span="3">
          <p @click="$router.push('/account/editPwd')">
            <el-tooltip :content="$t('head.pwd')">
              <img src="~/assets/img/pwd.svg">
            </el-tooltip>
            <span> {{$t("head.pwd")}}</span>
          </p>
        </el-col>
        <el-col :span="2">
          <p @click="logout">
            <img src="~/assets/img/exit.svg"></img>
            <span> {{$t("head.exit")}}</span>
          </p>
        </el-col>
      </el-row>
    </header>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapActions } from 'vuex'
  import Component, { Getter } from 'class-component'
  import {getUser} from '@/mixins'
  import axios from 'axios'

  @Component({
    methods: {
      ...mapActions(['toggleMenu'])
    },
    components: {
    }
  })
  export default class Headbar extends Vue {
    @Getter isMenuHidden
    authUser = ''
    displayName = ''
    emptyIcon = require('~/assets/img/avatar.svg')
    iconURL = ''

    async created () {
      let user = await getUser()
      this.displayName = user.name
      this.authUser = user
      let {data} = await axios.get(`/api/supervise/files/${user.fileId}`, {params: {resolution: 'SMALL_LOGO'}})
      console.log(data)
      let iconURL = data.replace('redirect:', '')
      let isNull = iconURL.substring(iconURL.lastIndexOf('/') + 1, iconURL.length)

      if (isNull === 'null') {
        this.iconURL = this.emptyIcon
      } else {
        this.iconURL = iconURL
      }
    }
    async logout () {
      await this.$store.dispatch('logout', async () => {
        await this.$router.push('/login')
      })
    }
  }
</script>

<style lang="scss" scoped>
  .headbar {
    height: 60px;
    position: relative;
    .header {
      @media (max-width: 768px) {
        .el-col p span {
          display: none;
        }
      }
      .el-col:nth-child(2),
      .el-col:nth-child(3),
      .el-col:nth-child(4) {
        cursor: pointer;
        color: #5e6d82;
        border-left: 1px solid #c0ccda;
        p {
          margin: 0 auto;
          padding: 0 10px;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis ;
          img {
            vertical-align:middle
          }
        }
      }
      width: 100%;
      height: 60px;
      z-index: 100;
      line-height: 60px;
      border-bottom: 1px solid #c0ccda;
      transition: all 0.5s ease;

      .userIcon{
        img{
          width: 45px;
          height: 45px;
          margin-right: 10px;
          border-radius: 50%;
        }
      }
    }
  }
</style>
