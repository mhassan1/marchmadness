FROM linode/lamp
EXPOSE 80
EXPOSE 3306
WORKDIR /var/www/example.com/public_html
RUN apt-get update
RUN apt-get install -y curl php5-mysql
RUN sed -i "s/.*bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/my.cnf
COPY . /var/www/example.com/public_html/
COPY ./cron.d/picks /etc/cron.d/picks
CMD ["sh", "start.sh"]
