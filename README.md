March Madness
=============

"March Madness" allows users to submit and follow their March Madness brackets, and correct picks are automatically updated every 15 minutes.

## Technology

PHP, CodeIgniter, MySQL

## Setup

1. `docker build . -t marchmadness`
2. `docker run -v $(pwd):/var/www/example.com/public_html --restart unless-stopped -itd -p 80:80 -p 3306:3306 marchmadness`
(this will run the container and create a shared volume between host and guest for all project files)
3. `docker exec -it $(docker ps -f ancestor=marchmadness -f status=running --latest --quiet) /bin/bash` to enter the container (all the following scripts should be run inside the container)
4. `sh database/db_init.sh`
5. Update constants at the top of `database/seed.sql`
6. `sh database/db_seed.sh`
7. `sh database/db_update.sh` (you can do this again later, as well)
8. Navigate to `localhost` in a browser. You should see the login screen.
9. Log in as "admin" user with password "secret"
10. Go to "Setup" at the top and set up bracket after Selection Sunday and before inviting users
11. Add/update teams as needed to `database/update.sql`, and run `sh database/db_update.sh` (as above).
Teams can be found here (click on a team to see the "msnbc_team_id" in the URL): http://scores.nbcsports.com/cbk/teams.asp
12. Add users to `database/update.sql`, and run `sh database/db_update.sh` (as above). Passwords should be inserted as MD5 hashes.

## Updating Picks

Picks are automatically updated every 15 minutes by the MSNBC cron.

## Development

**MySQL**
Port: 3306
Database: exampleDB
User: example_user
Password: Admin2015
