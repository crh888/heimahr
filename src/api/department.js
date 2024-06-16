import request from '@/utils/request'

/**
 * 获取组织架构数据
 * @returns
 */
export function getDepartment() {
  return request({
    url: '/company/department'
  })
}

/**
 * 获取部门负责人列表
 */
export function getManagerList() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 新增组织
 */
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

/**
 * 通过id获取部门详情
 */
export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 更新部门
 */

export function updateDepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 删除部门
 */
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
