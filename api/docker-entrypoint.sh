#! /bin/bash

set -e

main() {
  echo "Updating db schema..."
  ./node_modules/.bin/prisma migrate deploy
  echo "Database updated"
  echo "Starting server..."
  exec "$@"
}

main "$@"
