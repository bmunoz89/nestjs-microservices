export enum KafkaClientName {
  AUTH = 'KAFKA_AUTH_SERVICE',
  PAYMENT = 'KAFKA_PAYMENT_SERVICE',
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
