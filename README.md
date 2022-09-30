# openapi-to-md

## description

OpenAPI(v2,v3) => Markdown

- It supports 'v2' and 'v3' formats of OpenAPI.
- You can use 'json' and 'yaml' as input files.
- The output data structure is in TypeScript format.
- The reference does not resolve the second reference because it avoids recursion.

## usage

```
Usage: openapi-to-md [options] <source> [destination]

Options:
  -V, --version  output the version number
  -s, --sort     sort (default: false)
  -h, --help     display help for command
```

```sh
openapi-to-md -s openapi.yaml README.md
openapi-to-md openapi.yaml README.md
openapi-to-md openapi.json > README.md
```

## TODO

> This is project convert openapi to readme

- infra: read / save / upload 
- interface: cli
- application: what kind layout and order we want (provide interface)
- domain: json-schema > json > markdown (DDD part) (provide interface)

