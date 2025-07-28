.PHONY: help build start stop restart logs clean admin driver terminal all clean-admin-container clean-driver-container clean-terminal-container install

# --- Установка зависимостей ---

install: ## Установить зависимости для всего монорепозитория
	cd docker && docker-compose -f docker-compose.install.yml up compass-install --remove-orphans
	cd docker && docker-compose -f docker-compose.install.yml down

# --- Утилиты очистки зависших контейнеров через docker-compose down ---

clean-admin-container:
	cd docker && docker-compose -f docker-compose.admin.start.yml down || true

clean-driver-container:
	cd docker && docker-compose -f docker-compose.driver.start.yml down || true

clean-terminal-container:
	cd docker && docker-compose -f docker-compose.terminal.start.yml down || true

# --- Команды для admin ---

admin-build: ## Собрать compass-admin
	cd docker && docker-compose -f docker-compose.admin.build.yml up compass-admin-build --remove-orphans
	cd docker && docker-compose -f docker-compose.admin.build.yml down

admin-start: clean-admin-container ## Запустить compass-admin
	cd docker && docker-compose -f docker-compose.admin.start.yml up -d --remove-orphans

admin-stop: ## Остановить compass-admin
	cd docker && docker-compose -f docker-compose.admin.start.yml down

admin-restart: ## Перезапустить compass-admin	
	make admin-stop
	make install
	make admin-build
	make admin-start

admin-logs: ## Показать логи compass-admin
	cd docker && docker-compose -f docker-compose.admin.start.yml logs -f

# --- Команды для driver ---

driver-build: ## Собрать compass-driver
	cd docker && docker-compose -f docker-compose.driver.build.yml up compass-driver-build --remove-orphans
	cd docker && docker-compose -f docker-compose.driver.build.yml down

driver-start: clean-driver-container ## Запустить compass-driver
	cd docker && docker-compose -f docker-compose.driver.start.yml up -d --remove-orphans

driver-stop: ## Остановить compass-driver
	cd docker && docker-compose -f docker-compose.driver.start.yml down

driver-restart: ## Перезапустить compass-driver
	make driver-stop
	make install
	make driver-build
	make driver-start

driver-logs: ## Показать логи compass-driver
	cd docker && docker-compose -f docker-compose.driver.start.yml logs -f

# --- Команды для terminal ---

terminal-build: ## Собрать compass-terminal
	cd docker && docker-compose -f docker-compose.terminal.build.yml up compass-terminal-build --remove-orphans
	cd docker && docker-compose -f docker-compose.terminal.build.yml down

terminal-start: clean-terminal-container ## Запустить compass-terminal
	cd docker && docker-compose -f docker-compose.terminal.start.yml up -d --remove-orphans

terminal-stop: ## Остановить compass-terminal
	cd docker && docker-compose -f docker-compose.terminal.start.yml down

terminal-restart: ## Перезапустить compass-terminal
	make terminal-stop
	make install
	make terminal-build
	make terminal-start

terminal-logs: ## Показать логи compass-terminal
	cd docker && docker-compose -f docker-compose.terminal.start.yml logs -f

# --- Команды для всех приложений ---

all-build: ## Собрать все приложения
	make admin-build
	make driver-build
	make terminal-build

all-start: ## Запустить все приложения
	make admin-start
	make driver-start
	make terminal-start

all-stop: ## Остановить все приложения
	make admin-stop
	make driver-stop
	make terminal-stop

all-restart: ## Перезапустить все приложения
	make all-stop
	make install
	make all-build
	make all-start

all-logs: ## Показать логи всех приложений
	@echo "Используйте: make admin-logs, make driver-logs, make terminal-logs"

# --- Утилиты ---

status: ## Показать статус контейнеров
	docker-compose -f docker/docker-compose.admin.start.yml ps -a | grep compass || \
	docker-compose -f docker/docker-compose.driver.start.yml ps -a | grep compass || \
	docker-compose -f docker/docker-compose.terminal.start.yml ps -a | grep compass || echo "Контейнеры не найдены"

clean: ## Очистить неиспользуемые Docker ресурсы
	docker system prune -f
	docker volume prune -f

force-stop: ## Принудительно остановить все контейнеры Compass через docker-compose down
	make clean-admin-container
	make clean-driver-container
	make clean-terminal-container
