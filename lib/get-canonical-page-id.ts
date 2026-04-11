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

// import { type ExtendedRecordMap } from 'notion-types'
// import {
//   parsePageId
// } from 'notion-utils'

// import { inversePageUrlOverrides } from './config'

// export function getCanonicalPageId(
//   pageId: string,
//   _recordMap: ExtendedRecordMap,
//   { uuid: _uuid = true }: { uuid?: boolean } = {}
// ): string | undefined {
//   const cleanPageId = parsePageId(pageId, { uuid: false })
//   if (!cleanPageId) {
//     return
//   }

//   const override = inversePageUrlOverrides[cleanPageId]
//   if (override) {
//     return override
//   } else {
//     return cleanPageId.slice(0, 16)
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
    try {
      const canonicalId = getCanonicalPageIdImpl(pageId, recordMap, { uuid })
      return canonicalId ?? cleanPageId
    } catch { 
      // 修正点：直接使用 catch { ... }，省略未使用的错误变量以通过 ESLint 检查
      console.warn(`[Warning] Failed to generate canonical URL for page ${cleanPageId}, fallback to raw ID.`)
      return cleanPageId
    }
  }
}