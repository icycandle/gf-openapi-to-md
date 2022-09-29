
default:
  yarn build && ./dist/index.js openapi.json > openapi.md && cat openapi.md

md:
  yarn build && ./dist/index.js openapi.json > openapi.md

up:
  wget http://localhost:8000/openapi.json -O openapi.json && yarn build && ./dist/index.js openapi.json > openapi.md && python upload_hackmd.py up --node-id=CFD9wOLJQ06RqQtfOmtKqw

pb:
  wget http://localhost:8000/openapi.json -O openapi.json && yarn build && ./dist/index.js openapi.json | pbcopy


