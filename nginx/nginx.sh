#!/bin/sh

cp /nginx/csp_nginx.conf /etc/nginx/csp_nginx.conf

if [ "$YENV_TYPE" = "test" ]; then
  cp /nginx/branch_location_nginx.conf /etc/nginx/branch_location_nginx.conf
else
  : > /etc/nginx/branch_location_nginx.conf
fi

exec nginx -g "daemon off;"
