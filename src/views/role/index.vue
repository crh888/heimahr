<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理的内容 -->
      <div class="role-operate">
        <el-button
          type="primary"
          size="mini"
          @click="showDialog = true"
        >
          添加角色
        </el-button>
      </div>
      <!-- table 组件 -->
      <el-table :data="list">
        <el-table-column
          width="200"
          prop="name"
          align="center"
          label="角色"
        >
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input
              v-if="row.isEdit"
              v-model="row.editRow.name"
              size="mini"
            />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          align="center"
          prop="state"
          label="启用"
        >
          <template v-slot="{ row }">
            <el-switch
              v-if="row.isEdit"
              v-model="row.editRow.state"
              :active-value="1"
              :inactive-value="0"
            />
            <span v-else>{{ row.state === 1 ? '已启用' : '已禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="description"
          label="描述"
        >
          <template v-slot="{ row }">
            <el-input
              v-if="row.isEdit"
              v-model="row.editRow.description"
              type="textarea"
              size="mini"
            />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <!-- 操作按钮 -->
          <template v-slot="{ row }">
            <!-- 编辑状态 -->
            <template v-if="row.isEdit">
              <el-button
                type="primary"
                size="mini"
                @click="btnEditOK(row)"
              >
                确定
              </el-button>
              <el-button
                size="mini"
                @click="row.isEdit = false"
              >
                取消
              </el-button>
            </template>
            <!-- 非编辑状态 -->
            <template v-else>
              <el-button
                size="mini"
                type="text"
              >
                分配权限
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="btnEditRow(row)"
              >
                编辑
              </el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  type="text"
                  style="margin-left: 10px"
                >
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-row
        type="flex"
        align="middle"
        justify="end"
        style="height: 60px"
      >
        <el-pagination
          layout="prev, pager, next"
          :current-page="pageParams.page"
          :page-size="pageParams.pagesize"
          :total="pageParams.total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <el-dialog
      title="新增角色"
      width="500px"
      :visible.sync="showDialog"
      @close="btnCancel"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          prop="name"
          label="角色名称"
        >
          <el-input
            v-model="roleForm.name"
            style="width: 300px"
            size="mini"
          />
        </el-form-item>
        <el-form-item
          prop="state"
          label="启用"
        >
          <!-- 重置表单 需要写 prop -->
          <el-switch
            v-model="roleForm.state"
            :active-value="1"
            :inactive-value="0"
            size="mini"
          />
        </el-form-item>
        <el-form-item
          prop="description"
          label="角色描述"
        >
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            style="width: 300px"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
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
                @click="btnCancel"
              >
                取消
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, delRole } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      showDialog: false, // 控制弹层显示隐藏
      // 分页信息
      pageParams: {
        page: 1, // 第几页
        pagesize: 5, // 每页多少条,
        total: 0
      },
      roleForm: {
        name: '',
        description: '',
        state: 0 // 1 是启用 0 是未启用
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.list = rows
      this.pageParams.total = total
      // 针对每一行数据添加一个编辑标记
      this.list.forEach(item => {
        // this.$set() 针对目标多谢添加响应式数据
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getRoleList()
    },
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 编辑按钮
    btnEditRow(row) {
      row.isEdit = true
    },

    // 更新状态点击确定
    async btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        this.$message.success('更新角色信息成功')
        // 规避 eslint 误判
        Object.assign(row, { ...row.editRow, isEdit: false })
      } else {
        this.$message.warning('角色和描述不能为空')
      }
    },
    // 点击二次确认删除按钮
    async confirmDel(id) {
      await delRole(id)
      this.$message.success('删除角色成功！')
      if (this.list.length === 1) {
        this.pageParams.page--
      }
      this.getRoleList()
    }
  }
}
</script>

<style scoped>
.role-operate {
  padding: 10px;
}
</style>

