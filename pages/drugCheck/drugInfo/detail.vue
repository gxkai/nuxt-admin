<template>
  <div class="edit-wrap">
    <div class="drug-stock-create">
      <bread-crumb :path="$route.path"/>
      <div class="drug-stock-form">
        <el-form ref="form" :model="detailForm" label-width="150px">
          <el-form-item label="药品名称：">
            <el-input v-model="detailForm.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="通用名称">
            <el-button class="select-btn" v-if="detailForm.commonName" type="middle" @click="commonDialogVisible = true">{{ detailForm.commonName }}</el-button>
            <el-button class="select-btn" v-else type="middle" @click="commonDialogVisible = true" style="color: #C0C4CC">请选择通用名称</el-button>
          </el-form-item>
          <el-form-item label="厂商简称">
            <el-button class="select-btn" v-if="detailForm.originName" type="middle" @click="originDialogVisible = true">{{ detailForm.originName }}</el-button>
            <el-button class="select-btn" v-else type="middle" @click="originDialogVisible = true" style="color: #C0C4CC">请选择厂商</el-button>
          </el-form-item>
          <el-form-item label="批准文号：">
            <el-input v-model="detailForm.sfda" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="药品大类">
            <el-button class="select-btn" v-if="parentTypeNameString" type="middle" @click="parentTypeDialogVisible = true">{{ parentTypeNameString }}</el-button>
            <el-button class="select-btn" v-else type="middle" @click="parentTypeDialogVisible = true" style="color: #C0C4CC">请选择药品大类</el-button>
            <p style="display: none;">{{ parentTypeIdString }}</p>
          </el-form-item>
          <el-form-item label="药品小类">
            <el-button class="select-btn child-type" v-if="childTypeNameString" type="middle" @click="childTypeDialogVisible = true">{{ childTypeNameString }}</el-button>
            <el-button class="select-btn" v-else type="middle" @click="childTypeDialogVisible = true" style="color: #C0C4CC">请选择药品大类</el-button>
            <p style="display: none;">{{ childTypeIdString }}</p>
          </el-form-item>
          <el-form-item label="药品类型：">
            <el-radio-group v-model="detailForm.otc">
              <el-radio :label="false">处方药</el-radio>
              <el-radio :label="true">OTC</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="规格">
            <el-button class="select-btn" v-if="detailForm.spec" type="middle" @click="specDialogVisible = true">{{ detailForm.spec }}</el-button>
            <el-button class="select-btn" v-else type="middle" @click="specDialogVisible = true" style="color: #C0C4CC">请选择规格</el-button>
          </el-form-item>
          <el-form-item label="剂型">
            <el-button class="select-btn" v-if="detailForm.form" type="middle" @click="formDialogVisible = true">{{ detailForm.form }}</el-button>
            <el-button class="select-btn" v-else type="middle" @click="formDialogVisible = true" style="color: #C0C4CC">请选择剂型</el-button>
          </el-form-item>
          <el-form-item label="是否医保：">
            <el-radio-group v-model="detailForm.medicaid">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="注意事项：">
            <el-input v-model="detailForm.drugNotice" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="条形码：">
            <el-input v-model="detailForm.barCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="功能主治：">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="detailForm.introduce">
            </el-input>
          </el-form-item>
        </el-form>

        <div class="check-image">
          <section>
            <strong>药品封面照</strong>
            <div>
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-success="coverUploadSuccess">
                <img v-if="coverURL" :src="coverURL" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </section>
          <section>
            <strong>展示图</strong>
            <div >
              <el-upload
                action=""
                list-type="picture-card"
                multiple
                :limit="4"
                :file-list="detailImg"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="childUploadSuccess">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl">
              </el-dialog>
            </div>
          </section>
        </div>
        <div class="check-form-btn">
          <el-button @click="backToList">返回</el-button>
          <el-button type="primary" @click="submitEdit">提交</el-button>
        </div>
      </div>

      <!--选择通用名称-->
      <el-dialog
        title="通用名称"
        :close-on-click-modal='isCloseOnClickModal'
        :visible.sync="commonDialogVisible"
        width="50%">
        <common-name v-on:listenToChildEvent="getSelectedInfo"></common-name>
        <span slot="footer" class="dialog-footer">
        <el-button @click="commonDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelectCommonName">确 定</el-button>
      </span>
      </el-dialog>

      <!--选择厂商-->
      <el-dialog
        title="厂商"
        :close-on-click-modal='isCloseOnClickModal'
        :visible.sync="originDialogVisible"
        width="50%">
        <drug-origin v-on:listenToChildEvent="getSelectedInfo"></drug-origin>
        <span slot="footer" class="dialog-footer">
        <el-button @click="originDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelectOrigin">确 定</el-button>
      </span>
      </el-dialog>

      <!--选择药品大类-->
      <el-dialog
        title="药品大类"
        :close-on-click-modal='isCloseOnClickModal'
        :visible.sync="parentTypeDialogVisible"
        width="50%">
        <drug-parentType v-on:listenToChildEvent="getParentTypeInfo"></drug-parentType>
        <span slot="footer" class="dialog-footer">
        <el-button @click="parentTypeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelectparentType">确 定</el-button>
      </span>
      </el-dialog>

      <!--选择药品小类-->
      <el-dialog
        title="药品小类"
        :close-on-click-modal='isCloseOnClickModal'
        :visible.sync="childTypeDialogVisible"
        width="50%">
        <drug-childType v-bind:parentData="parentType" v-on:listenToChildEvent="getChildTypeInfo"></drug-childType>
        <span slot="footer" class="dialog-footer">
        <el-button @click="childTypeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelectChildType">确 定</el-button>
      </span>
      </el-dialog>

      <!--选择规格-->
      <el-dialog
        title="规格"
        :close-on-click-modal='isCloseOnClickModal'
        :visible.sync="specDialogVisible"
        width="50%">
        <drug-spec v-on:listenToChildEvent="getSelectedInfo"></drug-spec>
        <span slot="footer" class="dialog-footer">
        <el-button @click="specDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelectSpec">确 定</el-button>
      </span>
      </el-dialog>

      <!--选择剂型-->
      <el-dialog
        title="剂型"
        :close-on-click-modal='isCloseOnClickModal'
        :visible.sync="formDialogVisible"
        width="50%">
        <drug-form v-on:listenToChildEvent="getSelectedInfo"></drug-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="formDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelectForm">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import CommonName from '@/components/drugCheck/CommonName'
  import Spec from '@/components/drugCheck/Spec'
  import Form from '@/components/drugCheck/Form'
  import Origin from '@/components/drugCheck/Origin'
  import ParentType from '@/components/drugCheck/type/index'
  import ChildType from '@/components/drugCheck/type/child'
  import axios from 'axios'

  @Component({
    components: {
      BreadCrumb,
      'common-name': CommonName,
      'drug-spec': Spec,
      'drug-form': Form,
      'drug-origin': Origin,
      'drug-parentType': ParentType,
      'drug-childType': ChildType
    }
  })
  export default class DrugInfoEdit extends Vue {
    isCloseOnClickModal = false
    commonDialogVisible = false
    specDialogVisible = false
    formDialogVisible = false
    originDialogVisible = false
    parentTypeDialogVisible = false
    childTypeDialogVisible = false
    dialogVisible = false
    detailForm = {}

    // 封面图
    coverFileId = ''
    coverURL = ''
    coverURLJudeg = ''
    coverObj = ''

    // 展示图
    dialogImageUrl = ''
    detailImg = []
    detailFileId = ''

    // 下拉弹框
    selectedInfo = ''
    typeInfo = [] // 存储大类信息
    parentType = [] // 暂存大类信息
    childInfo = [] // 存储小类信息
    childData = [] // 暂存已选信息
    drugID = ''
    parentTypeNameString = ''
    parentTypeIdString = ''
    childTypeNameString = ''
    childTypeIdString = ''

    // 是否是处方药
    otcOptions = [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]

    // 是否医保
    medicaidList = [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]

    // 获取已选信息
    getSelectedInfo (data) {
      this.selectedInfo = data
    }

    // 选择通用名
    confirmSelectCommonName () {
      if (!this.selectedInfo) {
        this.commonDialogVisible = false
        return
      }
      this.childData = this.selectedInfo
      this.detailForm.commonNameId = this.childData.id
      this.detailForm.commonName = this.childData.name
      this.commonDialogVisible = false
      this.selectedInfo = ''
    }

    // 选择厂商
    confirmSelectOrigin () {
      if (!this.selectedInfo) {
        this.originDialogVisible = false
        return
      }
      this.childData = this.selectedInfo
      this.detailForm.originId = this.childData.id
      this.detailForm.originName = this.childData.fullName
      this.originDialogVisible = false
      this.selectedInfo = ''
    }

    // 获取已选药品大类信息
    getParentTypeInfo (data) {
      console.log(data)
      this.typeInfo = data
    }

    // 选择药品大类
    confirmSelectparentType () {
      if (!this.typeInfo.length) {
        this.parentTypeDialogVisible = false
        return
      }

      let pName = ''
      let PId = ''
      this.parentType = this.typeInfo
      this.parentTypeNameString = ''
      this.parentTypeIdString = ''
      for (let i = 0, len = this.parentType.length; i < len; i++) {
        if (i === len - 1) {
          pName += `${this.parentType[i].type}`
          PId += `${this.parentType[i].id}`
          break
        }
        pName += `${this.parentType[i].type},`
        PId += `${this.parentType[i].id},`
      }

      this.parentTypeNameString = pName
      this.parentTypeIdString = PId
      this.parentTypeDialogVisible = false
    }

    // 获取已选药品小类信息
    getChildTypeInfo (data) {
      console.log(data)
      this.childInfo = data
    }

    // 选择药品小类
    confirmSelectChildType () {
      let cName = ''
      let cId = ''

      if (!this.childInfo.length) {
        this.childTypeDialogVisible = false
        return
      }

      this.childData = this.childInfo
      this.childTypeNameString = ''
      this.childTypeIdString = ''

      this.childData.forEach(item => {
        if (item.length === undefined) {
          cName += `${item.type},`
          cId += `${item.id},`
        } else {
          item.forEach(ele => {
            cName += `${ele.type},`
            cId += `${ele.id},`
          })
        }
      })

      this.childTypeNameString = cName.substring(0, cName.length - 1)
      this.childTypeIdString = cId.substring(0, cId.length - 1)
      this.childTypeDialogVisible = false
    }

    // 选择规格
    confirmSelectSpec () {
      if (!this.selectedInfo) {
        this.specDialogVisible = false
        return
      }
      this.childData = this.selectedInfo
      this.detailForm.specId = this.childData.id
      this.detailForm.spec = this.childData.name
      this.specDialogVisible = false
      this.selectedInfo = ''
    }

    // 选择剂型
    confirmSelectForm () {
      if (!this.selectedInfo) {
        this.formDialogVisible = false
        return
      }
      this.childData = this.selectedInfo
      this.detailForm.formId = this.childData.id
      this.detailForm.form = this.childData.name
      this.formDialogVisible = false
      this.selectedInfo = ''
    }

    // 封面图片上传
    coverUploadSuccess (res, file) {
      this.coverURL = URL.createObjectURL(file.raw)
      this.coverObj = file.raw // 上传图片提交该对象
    }

    // 展示图片上传
    childUploadSuccess (res, file, fileList) {
      this.detailImg = fileList
    }

    // 删除展示图
    handleRemove (file, fileList) {
      console.log(file, fileList)
    }

    // 查看图片放大
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }

    // 提交
    async submitEdit () {
      // 封面图片上传
      if (this.coverURLJudeg !== this.coverURL) {
        let coverParams = new FormData()
        coverParams.append('file', this.coverObj)
        coverParams.append('fileType', 'LOGO')
        let {data: coverFileId} = await axios.post('/api/supervise/files', coverParams)
        console.log(coverFileId)
        this.coverFileId = coverFileId // 图片上传成功后更新fileId
      }

      // 展示图上传
      if (this.detailImg.length > 0) {
        const middle = this.detailImg
        const len = middle.length
        let fileId = ''
        for (let i = 0; i < len; i++) {
          if (middle[i].raw === undefined) { // 当前图片未重新选择，直接存储原有fileId即可
            fileId += `${middle[i].fileId},`
          } else {
            let detailParams = new FormData()
            detailParams.append('file', middle[i].raw)
            detailParams.append('fileType', 'LOGO')
            let {data: detailFileId} = await axios.post('/api/supervise/files', detailParams)
            fileId += `${detailFileId},` // 图片上传成功后更新fileId
          }
        }
        console.log(fileId)
        this.detailFileId = fileId.substring(0, fileId.length - 1)
      }

      let params = {
        fileId: this.coverFileId,
        imgs: this.detailFileId,
        name: this.detailForm.name,
        commonNameId: this.detailForm.commonNameId,
        commonName: this.detailForm.commonName,
        sfda: this.detailForm.sfda,
        originId: this.detailForm.originId,
        originName: this.detailForm.originName,
        otc: this.detailForm.otc,
        drugTypeParent: this.parentTypeIdString,
        drugTypeName: this.parentTypeNameString,
        drugTypeId: this.childTypeIdString,
        drugTypeChildName: this.childTypeNameString,
        specId: this.detailForm.specId,
        spec: this.detailForm.spec,
        formId: this.detailForm.formId,
        form: this.detailForm.form,
        medicaid: this.detailForm.medicaid,
        code: this.detailForm.code,
        brand: this.detailForm.brand,
        introduce: this.detailForm.introduce
      }

      await axios.put(`/api/supervise/drugs/${this.drugID}`, params)
      this.$message({
        message: '提交成功',
        type: 'success'
      })
      this.$router.go(-1)
    }

    // 返回
    backToList () {
      this.$router.push('/drugCheck/drugInfo')
    }

    async getDrugDetail () {
      // let params = new FormData()
      // params.append('id', this.drugID)
      let {data: detail} = await axios.get(`/api/supervise/drugApplies/${this.drugID}`)
      console.log('detail: ')
      console.log(detail)
      this.detailForm = detail
      this.coverFileId = detail.fileId
      this.detailFileId = detail.imgs
      this.parentType = detail.drugDrugTypeParentList

      let childTypeList = detail.drugDrugTypeList
      let cName = ''
      let cId = ''
      childTypeList.forEach(item => {
        cName += `${item.type},`
        cId += `${item.id},`
      })

      this.childTypeNameString = cName.substring(0, cName.length - 1)
      this.childTypeIdString = cId.substring(0, cId.length - 1)

      let pName = ''
      let pId = ''
      this.parentType.forEach(item => {
        pName += `${item.type},`
        pId += `${item.id},`
      })

      this.parentTypeNameString = pName.substring(0, pName.length - 1)
      this.parentTypeIdString = pId.substring(0, pId.length - 1)

      let imgParams = {
        resolution: 'LARGE_LOGO'
      }
      // 获取封面图片
      if (this.detailForm.fileId) {
        let {data: cover} = await axios.get(`/api/supervise/files/${this.detailForm.fileId}`, {imgParams})
        this.coverURL = cover.replace('redirect:', '')
        this.coverURLJudeg = this.coverURL
      }

      // 获取展示图
      if (this.detailForm.imgs) {
        let childImgs = this.detailForm.imgs.split(',')
        for (let i = 0, len = childImgs.length; i < len; i++) {
          let {data: detailImg} = await axios.get(`/api/supervise/files/${childImgs[i]}`, {imgParams})
          let url = detailImg.replace('redirect:', '')
          if (url.substring(url.lastIndexOf('/') + 1, url.length) !== 'null') {
            this.detailImg.push({
              url: url,
              fileId: childImgs[i]
            })
          }
        }
      }
    }

    beforeMount () {
      this.drugID = this.$route.query.id
      this.getDrugDetail()
    }
  }
</script>

<style lang="scss">
  .child-type{
    height: 40px;
    span {
      width: 40%;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      position: absolute;
      top: 13px;
    }
  }
</style>

<style scoped lang="scss">
  .edit-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .drug-stock-create{
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .drug-stock-form{
        margin-right: 150px;
        .el-form{
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(6, 50px) 120px;
          .el-form-item{
            &:last-child{
              grid-column: 1/3;
            }
          }
          .drug-class{
            width: 100%;
            height: 40px;
            text-align: left;
            padding: 12px 15px;
          }
        }
      }

      .drug-stock-form{
        margin-right: 150px;
        padding-top: 20px;
        .el-form{
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(6, 55px) 120px;
          .el-form-item{
            &:last-child{
              grid-column: 1/3;
            }

            .select-btn{
              width: 100%;
              color: #606266;
              text-align: left;
              padding-left: 15px;
              border-color: #DCDFE6;
              background-color: #FFF;

              &:hover{
                border-color: #C0C4CC;
              }
            }

            .el-select{
              width: 100%;
            }
          }
        }
      }
    }
  }

  .check-image{
    margin: 20px 50px 0;
    display: grid;
    grid-template-columns: 25% 75%;
    grid-template-rows: 250px;
    section{
      strong{
        display: block;
        line-height: 3;
        font-size: 16px;
      }
    }
  }

  .avatar-uploader{
    margin-right: 30px;
    position: relative;
    .uploade-text{
      position: absolute;
      width: 100%;
      text-align: center;
      left: 0;
      bottom: 10px;
      color: #666;
    }
  }
  .check-form-btn{
    display: flex;
    justify-content: center;
    padding: 50px;
  }
  /*
    element reset
   */
  /deep/.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  /deep/.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  /deep/.avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>
