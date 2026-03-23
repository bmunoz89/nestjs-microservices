import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type {
  BaseEventMap,
  EventMapListener,
  EventMapMessage,
  EventName,
  EventPayload,
  EventResponse,
} from './event.interface';

@Injectable()
export class EventBusService<T extends BaseEventMap> {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<K extends EventName<EventMapListener<T>>>(
    eventName: K,
    payload: EventPayload<T, K>
  ): void {
    this.eventEmitter.emit(eventName, payload);
  }

  async send<K extends EventName<EventMapMessage<T>>>(
    eventName: K,
    payload: EventPayload<T, K>
  ): Promise<EventResponse<T, K>[]> {
    return await this.eventEmitter.emitAsync(eventName, payload);
  }

  async sendOne<K extends EventName<EventMapMessage<T>>>(
    eventName: K,
    payload: EventPayload<T, K>
  ): Promise<EventResponse<T, K>> {
    const responses = await this.send(eventName, payload);

    if (responses.length === 0)
      throw new Error('No handlers responded to the event');

    return responses[0];
  }
}
