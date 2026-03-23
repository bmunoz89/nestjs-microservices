import { EventBusService as LibEventBusService } from '@libs/event';
import type { EventMap } from './event-bus.interface';

export class EventBusService extends LibEventBusService<EventMap> {}
