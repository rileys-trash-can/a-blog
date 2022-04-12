while true
do
	echo docker compose
	sudo docker-compose up --build -d

	echo attaching
	docker attach $(docker ps --filter name=^/a-blog_node -q)

	echo restarting
	sudo docker-compose stop
done
