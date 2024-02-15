import getConversationById from "@/actions/getConversationById";
import getMessages from "@/actions/getMessages";
import EmptyState from "@/components/emptyState";
import { Suspense } from "react";
import Header, { HeaderSkeleton } from "./components/Header";
import Body, { BodySkeleton } from "./components/Body";
import Form from "./components/Form";

interface IParams {
  conversationId: string;
}

const ConversationPage = async ({ params }: { params : IParams}) => {
  const { conversationId } = params;
  const conversation = await getConversationById(conversationId);
  const messages = await getMessages(conversationId);

  if(!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    )
  }
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Suspense fallback={<div><HeaderSkeleton /><BodySkeleton /></div>}>
          <Header conversation={conversation}/>
          <Body initialMessages={messages} />
          <Form />
        </Suspense>
      </div>
    </div>
  )
}

export default ConversationPage