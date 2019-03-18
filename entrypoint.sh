#/bin/env bash
service apache2 start
service mysql start
service mysql status
sh database/db_init.sh
sh database/db_seed.sh
sh database/db_update.sh
cron
/bin/bash
