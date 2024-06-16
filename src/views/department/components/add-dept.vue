<template>
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="close"
  >
    <!-- 弹层内容 -->
    <el-form
      ref="addDept"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        prop="name"
        label="部门名称"
      >
        <el-input
          v-model="formData.name"
          size="mini"
          style="width: 80%"
          placeholder="2-10个字符"
        />
      </el-form-item>
      <el-form-item
        prop="code"
        label="部门编码"
      >
        <el-input
          v-model="formData.code"
          size="mini"
          style="width: 80%"
          placeholder="2-10个字符"
        />
      </el-form-item>
      <el-form-item
        prop="managerId"
        label="部门负责人"
      >
        <el-select
          v-model="formData.managerId"
          size="mini"
          style="width: 80%"
          placeholder="请选择负责人"
        >
          <!-- label 显示字段 value 存储字段 -->
          <el-option
            v-for="item in managerList"
            :key="item.id"
            :value="item.id"
            :label="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="introduce"
        label="部门介绍"
      >
        <el-input
          v-model="formData.introduce"
          type="textarea"
          :rows="4"
          size="mini"
          style="width: 80%"
          placeholder="1-100个字符"
        />
      </el-form-item>
      <el-form-item>
        <!-- 按钮 -->
        <el-row
          type="flex"
          justify="center"
        >
          <el-col :span="12">
            <el-button
              size="mini"
              type="primary"
              @click="btnOK"
            >
              确定
            </el-button>
            <el-button
              size="mini"
              @click="close"
            >
              取消
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  getDepartment,
  getManagerList,
  addDepartment,
  getDepartmentDetail,
  updateDepartment
} from '@/api/department'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formData: {
        code: '',
        introduce: '',
        managerId: '',
        name: '',
        pid: ''
      },
      rules: {
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门编码长度2-10位', trigger: 'blur' },
          {
            trigger: 'blur',
            // eslint-disable-next-line space-before-function-paren
            validator: async (rule, value, callback) => {
              let result = await getDepartment()
              //   判断是否是编辑模式
              if (this.formData.id) {
                // 编辑场景
                result = result.filter(item => item.id !== this.formData.id)
              }
              //   result 中是否存在value的值
              if (result.some(item => item.code === value)) {
                callback(new Error('部门中已存在该编码'))
              } else {
                callback()
              }
            }
          }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '部门介绍长度1-100位', trigger: 'blur' }
        ],
        managerId: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称长度2-10位', trigger: 'blur' },
          {
            trigger: 'blur',
            // eslint-disable-next-line space-before-function-paren
            validator: async (rule, value, callback) => {
              let result = await getDepartment()
              if (this.formData.id) {
                // 编辑场景
                result = result.filter(item => item.id !== this.formData.id)
              }
              if (result.some(item => item.name === value)) {
                callback(new Error('部门中已存在该名称'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      managerList: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getManagerList()
  },
  methods: {
    close() {
      this.formData = {
        code: '',
        introduce: '',
        managerId: '',
        name: '',
        pid: ''
      }
      //  修改父组件的值
      this.$emit('update:showDialog', false)
      //   重置表单
      this.$refs.addDept.resetFields()
    },
    async getManagerList() {
      this.managerList = await getManagerList()
    },
    btnOK() {
      this.$refs.addDept.validate(async isOk => {
        if (isOk) {
          let message = '新增'
          if (this.formData.id) {
            // 编辑场景
            message = '更新'
            await updateDepartment(this.formData)
          } else {
            // 新增场景
            await addDepartment({ ...this.formData, pid: this.currentNodeId })
          }
          //   通知父组件更新
          this.$emit('updateDepartment')
          this.$message.success(`${message}部门成功`)
          this.close()
        }
      })
    },
    // 通过id获取对应组织信息
    async getDepartmentDetail() {
      this.formData = await getDepartmentDetail(this.currentNodeId)
    }
  }
}
</script>
