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
