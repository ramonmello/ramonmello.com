export type MessageData = Record<string, unknown>;

export type MessageHandler = (data: MessageData) => void;

/**
 * Publish/subscribe hub. Each instance is an isolated namespace: a `World`
 * owns one, so clearing or destroying a world never reaches another one's
 * subscribers.
 */
export class MessageBus {
  private listeners: Map<string, Set<MessageHandler>> = new Map();

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

  /** Drops every subscription on this bus. Other buses are untouched. */
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
