#!/bin/sh

FTP_HOST=$1
FTP_TIMEZONE=$2
FTP_SYNC_CONCURRENCY=$3
FTP_REMOTE=$4
FTP_LOCAL=$5
FTP_REGEXP=delegated-apnic-extended-[0-9]\{8}\.gz$

lftp -e \
  "set ftp:sync-mode off; \
   set ftp:use-mdtm off; \
   set hftp:use-head off; \
   set ftp:timezone ${FTP_TIMEZONE}; \
   set net:max-retries 10;set net:reconnect-interval-base 5;set net:reconnect-interval-multiplier 1; \
   mirror -c --ignore-time -i '${FTP_REGEXP}' -X */new/* -X */old-format/* --parallel=${FTP_SYNC_CONCURRENCY} --verbose ${FTP_REMOTE} ${FTP_LOCAL}; \
   exit;" \
  ${FTP_HOST}
