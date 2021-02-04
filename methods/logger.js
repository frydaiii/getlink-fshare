const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    dirname: './log/',
    maxSize: '5m'
});

transport.on('rotate', function(oldFilename, newFilename) {
    console.log('new log file created');
});

const logger = winston.createLogger({
    transports: [transport]
});

module.exports = logger;
