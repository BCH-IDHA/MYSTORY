'use strict';

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
var config = require('./log-config');

const logLevel = config.application.loglevel
const logDir = config.application.logdir

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-els-service.log`,
    datePattern: 'YYYY-MM-DD',
    format: format.combine(
        format.colorize(),
        format.printf(
            info =>
                `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
    ),
    level: logLevel,
    handleExceptions: true

});

const exceptionsDailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-els-exceptions.log`,
    datePattern: 'YYYY-MM-DD',
    format: format.combine(
        format.colorize(),
        format.printf(
            info =>
                `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
    ),
    level: 'error',
    handleExceptions: true
});


const logger = caller => {
    return createLogger({
        level: logLevel,
        format: format.combine(
            format.label({ label: path.basename(caller) }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
        ),
        transports: [
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.printf(
                        info =>
                            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                    )
                ),
                handleExceptions: true
            }),
            dailyRotateFileTransport,
            exceptionsDailyRotateFileTransport

        ],

        exitOnError: false
    });
};


module.exports = logger;