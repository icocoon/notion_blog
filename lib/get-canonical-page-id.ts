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
    // 增加容错机制：拦截原生方法的崩溃
    try {
      const canonicalId = getCanonicalPageIdImpl(pageId, recordMap, { uuid })
      return canonicalId ?? cleanPageId
    } catch (error) {
      // 当遇到空标题或解析异常时，放弃拼接标题，直接回退使用 32 位原始 ID
      console.warn(`[Warning] Failed to generate canonical URL for page ${cleanPageId}, fallback to raw ID.`)
      return cleanPageId
    }
  }
}