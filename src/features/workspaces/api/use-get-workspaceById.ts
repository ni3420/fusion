import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface WorkspaceByIdProps{
    id:Id<"workspaces">
}

export const useGetWorkSpaceById=({id}:WorkspaceByIdProps)=>{
    const data=useQuery(api.workspaces.getId,{id})
    const isLoading=data===undefined
    return {
      data: data ?? null,
      isLoading:isLoading
    }

}