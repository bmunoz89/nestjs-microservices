export enum KafkaClientName {
  AUTH_MESSAGES = 'KAFKA_AUTH_MESSAGES',
  AUTH_EVENTS = 'KAFKA_AUTH_EVENTS',
  PAYMENT_EVENTS = 'KAFKA_PAYMENT_EVENTS',
}

export enum KafkaConsumerGroup {
  AUTH = 'auth-consumer',
  PAYMENT = 'payment-consumer',
}

export enum MessagePatterns {
  USER_BY_ID = 'user.by_id',
  USER_BY_EMAIL = 'user.by_email',
}

export enum EventPatterns {
  CREATE_USER = 'user.create',
  PROCESS_PAYMENT = 'payment.process',
}
