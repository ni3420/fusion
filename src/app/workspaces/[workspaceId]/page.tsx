"use client"

import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspaceById";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";

const WorkspacePage = () => {
    const workSpaceId=useGetWorkSpaceId()
    const {data}=useGetWorkSpaceById({id:workSpaceId})
    console.log(data)
    
    return ( <>
    
    <h1>Workpace Page</h1>
    <p>{workSpaceId}</p>
    <p>{data?.name}</p>
    </> );
}
 
export default WorkspacePage;