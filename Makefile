.PHONY: all install build dev test lint clean

all: build

install:
	npm install
	cd backend && poetry install

build:
	npm run build

dev:
	npm run dev

test:
	npm test
	cd backend && pytest

lint:
	npm run lint

clean:
	npm run clean
