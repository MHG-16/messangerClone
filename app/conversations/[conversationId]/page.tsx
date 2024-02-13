interface IParams {
  conversationId: string;
}

const ConversationPage = async ({ params }: { params : IParams}) => {
  return (
    <div>ConversationPage</div>
  )
}

export default ConversationPage