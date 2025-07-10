export type MessageData = Record<string, unknown>;

export type MessageHandler = (data: MessageData) => void;

export class MessageBus {
  private static instance: MessageBus;
  private listeners: Map<string, Set<MessageHandler>> = new Map();

  static getInstance(): MessageBus {
    if (!MessageBus.instance) {
      MessageBus.instance = new MessageBus();
    }
    return MessageBus.instance;
  }

  private constructor() {}

  on(messageType: string, handler: MessageHandler): () => void {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, new Set());
    }

    this.listeners.get(messageType)!.add(handler);

    return () => {
      const handlers = this.listeners.get(messageType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.listeners.delete(messageType);
        }
      }
    };
  }

  emit(messageType: string, data: MessageData = {}): void {
    const handlers = this.listeners.get(messageType);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  clearListeners(messageType: string): void {
    this.listeners.delete(messageType);
  }

  clearAllListeners(): void {
    this.listeners.clear();
  }

  hasListeners(messageType: string): boolean {
    return (
      this.listeners.has(messageType) &&
      this.listeners.get(messageType)!.size > 0
    );
  }
}
