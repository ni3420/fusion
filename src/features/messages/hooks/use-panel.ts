import {useParentMsg} from "../store/use-parent-msg"
export const usePanel = () => {
  const [parentMessageId, setParentMessageId] =useParentMsg() 

  const openPanel = (messageId: string) => {
    setParentMessageId(messageId);
    console.log("openPanel called with messageId:", messageId);
  };

  const closePanel = () => {
    setParentMessageId(null);
  };

  return {
    parentMessageId: parentMessageId || null,
    openPanel,
    closePanel,
  };
};