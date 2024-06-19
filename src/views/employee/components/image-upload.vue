<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImage"
    accept=".jpeg, .png, .gif, .bmp"
  >
    <!-- eslint-disable-next-line vue/html-self-closing -->
    <img
      v-if="value"
      :src="value"
      class="avatar"
    />
    <!-- eslint-disable-next-line vue/html-self-closing -->
    <i
      v-else
      class="el-icon-plus avatar-uploader-icon"
    ></i>
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp'
      ].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isJPG && isLt2M
    },
    // 选择图片后上传
    uploadImage(params) {
      const cos = new COS({
        SecretId: 'AKIDpcSVl3KpM3hGmCqdPJLR0gebr2Y0VEB7',
        SecretKey: 'BmXIOSgrnwOuGdOOslaI73DRgHkSLF89'
      })
      cos.putObject(
        {
          Bucket: 'unusual-1256554712',
          Region: 'ap-shanghai',
          Key: params.file.name,
          StorageClass: 'STANDARD',
          Body: params.file
        },
        (err, data) => {
          if (data.statusCode === 200 && data.Location) {
            this.$emit('input', `https://${data.Location}`)
          } else {
            this.$message.error(err.message)
          }
        }
      )
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
