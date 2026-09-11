#!/bin/sh
# Sync Hugo search indexes to Algolia (atomic-algolia) during production builds.
# Credentials come from Vercel env: ALGOLIA_APP_ID / ALGOLIA_ADMIN_KEY.
if [ "$VERCEL_ENV" != "production" ] || [ -z "$ALGOLIA_APP_ID" ]; then
  echo "[algolia] skip index sync (not production or ALGOLIA_APP_ID unset)"
  exit 0
fi

# EN site lives at the root, ZH under /zh/
ALGOLIA_INDEX_NAME=index.en ALGOLIA_INDEX_FILE=./public/search.json npm run algolia --silent
ALGOLIA_INDEX_NAME=index.zh-cn ALGOLIA_INDEX_FILE=./public/zh/search.json npm run algolia --silent
