import request from '@/utils/request'

/**
 * 员工列表
 */
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

/**
 * 到处员工 excel
 */
export function exportEmployee() {
  return request({
    url: '/sys/user/export',
    // 改变接收数据的类型
    responseType: 'blob'
  })
}

/**
 * 下载员工导入模板
 */
export function getExportTemplate() {
  return request({
    url: '/sys/user/import/template',
    responseType: 'blob'
  })
}

/**
 * 上传用户的excel
 */

export function uploadExcel(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data
  })
}

/**
 * 删除员工
 */
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
