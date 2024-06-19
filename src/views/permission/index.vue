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

      <el-table>
        <el-table-column label="名称" />
        <el-table-column label="标识" />
        <el-table-column label="描述" />
        <el-table-column label="操作">
          <el-button
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
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Permission'
}
</script>

<style>
.btn-add {
  margin: 10px;
}
</style>

