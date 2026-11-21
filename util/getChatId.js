export const getChatId = (chatId, flag=false) => {
    if (flag) {
      // Remove '!members-' prefix from chat ID
      if (chatId && chatId.startsWith('!members-')) {
        return chatId.substring('!members-'.length);
      }
      return chatId;
    } else {
      // Add '!members-' prefix to chat ID
      if (chatId && !chatId.startsWith('!members-')) {
        return '!members-' + chatId;
      }
      return chatId;
    }
  };