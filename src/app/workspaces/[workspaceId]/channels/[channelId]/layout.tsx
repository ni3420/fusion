import ChannelPreference from "@/features/channels/components/channel-preference-model";
import ChannelTopBar from "@/features/channels/components/channel-topbar";

interface ChannelLayoutProps{
    children:React.ReactNode
}

const ChannelLayout = ({children}:ChannelLayoutProps) => {
    return (  <>
    <ChannelTopBar/>
    {children}
    
    </>);
}
 
export default ChannelLayout;