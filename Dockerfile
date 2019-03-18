FROM linode/lamp
EXPOSE 80
EXPOSE 3306
WORKDIR /var/www/example.com/public_html
RUN apt-get update && apt-get install -y curl php5-mysql rsyslog
RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get install -y nodejs
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn
RUN sed -i "s/.*bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/my.cnf
COPY . /var/www/example.com/public_html/
COPY ./cron.d/picks /etc/cron.d/picks
RUN chmod 644 /etc/cron.d/picks
RUN cd react && yarn && yarn build
RUN service apache2 start
RUN service mysql start
RUN cron
RUN sh database/db_init.sh
RUN sh database/db_seed.sh
RUN sh database/db_update.sh
CMD ["sh", "entrypoint.sh"]
