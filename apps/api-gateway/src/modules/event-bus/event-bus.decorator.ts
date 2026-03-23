import { createEventDecorators } from '@libs/event';
import type { EventMap } from './event-bus.interface';

export const { EventListener, EventMessage } =
  createEventDecorators<EventMap>();
