import {useQueryState} from "nuqs"

export const useParentMsg=()=>{
    return useQueryState("parentMsgId")
}