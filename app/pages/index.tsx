import { BlitzPage, useQuery, dynamic } from "blitz"
import Layout from "app/layouts/Layout"
import React, { Suspense, useEffect, useState } from "react"
import readData from "app/reactors/queries/readData"
import readAccessLogs from "app/reactors/queries/readAccessLogs"
import { UsersList } from "../components/UsersList"
import { Actions } from "app/components/Actions"
import getChanges from "app/paper-trail/queries/getChanges"
import Convert from "ansi-to-html"
import { Reactor } from "db"
const DynamicReactorCore = dynamic(() => import("app/components/ReactorCore"), { ssr: false })

const AccessLog = () => {
  const [accessLogs, { isError }] = useQuery(readAccessLogs, null)

  if (isError) return null

  return (
    <span className="absolute bg-opacity-75 z-10 transform -translate-y-1/3 -translate-x-1/2 top-1/2 left-1/2 text-white p-4 bg-black bold text-xs font-mono w-full flex justify-center">
      {accessLogs.foo}
    </span>
  )
}

const Home: BlitzPage = () => {
  const [counter, setCounter] = useState(60)
  const [showAccess, setShowAccess] = useState(false)
  const [reactor, { refetch: refetchReactor }] = useQuery(readData, null)
  const [reactorChanges, { refetch: refetchChanges }] = useQuery(getChanges, {
    data: { model: "reactor", id: (reactor as Reactor).id as number, limit: 1 },
  })

  const toggleAccessLogs = () => {
    setShowAccess((prev) => !prev)
  }
  useEffect(() => {
    setCounter(60)
  }, [reactor?.selfDestroy])

  useEffect(() => {
    refetchChanges()
  }, [reactor, refetchChanges])

  useEffect(() => {
    const timer =
      reactor?.selfDestroy && counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
    return () => clearInterval(timer as any)
  }, [counter, reactor?.selfDestroy])

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
      <div className="absolute z-10 top-20 right-2 w-1/4">
        {reactorChanges.map((c) => (
          <div className="flex flex-col bg-white rounded-sm whitespace-pre p-4 font-mono">
            <span>
              <b>Record ID:</b> {c.id}
            </span>
            <span>
              <b>Action:</b> {c.action}
            </span>
            <span>
              <b>By user:</b> {c.updatedBy?.name}
            </span>
            <br />
            <span>
              <b>Diff</b>
            </span>
            <div dangerouslySetInnerHTML={{ __html: new Convert().toHtml(c.diff) }}></div>
          </div>
        ))}
      </div>
      {showAccess && <AccessLog></AccessLog>}
      <div className="text-xl absolute z-10 top-9 right-2 text-white font-mono flex space-x-1 items-center p-2 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#fff"
          className="mr-2"
        >
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>{" "}
        @ntgussoni
      </div>
      <div className="text-2xl absolute z-10 top-8 left-2 w-full flex space-x-1 items-center p-2 ">
        <span className="font-bold mr-4">ENERGY</span>
        {energyMeter.map((i) => (
          <span
            className={i ? `block bg-yellow-400 w-2 h-4` : `block bg-primary-transparent w-2 h-4`}
          ></span>
        ))}
        <span className="ml-4"> {reactor?.generationMw}Mwh</span>
      </div>

      <div className="absolute z-10 top-16 left-0  flex space-x-3 w-60 px-2 text-xs">
        <Actions
          reactor={reactor}
          refetchReactor={refetchReactor}
          toggleAccessLogs={toggleAccessLogs}
        />
      </div>

      <div className="absolute z-10 bottom-0 left-0  flex space-x-3 w-full px-2 text-xs">
        <UsersList refetchReactor={refetchReactor} toggleAccessLogs={toggleAccessLogs}></UsersList>
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
