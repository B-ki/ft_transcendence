ENV_FILE = .env
include $(ENV_FILE)

COMPOSE_FILE_DEV = docker-compose.dev.yml
COMPOSE_FILE_PROD = docker-compose.yml
DOCKER = docker
COMPOSE = $(DOCKER) compose --env-file $(ENV_FILE)

prod: prod.build prod.upd

dev:	dev.build dev.upd

%.upd:	$(ENV_FILE)
	$(COMPOSE) -f docker-compose.$*.yml up -d

%.up:		$(ENV_FILE)
	$(COMPOSE) -f docker-compose.$*.yml up

%.start:
	$(COMPOSE) -f docker-compose.$*.yml start

%.stop:
	$(COMPOSE) -f docker-compose.$*.yml stop

%.down:
	$(COMPOSE) -f docker-compose.$*.yml down

%.restart:	$(ENV_FILE)
	$(COMPOSE) -f docker-compose.$*.yml restart

%.build:
	$(COMPOSE) -f docker-compose.$*.yml build

%.ps:
	$(COMPOSE) -f docker-compose.$*.yml ps

%.logs:
	$(COMPOSE) -f docker-compose.$*.yml logs

%.clean:
	$(COMPOSE) -f docker-compose.$*.yml down -v

fclean: dev.clean prod.clean
	$(DOCKER) system prune -a --volumes -f

re: fclean prod

.PHONY: all dir upd up stop down restart build clean ps re
