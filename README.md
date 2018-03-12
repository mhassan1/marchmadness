March Madness
=============

"March Madness" allows users to submit and follow their March Madness brackets, and correct picks are automatically updated every 15 minutes.

## Technology

PHP, CodeIgniter, MySQL

## Setup

1. `docker build . -t marchmadness`
2. `docker run -v $(pwd):/var/www/example.com/public_html --restart unless-stopped -itd -p 80:80 -p 3306:3306 marchmadness`
3. `docker exec $(docker ps -f ancestor=marchmadness --latest --quiet) sh db_init.sh`
4. Update constants at the top of `seed.sql`
5. `docker exec $(docker ps -f ancestor=marchmadness --latest --quiet) sh db_seed.sh`
6. `docker exec $(docker ps -f ancestor=marchmadness --latest --quiet) sh db_update.sh` (you can do this again later, as well)
7. Navigate to `localhost` in a browser. You should see the login screen.
8. Log in as "admin" user with password "secret"
9. Go to "Setup" at the top and set up bracket after Selection Sunday and before inviting users
10. Add/update teams as needed to `update.sql`, and run `sh db_update.sh` (as above). TODO how to get them from MSNBC
11. Add users to `update.sql`, and run `sh db_update.sh` (as above). Passwords should be inserted as MD5 hashes.

## Updating Picks

Picks are automatically updated every 15 minutes by the MSNBC cron.

## Development

**MySQL**
Port: 3306
Database: exampleDB
User: example_user
Password: Admin2015
