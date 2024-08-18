import type { FlashKind, FlashMessage } from "$/client/types.js";

const flashMessages: FlashMessage[] = [];

function addFlashMessage(kind: FlashKind, message: string) {
  flashMessages.push({ kind, message });
}

function getFlashMessages() {
  const messages = [...flashMessages];
  flashMessages.length = 0;
  return messages;
}

export {
  addFlashMessage,
  getFlashMessages
};
