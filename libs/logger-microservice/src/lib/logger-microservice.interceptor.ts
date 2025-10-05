import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerMicroserviceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerMicroserviceInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType();

    // Only log for RPC (Kafka) context
    if (contextType !== 'rpc') return next.handle();

    const fnName = context.getHandler().name;

    const rpcContext = context.switchToRpc();
    const kafkaContext = rpcContext.getContext<KafkaContext>();
    const topic = kafkaContext.getTopic();
    const message = kafkaContext.getMessage();

    this.logger.log(
      `MS request - Topic: ${topic} - Function: ${fnName} - Headers: ${JSON.stringify(
        message.headers
      )} - Data: ${JSON.stringify(message.value)}`
    );

    return next.handle().pipe(
      tap({
        next: (response) => {
          this.logger.log(
            `MS response - Topic: ${topic} - Function: ${fnName} - Response: ${JSON.stringify(
              response
            )}`
          );
        },
      })
    );
  }
}
