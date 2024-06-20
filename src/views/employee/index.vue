<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom: 10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          highlight-current
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row
          class="opeate-tools"
          type="flex"
          justify="end"
        >
          <el-button
            size="mini"
            type="primary"
            @click="$router.push('/employee/detail')"
          >
            添加员工
          </el-button>
          <el-button
            size="mini"
            @click="showExcelDialog = true"
          >
            excel导入
          </el-button>
          <el-button
            size="mini"
            @click="exportEmployee"
          >
            excel导出
          </el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column
            align="center"
            label="头像"
            prop="staffPhoto"
          >
            <template v-slot="{ row }">
              <el-avatar
                v-if="row.staffPhoto"
                :src="row.staffPhoto"
                :size="30"
              />
              <span
                v-else
                class="username"
              >
                {{ row.username[0] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
          />
          <el-table-column
            sortable
            label="手机号"
            prop="mobile"
          />
          <el-table-column
            sortable
            label="工号"
            prop="workNumber"
          />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
          >
            <template v-slot="{ row }">
              <span>{{ row.formOfEmployment === 1 ? '正式' : '非正式' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="部门"
          />
          <el-table-column
            sortable
            label="入职事件"
            prop="timeOfEntry"
          />
          <el-table-column
            label="操作"
            width="280px"
          >
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="mini"
                @click="$router.push(`/employee/detail/${row.id}`)"
              >
                查看
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="btnRole(row.id)"
              >
                角色
              </el-button>
              <el-popconfirm
                title="这位员工确定删除吗？"
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
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row
          type="flex"
          align="middle"
          justify="end"
          style="height: 60px"
        >
          <el-pagination
            layout="total, prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pageSize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <import-excel
      :show-excel-dialog.sync="showExcelDialog"
      @uploadSuccess="getEmployeeList"
    />
    <el-dialog
      :visible.sync="showRoleDialog"
      title="分配角色"
    >
      <el-checkbox-group v-model="roleIds">
        <el-checkbox
          v-for="item in roleList"
          :key="item.id"
          :label="item.id"
        >
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <el-row
        slot="footer"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            size="mini"
            type="primary"
            @click="btnRoleOK"
          >
            确定
          </el-button>
          <el-button
            size="mini"
            @click="showRoleDialog = false"
          >
            取消
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import {
  getEmployeeList,
  exportEmployee,
  delEmployee,
  getEnableRoleList,
  getEmployeeDetail,
  assignRole
} from '@/api/employee'
import { transListToTreeData } from '@/utils'
import fileSaver from 'file-saver'
import ImportExcel from './components/import-excel.vue'
export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      depts: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      queryParams: {
        departmentId: null,
        page: 1,
        pageSize: 10,
        keyword: ''
      },
      list: [],
      total: 0,
      showExcelDialog: false,
      showRoleDialog: false,
      roleList: [],
      roleIds: [],
      currentUserId: null
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      this.depts = transListToTreeData(await getDepartment(), 0)
      this.queryParams.departmentId = this.depts[0].id
      this.$nextTick(() => {
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      this.getEmployeeList()
    },
    // 选中树节点变化的事件
    selectNode(node) {
      this.queryParams.departmentId = node.id
      this.queryParams.page = 1
      this.getEmployeeList()
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    changePage(newPage) {
      this.queryParams.page = newPage
      this.getEmployeeList()
    },
    // 输入值内容改变时触发
    changeValue() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 500)
    },
    // 导出员工的 excel
    async exportEmployee() {
      const res = await exportEmployee()
      fileSaver.saveAs(res, '员工信息表.xlsx') // 下载文件
    },
    async confirmDel(id) {
      await delEmployee(id)
      if (this.list.length === 1 && this.queryParams.page > 1) {
        this.queryParams.page--
      }
      this.getEmployeeList()
      this.$message.success('删除员工成功')
    },
    async btnRole(id) {
      this.roleList = await getEnableRoleList()
      this.currentUserId = id
      const { roleIds } = await getEmployeeDetail(id)
      this.roleIds = roleIds
      this.showRoleDialog = true
    },
    async btnRoleOK() {
      await assignRole({
        id: this.currentUserId,
        roleIds: this.roleIds
      })
      this.$message.success('分配用户角色成功')
      this.showRoleDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin: 10px;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04c9be;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>

