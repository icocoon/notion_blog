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
import dynamic from 'next/dynamic' // <--- 1. 引入 dynamic
import { type Block, type ExtendedRecordMap } from 'notion-types'
import { getPageTweet } from '@/lib/get-page-tweet'
import { PageActions } from './PageActions'
import { PageSocial } from './PageSocial'

// 2. 使用动态导入 (Dynamic Import) 引入目录组件
// { ssr: false } 表示仅在客户端渲染，这对于目录这种依赖浏览器窗口滚动的组件非常重要
const TableOfContents = dynamic(() =>
  import('react-notion-x/third-party/table-of-contents').then((m) => m.TableOfContents),
  { ssr: false }
)

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
    
    // 3. 渲染逻辑：始终显示容器，按需显示推特按钮，始终显示目录
    return (
      <div className='notion-aside-custom'>
        {tweet && <PageActions tweet={tweet} />}
        
        <TableOfContents block={block} recordMap={recordMap} />
      </div>
    )
  }

  return <PageSocial />
}