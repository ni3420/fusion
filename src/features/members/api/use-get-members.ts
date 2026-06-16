import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface GetMembersProps{
    workspaceId:Id<"workspaces">
}

export const useGetMembers=({workspaceId}:GetMembersProps)=>{
    const data=useQuery(api.members.get,{workspaceId})
    const isLoading=data===undefined
    return{
        data:data ?? null,
        isLoading:isLoading
    }
    

}