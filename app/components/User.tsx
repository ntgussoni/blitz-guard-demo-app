import { useMutation } from "blitz"
import decreaseOutput from "app/reactors/mutations/decreaseOutput"
import increaseOutput from "app/reactors/mutations/increaseOutput"
import selfDestroy from "app/reactors/mutations/selfDestroy"

const TriggerButton = ({ onClick, text }) => (
  <button
    className="bg-primary-transparent border border-transparent hover:border-primary flex justify-center items-center w-full text-yellow-400 text-bold px-4 py-3  focus:outline-none"
    onClick={onClick}
  >
    <span>{text}</span>
  </button>
)
export const User = ({ name = "", role, refetchReactor, refetchAccessLogs }) => {
  const [triggerIncreaseOutput] = useMutation(increaseOutput)
  const [triggerDecreaseOutput] = useMutation(decreaseOutput)
  const [triggerSelfDestroy] = useMutation(selfDestroy)

  const onGenerateMore = async () => {
    await triggerIncreaseOutput()
    refetchReactor()
  }

  const onGenerateLess = async () => {
    await triggerDecreaseOutput()
    refetchReactor()
  }

  const onSelfDestroy = async () => {
    await triggerSelfDestroy()
    refetchReactor()
  }

  return (
    <div className="panel relative flex-1 py-3 sm:max-w-xl sm:mx-auto">
      <div className="relative bg-primary-transparent border-primary border-2 mx-8 md:mx-0 shadow p-1">
        <div className="max-w-md mx-auto px-1 py-2">
          <div className="flex items-center space-x-5">
            <div className="  block pl-2 font-semibold  w-full self-start text-white">
              <h2 className="leading-relaxed">{name}</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="pt-4 flex flex-1 flex-col space-y-4">
              <TriggerButton onClick={onGenerateMore} text="Generate more" />
              <TriggerButton onClick={onGenerateLess} text="Generate less" />
              <TriggerButton onClick={refetchAccessLogs} text="Read access logs" />
              <TriggerButton onClick={onSelfDestroy} text="Self destroy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
