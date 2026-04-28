import {
  type ExtendedRecordMap,
  type SearchParams,
  type SearchResults
} from 'notion-types'
import { mergeRecordMaps } from 'notion-utils'
import pMap from 'p-map'
import pMemoize from 'p-memoize'

import {
  isPreviewImageSupportEnabled,
  navigationLinks,
  navigationStyle
} from './config'
import { getTweetsMap } from './get-tweets'
import { notion } from './notion-api'
import { getPreviewImageMap } from './preview-images'

const getNavigationLinkPages = pMemoize(
  async (): Promise<ExtendedRecordMap[]> => {
    const navigationLinkPageIds = (navigationLinks || [])
      .map((link) => link?.pageId)
      .filter(Boolean)

    if (navigationStyle !== 'default' && navigationLinkPageIds.length) {
      return pMap(
        navigationLinkPageIds,
        async (navigationLinkPageId) => {
          const navRecordMap = await notion.getPage(navigationLinkPageId, {
            chunkLimit: 1,
            fetchMissingBlocks: false,
            fetchCollections: false,
            signFileUrls: false
          })
          return flattenRecordMap(navRecordMap)
        },
        {
          concurrency: 4
        }
      )
    }

    return []
  }
)

/**
 * Fix double-nested block values returned by notion-client v7.7.0.
 * In this version, block data is at block[id].value.value instead of
 * block[id].value, which breaks downstream consumers like getAllPagesInSpace.
 * This function flattens the nesting so block[id].value points to the actual
 * block value object.
 */
function flattenRecordMap(recordMap: ExtendedRecordMap): ExtendedRecordMap {
  for (const id of Object.keys(recordMap.block)) {
    const block = recordMap.block[id] as any
    if (block?.value?.value && typeof block.value.value === 'object') {
      // Preserve spaceId if it exists at the top level
      const { spaceId, value: outerValue } = block
      const innerValue = outerValue.value
      // Use `as any` because the strict type { role: Role; value: Block } doesn't
      // include spaceId, but the actual Notion API response does contain it on some blocks.
      recordMap.block[id] = spaceId
        ? ({ spaceId, value: innerValue } as any)
        : { value: innerValue }
    }
  }
  return recordMap
}

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  let recordMap = await notion.getPage(pageId)
  recordMap = flattenRecordMap(recordMap)

  if (navigationStyle !== 'default') {
    // ensure that any pages linked to in the custom navigation header have
    // their block info fully resolved in the page record map so we know
    // the page title, slug, etc.
    const navigationLinkRecordMaps = await getNavigationLinkPages()

    if (navigationLinkRecordMaps?.length) {
      recordMap = navigationLinkRecordMaps.reduce(
        (map, navigationLinkRecordMap) =>
          mergeRecordMaps(map, navigationLinkRecordMap),
        recordMap
      )
    }
  }

  if (isPreviewImageSupportEnabled) {
    const previewImageMap = await getPreviewImageMap(recordMap)
    ;(recordMap as any).preview_images = previewImageMap
  }

  await getTweetsMap(recordMap)

  return recordMap
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}
