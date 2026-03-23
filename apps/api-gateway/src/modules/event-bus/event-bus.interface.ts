import type {
  CreateEventMap,
  EventWithPayload,
  EventWithResponse,
  EventPayload as Payload,
  EventResponse as Response,
} from '@libs/event';

export type EventPayload<K extends keyof EventMap> = Payload<EventMap, K>;

export type EventResponse<K extends keyof EventMap> = Promise<
  Response<EventMap, K>
>;

export type EventMap = CreateEventMap<{
  'payment.completed': EventWithPayload<{
    userId: number;
    amount: number;
  }>;

  'payment.make': EventWithResponse<{
    payload: {
      userId: number;
      amount: number;
    };
    response: number;
  }>;
}>;
