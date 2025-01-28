import winston from 'winston';


const logger = new winston.createLogger({
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

export default logger;