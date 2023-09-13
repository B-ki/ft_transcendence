ENV_FILE = .env
include $(ENV_FILE)

DOCKER = docker
COMPOSE = $(DOCKER) compose --env-file $(ENV_FILE)

all: prod

prod: docker-compose.prod.yml prod.build prod.upd

dev:  docker-compose.dev.yml dev.build dev.upd

db:   docker-compose.db.yml db.build db.upd

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
	$(COMPOSE) -f docker-compose.$*.yml logs -f

%.clean:
	$(COMPOSE) -f docker-compose.$*.yml down -v

fclean: dev.clean prod.clean db.clean
	$(DOCKER) system prune -a --volumes -f

re: fclean prod

.PHONY: all dir upd up stop down restart build clean ps re
