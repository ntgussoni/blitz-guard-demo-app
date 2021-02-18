import { Link, BlitzPage, useMutation, useQuery, dynamic } from "blitz"
import Layout from "app/layouts/Layout"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import React, { Suspense, useEffect, useState } from "react"
import readData from "app/reactors/queries/readData"
import readAccessLogs from "app/reactors/queries/readAccessLogs"
import { UsersList } from "../components/UsersList"

const DynamicReactorCore = dynamic(() => import("app/components/ReactorCore"), { ssr: false })

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div>
      </>
    )
  } else {
    return (
      <>
        <Link href="/signup">
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <Link href="/login">
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      </>
    )
  }
}

const Home: BlitzPage = () => {
  const [counter, setCounter] = useState(60)
  const [reactor, { refetch: refetchReactor }] = useQuery(readData, null)
  const [accessLogs, { refetch: refetchAccessLogs }] = useQuery(readAccessLogs, null, {
    enabled: false,
  })

  useEffect(() => {
    setCounter(60)
  }, [reactor?.selfDestroy])

  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
    return () => clearInterval(timer)
  }, [counter])

  if (!reactor) return null

  const energyMeter = new Array(20).fill(false).map((_, i) => (i + 1) * 100 <= reactor.generationMw) // create an empty array with length 45

  return (
    <div className="w-screen h-screen text-primary">
      <DynamicReactorCore generatedMw={reactor.generationMw} />
      {/* <div className="buttons">
          <UserInfo />
        </div> */}

      {reactor?.selfDestroy && (
        <span className="absolute bg-opacity-75 transform -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 text-red-700 p-4 bg-red-200 bold text-2xl border-t border-b border-red-600 w-full flex justify-center">
          Self destroying {counter}s
        </span>
      )}

      {accessLogs && (
        <span className="absolute bg-opacity-75 transform -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 text-white p-4 bg-black bold text-xs font-mono w-full flex justify-center">
          {accessLogs.foo}
        </span>
      )}

      <div className="text-2xl absolute z-10 top-0 left-0 w-full flex space-x-1 items-center p-2 ">
        <span className="font-bold mr-4">ENERGY</span>
        {energyMeter.map((i) => (
          <span
            className={i ? `block bg-yellow-400 w-2 h-4` : `block bg-primary-transparent w-2 h-4`}
          ></span>
        ))}
        <span className="ml-4"> {reactor?.generationMw}Mwh</span>
      </div>

      <div className="absolute z-10 bottom-0 left-0  flex space-x-3 w-full px-2 text-xs">
        <UsersList
          refetchReactor={refetchReactor}
          refetchAccessLogs={refetchAccessLogs}
        ></UsersList>
      </div>
    </div>
  )
}
Home.getLayout = (page) => (
  <Layout title="Home">
    <Suspense fallback="Loading...">{page}</Suspense>
  </Layout>
)

export default Home
