import { ReactNode } from "react"
import { Head } from "blitz"
import { ImpersonatingUserNotice } from "app/components/ImpersonatingUserNotice"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "blitz-guard-app"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ImpersonatingUserNotice></ImpersonatingUserNotice>
      {children}
    </>
  )
}

export default Layout
