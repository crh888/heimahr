<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理的内容 -->
      <div class="role-operate">
        <el-button
          type="primary"
          size="mini"
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
        />
        <el-table-column
          width="200"
          align="center"
          prop="state"
          label="启用"
        >
          <template v-slot="{ row }">
            {{ row.state === 1 ? '已启用' : '已禁用' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="description"
          label="描述"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <!-- 操作按钮 -->
          <template>
            <el-button
              size="mini"
              type="text"
            >
              分配权限
            </el-button>
            <el-button
              size="mini"
              type="text"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
            >
              删除
            </el-button>
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
  </div>
</template>
<script>
import { getRoleList } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      // 分页信息
      pageParams: {
        page: 1, // 第几页
        pagesize: 5, // 每页多少条,
        total: 0
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
    },
    changePage(newPage) {
      this.pageParams.page = newPage
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

