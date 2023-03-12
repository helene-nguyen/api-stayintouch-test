docker-build:
	sudo docker build --network=host -t api-stayintouch .

docker-compose:
	sudo docker compose up

docker-compose-detached:
	sudo docker compose up -d

get-ip-docker-api:
	sudo docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' api-stayintouch-compose

get-ip-docker-db:
	sudo docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' postgres-api-stayintouch

clean:
	sudo docker compose stop api-stayintouch-compose postgres-api-stayintouch