#/bin/env bash
service apache2 start
service mysql start
sh database/db_init.sh
sh database/db_seed.sh
sh database/db_update.sh
cd react && yarn && yarn build
cron
/bin/bash
