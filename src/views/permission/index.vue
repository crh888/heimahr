<template>
  <div class="container">
    <div class="app-container">
      <el-button
        class="btn-add"
        size="mini"
        type="primary"
      >
        添加权限
      </el-button>

      <el-table
        row-key="id"
        :data="list"
        default-expand-all
      >
        <el-table-column
          prop="name"
          label="名称"
        />
        <el-table-column
          prop="code"
          label="标识"
        />
        <el-table-column
          prop="description"
          label="描述"
        />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              size="mini"
            >
              添加
            </el-button>
            <el-button
              type="text"
              size="mini"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), 0)
    }
  }
}
</script>

<style>
.btn-add {
  margin: 10px;
}
</style>

