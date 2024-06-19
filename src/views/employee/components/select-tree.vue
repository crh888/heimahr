<template>
  <el-cascader
    size="mini"
    :options="treeData"
    :props="props"
    separator="-"
    :value="value"
    @change="changeValue"
  />
</template>

<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      treeData: [],
      props: {
        label: 'name',
        value: 'id'
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      this.treeData = transListToTreeData(await getDepartment(), 0)
    },
    changeValue(list) {
      if (list) {
        this.$emit('input', list[list.length - 1])
      } else {
        this.$emit('input', null)
      }
    }
  }
}
</script>
