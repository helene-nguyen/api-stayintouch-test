docker-build:
	sudo docker build --network=host -t api-stayintouch .

docker-compose:
	sudo docker compose up

docker-compose-detached:
	sudo docker compose up -d

deploy: get-ip-docker-db
	sudo -iu postgres psql -U stayintouch -h get-ip-docker -d stayintouch -f $(pwd)/data/migration.sql

check-docker-db: get-ip-docker-db
	sudo -iu postgres psql -U stayintouch -h get-ip-docker -d stayintouch

get-ip-docker-db:
	sudo docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' api-stayintouch-compose

clean:
	sudo docker compose stop api-stayintouch-compose postgres-api-stayintouch