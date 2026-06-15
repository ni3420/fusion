import {atom,useAtom} from "jotai"

const modelState=atom(false)

export const useWorkspaceModel=()=>{
    return useAtom(modelState)
}