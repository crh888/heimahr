<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形组件 -->
      <el-tree
        :data="depts"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
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
              <el-dropdown @command="operateDept($event, data.id)">
                <span class="el-dropdown-link">
                  操作
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加此部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 弹窗 -->
    <!-- .sync 接收子组件的事件 update:showDialog 值 赋值给showDialog -->
    <add-dept
      :current-node-id="currentNodeId"
      :show-dialog.sync="showDialog"
      @updateDepartment="getDepartment"
    />
  </div>
</template>
<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  name: 'Department',
  components: {
    AddDept
  },
  data() {
    return {
      depts: [], // 数据属性
      defaultProps: {
        label: 'name', // 显示的字段的名字
        children: 'children' // 读取子节点的字段名
      },
      showDialog: false,
      currentNodeId: null // 存储当前点击的Id
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
    },
    // 操作部门
    operateDept(type, id) {
      // 添加子部门
      if (type === 'add') {
        this.showDialog = true
        this.currentNodeId = id
      }
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

