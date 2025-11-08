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
  parsePageId
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export function getCanonicalPageId(
  pageId: string,
  _recordMap: ExtendedRecordMap,
  { uuid: _uuid = true }: { uuid?: boolean } = {}
): string | undefined {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return
  }

  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  } else {
    return cleanPageId.slice(0, 16)
  }
}