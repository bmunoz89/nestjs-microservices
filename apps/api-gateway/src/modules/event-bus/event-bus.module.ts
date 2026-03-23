import {
  EventBusService as LibEventBusService,
  EventBusModule as LibEventBusModule,
} from '@libs/event';
import { Module } from '@nestjs/common';
import { EventBusService } from './event-bus.service';

@Module({
  imports: [LibEventBusModule],
  providers: [
    {
      provide: EventBusService,
      useClass: LibEventBusService,
    },
  ],
  exports: [EventBusService],
})
export class EventBusModule {}
