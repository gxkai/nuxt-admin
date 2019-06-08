<template>
  <div class="add-wrap">
    <div class="drug-stock-create">
      <bread-crumb :path="$route.path"/>
      <div class="drug-stock-form">
        <el-form ref="form" :model="detailForm" label-width="200px" class="form1">
          <el-form-item label="药品封面图" class="el-form-item-upload">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :on-success="coverUploadSuccess">
              <img v-if="coverURL" :src="coverURL" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <div class="drugAdminDTO">
            <el-form ref="drugAdminDTO" :model="drugAdminDTO" :rules="rules" label-width="200px">
              <el-form-item label="药品名称" prop="name">
                <el-input v-model="drugAdminDTO.name" placeholder="请输入药品名称"></el-input>
              </el-form-item>
              <el-form-item label="通用名称" prop="commonName">
                <el-button class="select-btn" v-if="drugAdminDTO.commonName" type="middle" @click="commonDialogVisible = true">{{ drugAdminDTO.commonName }}</el-button>
                <el-button class="select-btn" v-else type="middle" @click="commonDialogVisible = true" style="color: #C0C4CC">请选择通用名称</el-button>
              </el-form-item>
              <el-form-item label="批准文号" prop="sfda">
                <el-input v-model="drugAdminDTO.sfda" placeholder="请输入批准文号"></el-input>
              </el-form-item>
              <el-form-item label="厂商名称" prop="originName">
                <el-button class="select-btn" v-if="drugAdminDTO.originName" type="middle" @click="originDialogVisible = true">{{ drugAdminDTO.originName }}</el-button>
                <el-button class="select-btn" v-else type="middle" @click="originDialogVisible = true" style="color: #C0C4CC">请选择厂商</el-button>
              </el-form-item>
              <el-form-item label="药品大类" prop="parentTypeNameString">
                <el-button class="select-btn" v-if="parentTypeNameString" type="middle" @click="parentTypeDialogVisible = true">{{ parentTypeNameString }}</el-button>
                <el-button class="select-btn" v-else type="middle" @click="parentTypeDialogVisible = true" style="color: #C0C4CC">请选择药品大类</el-button>
                <p style="display: none;">{{ parentTypeIdString }}</p>
              </el-form-item>
              <el-form-item label="药品小类" prop="childTypeNameString">
                <el-button class="select-btn child-type" v-if="childTypeNameString" type="middle" @click="childTypeDialogVisible = true">{{ childTypeNameString }}</el-button>
                <el-button class="select-btn" v-else type="middle" @click="childTypeDialogVisible = true" style="color: #C0C4CC">请选择药品大类</el-button>
                <p style="display: none;">{{ childTypeIdString }}</p>
              </el-form-item>
              <el-form-item label="规格" prop="spec">
                <el-button class="select-btn" v-if="drugAdminDTO.spec" type="middle" @click="specDialogVisible = true">{{ drugAdminDTO.spec }}</el-button>
                <el-button class="select-btn" v-else type="middle" @click="specDialogVisible = true" style="color: #C0C4CC">请选择规格</el-button>
              </el-form-item>
              <el-form-item label="剂型" prop="form">
                <el-button class="select-btn" v-if="drugAdminDTO.form" type="middle" @click="formDialogVisible = true">{{ drugAdminDTO.form }}</el-button>
                <el-button class="select-btn" v-else type="middle" @click="formDialogVisible = true" style="color: #C0C4CC">请选择剂型</el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-form-item label="otc 非处方药">
            <el-select v-model="detailForm.otc" placeholder="请选择">
              <el-option
                v-for="(item, index) in otcOptions"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否医保">
            <el-select v-model="detailForm.medicaid" placeholder="请选择">
              <el-option
                v-for="(item, index) in medicaidList"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="药品编码">
            <el-input v-model="detailForm.code" placeholder="请输入药品编码"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
            <el-input v-model="detailForm.brand" placeholder="请输入品牌"></el-input>
          </el-form-item>
          <el-form-item label="适应性/功能主治">
            <el-input
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 8}"
              placeholder="适应性/功能主治"
              v-model="detailForm.introduce">
            </el-input>
          </el-form-item>
          <el-form-item label="图片(最多上传四张)">
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
          </el-form-item>
        </el-form>
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
  export default class StockEdit extends Vue {
    isCloseOnClickModal = false
    commonDialogVisible = false
    specDialogVisible = false
    formDialogVisible = false
    originDialogVisible = false
    parentTypeDialogVisible = false
    childTypeDialogVisible = false
    dialogVisible = false
    detailForm = {}

    // 验证
    drugAdminDTO = {
      name: '',
      sfda: '',
      commonNameId: '',
      commonName: '',
      originId: '',
      originName: '',
      specId: '',
      spec: '',
      formId: '',
      form: ''
    }
    rules = {
      name: [{ required: true, message: '药品名不能为空', trigger: 'blur' }],
      commonName: [{ required: true, message: '通用名不能为空', trigger: 'change' }],
      sfda: [{ required: true, message: '批准文号不能为空', trigger: 'blur' }],
      originName: [{ required: true, message: '厂商不能为空' }],
      parentTypeNameString: [{ required: true, message: '药品大类不能为空' }],
      childTypeNameString: [{ required: true, message: '药品小类不能为空' }],
      spec: [{ required: true, message: '规格不能为空' }],
      form: [{ required: true, message: '剂型不能为空' }]
    }

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
      // console.log(data)
    }

    // 选择通用名
    confirmSelectCommonName () {
      if (!this.selectedInfo) {
        this.commonDialogVisible = false
        return
      }
      this.childData = this.selectedInfo
      this.drugAdminDTO.commonNameId = this.childData.id
      this.drugAdminDTO.commonName = this.childData.name
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
      this.drugAdminDTO.originId = this.childData.id
      this.drugAdminDTO.originName = this.childData.fullName
      this.originDialogVisible = false
      this.selectedInfo = ''
    }

    // 获取已选药品大类信息
    getParentTypeInfo (data) {
      // console.log(data)
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
      // console.log(data)
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
      this.drugAdminDTO.specId = this.childData.id
      this.drugAdminDTO.spec = this.childData.name
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
      this.drugAdminDTO.formId = this.childData.id
      this.drugAdminDTO.form = this.childData.name
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
        // console.log(coverFileId)
        this.coverFileId = coverFileId // 图片上传成功后更新fileId
      }

      // 展示图上传
      if (this.detailImg.length > 0) {
        const middle = this.detailImg
        const len = middle.length
        let fileId = ''
        for (let i = 0; i < len; i++) {
          if (middle[i].raw === undefined) { // 当前图片未重新选择，直接存储原有fileId即可
            fileId += middle[i].fileId
          } else {
            let detailParams = new FormData()
            detailParams.append('file', middle[i].raw)
            detailParams.append('fileType', 'LOGO')
            let {data: detailFileId} = await axios.post('/api/supervise/files', detailParams)
            fileId += `${detailFileId},` // 图片上传成功后更新fileId
          }
        }
        this.detailFileId = fileId.substring(0, fileId.length - 1)
      }

      this.drugAdminDTO = Object.assign(this.drugAdminDTO, {
        fileId: this.coverFileId,
        imgs: this.detailFileId,
        otc: this.detailForm.otc,
        drugTypeParent: this.parentTypeIdString, // 药品大类不能为空
        drugTypeName: this.parentTypeNameString,
        drugTypeId: this.childTypeIdString, // 药品小类不能为空
        drugTypeChildName: this.childTypeNameString,
        medicaid: this.detailForm.medicaid,
        code: [this.detailForm.code],
        brand: this.detailForm.brand,
        introduce: this.detailForm.introduce
      })

      console.log(this.drugAdminDTO)

      const valid = this.$refs.drugAdminDTO.validate()
      try {
        if (valid) {
          await axios.post(`/api/supervise/drugs`, this.drugAdminDTO)
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$router.push('/drugCheck/stock')
        }
      } catch (e) {
        if (e.response) {
          console.log(e.response)
        }
      } finally {
      }
    }

    // 返回
    backToList () {
      this.$router.push('/drugCheck/stock')
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
  .add-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .drug-stock-create{
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .drug-stock-form{
        padding: 20px 100px 0 0;
        &>.el-form{
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 170px 240px repeat(2, 60px) 200px 200px;
          .el-form-item{
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
            &:nth-child(1){
              grid-column: 1 / 3;
            }

            &:nth-child(7){
              grid-column: 1 / 3;
            }
            &:nth-child(8){
              grid-column: 1 / 3;
            }
          }

          .drugAdminDTO{
            grid-column: 1 / 3;
            .el-form{
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-template-rows: repeat(4, 60px);
              .el-form-item{
                &:nth-child(2n-1){
                  grid-column: 1 / 2;
                }
                &:nth-child(2n){
                  grid-column: 2 / 3;
                }
              }
            }
          }




        }
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
