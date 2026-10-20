import { http } from '@/http'
import { ContentTypeEnum } from '@/enums/httpEnum'
import qs from 'qs'
export function getAction(url: string, params: object = {}, options: object = {}) {
  return http.request(
    {
      url: url,
      method: 'get',
      params: params
    },
    options
  )
}
export function postAction(url: string, params: object = {}, options: object = {}) {
  return http.request(
    {
      url: url,
      method: 'post',
      data: params,
      headers: {
        'Content-Type': ContentTypeEnum.JSON
      }
    },
    options
  )
}
export function postForm(url: string, params: object = {}, options: object = {}) {
  return http.request(
    {
      url,
      method: 'post',
      // x-www-form-urlencoded 需将对象序列化为表单字符串（对应 httpEnum 中“form-data 一般配合 qs”的约定）
      data: qs.stringify(params),
      headers: {
        'Content-Type': ContentTypeEnum.FORM_URLENCODED
      }
    },
    options
  )
}
