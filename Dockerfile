FROM nginx:latest
COPY ./dist/spa /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
