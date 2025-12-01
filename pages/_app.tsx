/* eslint-disable simple-import-sort/imports */
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
// global styles shared across the entire site
import 'styles/global.css'
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import 'styles/notion.css'
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'

// 引入 NProgress 样式 (进度条样式)
import 'nprogress/nprogress.css'

import { Analytics } from '@vercel/analytics/react'
import * as Fathom from 'fathom-client'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { posthog } from 'posthog-js'
import * as React from 'react'
import NProgress from 'nprogress'

import { bootstrap } from '@/lib/bootstrap-client'
import {
  fathomConfig,
  fathomId,
  isServer,
  posthogConfig,
  posthogId
} from '@/lib/config'

if (!isServer) {
  bootstrap()
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    // 页面开始跳转：进度条开始
    function onRouteChangeStart() {
      NProgress.start()
    }

    // 页面跳转完成：进度条结束 + 发送统计数据
    function onRouteChangeComplete() {
      NProgress.done()
      
      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    // 页面跳转出错：进度条也得结束
    function onRouteChangeError() {
      NProgress.done()
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    // 绑定事件监听
    router.events.on('routeChangeStart', onRouteChangeStart)
    router.events.on('routeChangeComplete', onRouteChangeComplete)
    router.events.on('routeChangeError', onRouteChangeError)

    // 清理事件监听
    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart)
      router.events.off('routeChangeComplete', onRouteChangeComplete)
      router.events.off('routeChangeError', onRouteChangeError)
    }
  }, [router.events])

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}