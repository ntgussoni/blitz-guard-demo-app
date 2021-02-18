import { useMutation, useQuery } from "blitz"
import selfDestroy from "app/reactors/mutations/selfDestroy"
import updateOutput from "app/reactors/mutations/updateOutput"
import Guard from "app/guard/ability"
import getAbility from "app/guard/queries/getAbility"

const TriggerButton = ({ onClick, text }) => (
  <button
    className="shadow bg-primary-transparent border border-transparent hover:border-primary flex justify-center items-center w-full text-yellow-400 text-bold px-4 py-3  focus:outline-none"
    onClick={onClick}
  >
    <span>{text}</span>
  </button>
)
export const Actions = ({ reactor, refetchReactor, refetchAccessLogs }) => {
  const [[canReadAccessLogs, canIncreaseReactor, canDecreaseReactor, canSelfDestroy]] = useQuery(
    getAbility,
    [
      ["read_access_log", "reactor"],
      ["control", "reactor", { data: { generationMw: reactor.generationMw + 100 } }],
      ["control", "reactor", { data: { generationMw: reactor.generationMw - 100 } }],
      ["self_destroy", "reactor"],
    ]
  )
  const [triggerUpdateOutput] = useMutation(updateOutput)
  const [triggerSelfDestroy] = useMutation(selfDestroy)

  const onGenerateMore = async () => {
    await triggerUpdateOutput({ data: { generationMw: reactor.generationMw + 100 } })
    refetchReactor()
  }

  const onGenerateLess = async () => {
    await triggerUpdateOutput({ data: { generationMw: reactor.generationMw - 100 } })
    refetchReactor()
  }

  const onSelfDestroy = async () => {
    await triggerSelfDestroy()
    refetchReactor()
  }

  return (
    <div className="panel relative flex-1 py-3 ">
      <div className="relative p-1">
        <div className="max-w-md mx-auto px-1 py-2">
          <div className="divide-y divide-gray-200">
            <div className="pt-4 flex flex-1 flex-col space-y-4">
              {canIncreaseReactor && (
                <TriggerButton onClick={onGenerateMore} text="Generate more" />
              )}
              {canDecreaseReactor && (
                <TriggerButton onClick={onGenerateLess} text="Generate less" />
              )}
              {canReadAccessLogs && (
                <TriggerButton onClick={refetchAccessLogs} text="Read access logs" />
              )}
              {canSelfDestroy && <TriggerButton onClick={onSelfDestroy} text="Self destroy" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
