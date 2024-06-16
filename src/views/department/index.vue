<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形组件 -->
      <el-tree
        :data="depts"
        :props="defaultProps"
        default-expand-all
      >
        <template v-slot="{ data }">
          <el-row
            style="width: 100%; line-height: 40px"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!-- 下拉菜单 -->
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加此部门</el-dropdown-item>
                  <el-dropdown-item>编辑部门</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Department',
  data() {
    return {
      depts: [], // 数据属性
      defaultProps: {
        label: 'name', // 显示的字段的名字
        children: 'children' // 读取子节点的字段名
      }
    }
  },
  created() {
    // 初始化组织架构数据
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment()
      this.depts = transListToTreeData(result, 0)
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}
.el-dropdown-link {
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.tree-manager {
  width: 70px;
  display: inline-block;
  margin: 10px;
}
</style>

