#!/bin/sh

rm -rf .data
mkdir -p .data
cp -R .backup/csv .data/csv
cp -R .backup/ftp .data/ftp
mongorestore --drop -d apnic .backup/db/apnic
