import { OnEvent } from '@nestjs/event-emitter';
import type {
  BaseEventMap,
  EventMapListener,
  EventMapMessage,
  EventName,
  EventPayload,
  EventResponse,
} from './event.interface';

export function createEventDecorators<T extends BaseEventMap>() {
  function EventListener<K extends EventName<EventMapListener<T>>>(
    eventName: K
  ) {
    return function (
      target: any,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<
        (payload: EventPayload<T, K>) => Promise<void>
      >
    ): void {
      const decorator = OnEvent(eventName);
      decorator(target, propertyKey, descriptor);
    };
  }

  function EventMessage<K extends EventName<EventMapMessage<T>>>(eventName: K) {
    return function (
      target: any,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<
        (payload: EventPayload<T, K>) => Promise<EventResponse<T, K>>
      >
    ): void {
      const decorator = OnEvent(eventName, { promisify: true });
      decorator(target, propertyKey, descriptor);
    };
  }

  return {
    EventListener,
    EventMessage,
  };
}
