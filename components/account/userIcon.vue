<template>
  <div class="icon-wrap">
    <el-upload
      class="avatar-uploader"
      action=""
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
    >
      <img v-if="iconURL" :src="iconURL" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'

  @Component({
    props: {
      imgURL: ''
    }
  })
  export default class UserIcon extends Vue {
    iconURL = this.imgURL

    handleAvatarSuccess (res, file) {
      this.iconURL = URL.createObjectURL(file.raw)
      this.$emit('renderURL', this.iconURL)
      this.$emit('iconFile', file.raw)
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

  /deep/ .avatar-uploader{
    img{
      width: 70px;
      height: 70px;
    }
  }
</style>
