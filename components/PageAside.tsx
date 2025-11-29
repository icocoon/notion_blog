// import { type Block, type ExtendedRecordMap } from 'notion-types'

// import { getPageTweet } from '@/lib/get-page-tweet'

// import { PageActions } from './PageActions'
// import { PageSocial } from './PageSocial'

// export function PageAside({
//   block,
//   recordMap,
//   isBlogPost
// }: {
//   block: Block
//   recordMap: ExtendedRecordMap
//   isBlogPost: boolean
// }) {
//   if (!block) {
//     return null
//   }

//   // only display comments and page actions on blog post pages
//   if (isBlogPost) {
//     const tweet = getPageTweet(block, recordMap)
//     if (!tweet) {
//       return null
//     }

//     return <PageActions tweet={tweet} />
//   }

//   return <PageSocial />
// }


import * as React from 'react'
import { type Block, type ExtendedRecordMap } from 'notion-types'
import { getPageTweet } from '@/lib/get-page-tweet'
import { PageActions } from './PageActions'
import { PageSocial } from './PageSocial'

// 1. 引入目录组件 (从 react-notion-x 第三方库中引入)
import { TableOfContents } from 'react-notion-x/third-party/table-of-contents'

export function PageAside({
  block,
  recordMap,
  isBlogPost
}: {
  block: Block
  recordMap: ExtendedRecordMap
  isBlogPost: boolean
}) {
  if (!block) {
    return null
  }

  // 如果是博客文章
  if (isBlogPost) {
    const tweet = getPageTweet(block, recordMap)
    
    // 2. 重新组织结构：
    // 不管有没有推特，都要显示容器。
    // 如果有推特，显示 Action 按钮；
    // 始终显示 TableOfContents (目录)
    return (
      <div className='notion-aside-custom'>
        {tweet && <PageActions tweet={tweet} />}
        
        <TableOfContents block={block} recordMap={recordMap} />
      </div>
    )
  }

  return <PageSocial />
}