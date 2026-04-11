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
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return
  }

  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  } else {
    // 恢复调用官方的 URL 生成逻辑，确保 ID 完整性与标题格式化
    return (
      getCanonicalPageIdImpl(pageId, recordMap, {
        uuid
      }) ?? undefined
    )
  }
}