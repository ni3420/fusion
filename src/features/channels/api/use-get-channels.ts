import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface GetChannelsProps{
    workspaceId:Id<"workspaces">
}

export const useGetChannels=({workspaceId}:GetChannelsProps)=>{
    const data=useQuery(api.channels.get,{workspaceId})
    const isLoading=data===undefined
    return {
        data:data??null,
        isLoading:isLoading
    }
}