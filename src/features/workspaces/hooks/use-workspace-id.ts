import { useParams } from "next/navigation"
import { Id } from "../../../../convex/_generated/dataModel"

export const useGetWorkSpaceId=()=>{
    const params=useParams()
    const id=params.workspaceId;
    return id as Id<"workspaces">


}