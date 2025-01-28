import winston from 'winston';


export const logger = new winston.Logger({
  level: 'info',
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
  ),
  defaultMeta: { service: 'LOG' },

  transports: [
    new winston.transports.File({ filename: './src/logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: './src/logs/combined.log' }),
  ]
})