import { DateTimeResolver, URLResolver } from 'graphql-scalars';
import { chats, messages } from '../db';

const resolvers = {
  Date: DateTimeResolver,
  URL: URLResolver,

  Chat: {
    messages: (chat: any) => {
      return messages.filter((message) => chat.messages.includes(message.id));
    },

    lastMessage: (chat: any) => {
      const lastMessage = chat.messages[chat.messages.length - 1];

      return messages.find((message) => message.id === lastMessage);
    }
  },

  Query: {
    chats: () => {
      return chats;
    },
    chat: (root: any, { chatId }: any) => {
      return chats.find((c) => c.id === chatId);
    }
  },

  Mutation: {
    addMessage: (root: any, { chatId, content }: any) => {
      const chatIndex = chats.findIndex((c) => c.id === chatId);

      if (chatIndex === -1) return null;

      const chat = chats[chatIndex];

      const messagesIds = messages.map((currentMessage) => Number(currentMessage.id));
      const messageId = String(Math.max(...messagesIds) + 1);
      const message = {
        id: messageId,
        createdAt: new Date(),
        content
      };

      messages.push(message);

      chat.messages.push(messageId);
      chats.splice(chatIndex, 1);
      chats.unshift(chat);

      return message;
    }
  }
};

export default resolvers;
