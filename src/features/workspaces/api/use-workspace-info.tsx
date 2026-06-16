import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface WorkspaceInfo{
    workspaceId:Id<"workspaces">
}

export const useGetWorkSpaceInfoById=({workspaceId}:WorkspaceInfo)=>{
    const data=useQuery(api.workspaces.getInfoById,{workspaceId})
    const isLoading=data===undefined
    return {
      data: data ?? null,
      isLoading:isLoading
    }

}