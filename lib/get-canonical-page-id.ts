// import { type ExtendedRecordMap } from 'notion-types'
// import {
//   getCanonicalPageId as getCanonicalPageIdImpl,
//   parsePageId
// } from 'notion-utils'

// import { inversePageUrlOverrides } from './config'

// export function getCanonicalPageId(
//   pageId: string,
//   recordMap: ExtendedRecordMap,
//   { uuid = true }: { uuid?: boolean } = {}
// ): string | undefined {
//   const cleanPageId = parsePageId(pageId, { uuid: false })
//   if (!cleanPageId) {
//     return
//   }

//   const override = inversePageUrlOverrides[cleanPageId]
//   if (override) {
//     return override
//   } else {
//     return (
//       getCanonicalPageIdImpl(pageId, recordMap, {
//         uuid
//       }) ?? undefined
//     )
//   }
// }

import { type ExtendedRecordMap } from 'notion-types'
import {
  getCanonicalPageId as getCanonicalPageIdImpl,
  parsePageId
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | undefined {
  // 获取纯净的 32 位页面 ID (不带短横线)
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return
  }

  // 检查是否有手动指定的 URL 覆盖 (在 site.config.ts 中配置)
  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  } else {
    // 核心修改在这里：
    // 直接返回 cleanPageId 的前 16 位字符作为 URL。
    // 如果您想要更长或更短，可以修改 .slice(0, 16) 中的数字。
    return cleanPageId.slice(0, 16)

    // 原来的代码是下面这样，它会尝试使用 Notion 的可读标题：
    // return (
    //   getCanonicalPageIdImpl(pageId, recordMap, {
    //     uuid
    //   }) ?? undefined
    // )
  }
}