<template>
    <div class="driver-detail-module">
      <div class="driver-detail-key">
        {{detailName}}
      </div>
      <div class="driver-detail-value">
        <!------------------文字类型------------------------------>
        <div v-if="detailType === 'text'">
          <div v-if="!showEdit">
            <span>{{detailValue}}</span>
            <el-button type="normal" icon="el-icon-edit" size="mini" @click="doEdit" circle class="close-btn" v-if="couldEdit"></el-button>
          </div>
          <div v-if="showEdit" class="driver-detail-value-module">
            <el-input v-model="editValue"></el-input>
            <el-button type="danger" icon="el-icon-close" @click="doShow" size="mini" circle class='close-btn close-btn-off'></el-button>
          </div>
        </div>
        <!------------------时间类型------------------------------>
        <div v-if="detailType==='dateString'">
          <div v-if="!showEdit">
            <span>{{detailValue}}</span>
            <el-button type="normal" icon="el-icon-edit" size="mini" @click="doEdit" circle class="close-btn"  v-if="couldEdit"></el-button>
          </div>
          <div v-if="showEdit" class="driver-detail-value-module">
            <el-date-picker
              v-model="editValue"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
            <el-button type="danger" class='close-btn close-btn-off' icon="el-icon-close" @click="doShow" circle></el-button>
          </div>
        </div>
        <!----------------------------选择框------------------------------------->
        <div v-if="detailType==='checkStatus'">
          <div v-if="!showEdit">
            <!--<span>{{options.find(item => item.value === detailValue)}}</span>-->
            <span>{{optionLabel}}</span>
            <el-button type="normal" icon="el-icon-edit" size="mini" @click="doEdit" circle class="close-btn" v-if="couldEdit"></el-button>
          </div>
          <div v-if="showEdit" class="driver-detail-value-module">
            <el-select v-model="editValue" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="danger" size="mini" class='close-btn close-btn-off' icon="el-icon-close" @click="doShow" circle></el-button>
          </div>
        </div>
        <!----------------------------图片类型------------------->
        <div v-if="detailType === 'img'">
          <div v-if="!showEdit" class="driver-detail-imgList">
            <!--未编辑时的显示-->
            <img :src="imgSrc+k" alt="" v-if="detailValue !== null"
                 v-for="k in imgList" class="cerImg" @click="preView(k)">
            <img  class="cerImg" src="../../assets/img/img_notloaded.png" alt="" v-else>
            <el-button type="normal" icon="el-icon-edit" size="mini" @click="doEdit" circle class="close-btn" v-if="couldEdit"></el-button>
          </div>
          <div v-if="showEdit" class="driver-detail-value-module driver-detail-value-img">
            <el-upload
              :action='src'
              :limit="2"
              name="file"
              :file-list="imgList.length>0?[{url:imgSrc+imgList[0]},{url:imgSrc+imgList[1]}]:[]"
              :with-credentials="true"
              list-type="picture-card"
              :on-preview="previewImg"
              :on-success='subImg'
              :before-remove='rmImg'
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-button type="danger" size="mini" class='close-btn close-btn-off' icon="el-icon-close" @click="doShow" circle></el-button>
          </div>
        </div>
        <!----------------------------图片类型2------------------->
        <div v-if="detailType === 'img2'">
          <div v-if="!showEdit" class="driver-detail-imgList">
            <!--未编辑时的显示-->
            <img :src="imgSrc+k" alt="" v-if="detailValue !== null"
                 v-for="k in imgList" class="cerImg" @click="preView(k)">
            <img  class="cerImg" src="../../assets/img/img_notloaded.png" alt="" v-else>
            <el-button type="normal" icon="el-icon-edit" size="mini" @click="doEdit" circle class="close-btn" v-if="couldEdit"></el-button>
          </div>
          <div v-if="showEdit" class="driver-detail-value-module driver-detail-value-img">
            <el-upload
              :action='src'
              :limit="1"
              name="file"
              :file-list="imgList.length>0?[{url:imgSrc+imgList[0]}]:[]"
              :with-credentials="true"
              list-type="picture-card"
              :on-preview="previewImg"
              :on-success='subImg'
              :before-remove='rmImg'
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-button type="danger" size="mini" class='close-btn close-btn-off' icon="el-icon-close" @click="doShow" circle></el-button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import urls from '@/config/api.js'
    export default {
        name: 'updateDriver',
        props:['detailName','detailKey','detailValue','detailType','options','couldEdit'],
        data: function () {
          return {
              imgSrc:urls.imgOrigin,
              editValue: '',
              showEdit: false,
              optionLabel:'',
              imgList:[], //存放图片数组
              srcList:[], //存放图片上传后返回的filepath
              src: urls.uploadImage, //图片上传地址
          }
        },
        mounted: function () {

//          if (this.detailType === 'text') {
//
//          }
          this.editValue = this.detailValue
          if (this.detailType === 'checkStatus') { // 如果是选择器类型
              // optionLabel---用于显示值，父组件传过来的为number，detailType为选择器类型时，会传入数组对象options用于存放选项
              //在options选项组中寻找detailValue对应的对象，获取其label赋值给optionLabel用于显示
            this.optionLabel = this.options.find(item=> item.value === this.detailValue).label
          }
          if (this.detailType === 'img') {
              if (this.detailValue !== null) {
                this.imgList = this.detailValue[0].split(';')
                this.srcList.push(...this.imgList)
              }
          }
          if (this.detailType === 'img2') {
            if (this.detailValue !== null) {
//              this.imgList = this.detailValue[0].split(';')
              this.imgList.push(this.detailValue)
              this.srcList.push(...this.imgList)
            }
          }
        },

        methods:{
          doEdit: function () {
            this.$emit('addNum')
            this.showEdit = true
          },
          doShow: function () {
            this.$emit('reduceNum')
            this.showEdit = false
          },
          submitNewValue: function () {
            if (this.detailType === 'img' || this.detailType === 'img2') {
                this.editValue = this.srcList.join(';')
            }
            let params = {
                name: this.detailKey,
                value: this.editValue
            }
            if (this.showEdit) {
              this.$emit('collect',params)
            }
          },
          previewImg(file){
              this.preViewEle(file.url)
          },
          subImg(res,file,fileList){

              this.srcList.push(res.data[0].filePath)
//              console.log(fileList)
          },
          rmImg(file,fileList){

              let num = fileList.indexOf(file)
              this.srcList.splice(num,1)
          }
        },
    }
</script>

<style scoped>
.driver-detail-module{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin:4px auto;
  border-bottom:1px dotted #e5e5e5;
}
.driver-detail-value-module{
  display: flex;
  align-items: center;
}
.driver-detail-key{
  font-size: 1.4rem;
  font-weight:bold;
}
.driver-detail-value{
  position: relative;
  max-width: 85%;
}
.driver-detail-value .close-btn{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(120%,-50%);
}
.driver-detail-imgList{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
  .cerImg{
    width:48%;
  }
  .driver-detail-value-img{
    display: flex;
    flex-direction: column;
  }
</style>
