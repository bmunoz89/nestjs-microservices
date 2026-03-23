export type EventWithPayload<P extends Record<string, unknown>> = P;

export type EventWithResponse<
  T extends {
    payload: Record<string, unknown>;
    response: unknown;
  }
> = T;

type EventWithResponseUnknown = EventWithResponse<{
  payload: Record<string, unknown>;
  response: unknown;
}>;

export interface BaseEventMap {
  [eventName: string]:
    | EventWithPayload<Record<string, unknown>>
    | EventWithResponseUnknown;
}

export type CreateEventMap<T extends BaseEventMap> = T;

export type EventName<T extends BaseEventMap> = keyof T & string;

export type EventPayload<
  T extends BaseEventMap,
  K extends EventName<T>
> = T[K] extends EventWithResponseUnknown ? T[K]['payload'] : T[K];

export type EventResponse<
  T extends BaseEventMap,
  K extends EventName<T>
> = T[K] extends EventWithResponseUnknown ? T[K]['response'] : void;

export type EventMapListener<T extends BaseEventMap> = {
  [K in EventName<T> as T[K] extends EventWithResponseUnknown
    ? never
    : K]: T[K];
};

export type EventMapMessage<T extends BaseEventMap> = {
  [K in EventName<T> as T[K] extends EventWithResponseUnknown
    ? K
    : never]: T[K];
};
