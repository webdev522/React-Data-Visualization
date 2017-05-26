#!/bin/sh

rm -rf .backup
mkdir -p .backup
cp -R .data/csv .backup/csv
cp -R .data/ftp .backup/ftp
mongodump --db apnic --out .backup/db

