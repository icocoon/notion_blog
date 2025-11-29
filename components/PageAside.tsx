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
import dynamic from 'next/dynamic'
import { type Block, type ExtendedRecordMap } from 'notion-types'
import { getPageTweet } from '@/lib/get-page-tweet'
import { PageActions } from './PageActions'
import { PageSocial } from './PageSocial'

// 使用动态导入，并添加 @ts-ignore 忽略 TypeScript 的路径报错
const TableOfContents = dynamic(() =>
  // @ts-ignore: 忽略第三方库的类型定义路径问题
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
    
    return (
      <div className='notion-aside-custom'>
        {tweet && <PageActions tweet={tweet} />}
        
        {/* 修正参数：将 block.id 作为 pageId 传递给目录组件 */}
        <TableOfContents recordMap={recordMap} pageId={block.id} />
      </div>
    )
  }

  return <PageSocial />
}