"use client";

import ChannelPreference from "@/features/channels/components/channel-preference-model";
import ChannelTopBar from "@/features/channels/components/channel-topbar";

interface ChannelLayoutProps {
  children: React.ReactNode;
}

const ChannelLayout = ({ children }: ChannelLayoutProps) => {
  return (
    <div className="h-full flex flex-col min-w-0 overflow-hidden relative bg-background">
      <div className="sticky top-0 left-0 right-0 z-40 w-full shrink-0">
        <ChannelTopBar />
      </div>
      
      <div className="flex-1 overflow-y-auto relative min-h-0 w-full">
        {children}
      </div>
    </div>
  );
};

export default ChannelLayout;