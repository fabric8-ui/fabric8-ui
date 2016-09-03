FROM nginx
MAINTAINER "Konrad Kleine <kkleine@redhat.com>"
ENV LANG=en_US.utf8

COPY dist /usr/share/nginx/html
