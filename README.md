# Gearbox Graph

## Building
```
graph codegen # for generating binding for abis
graph build # building final config and code for graph
```
## Deployment steps
```
graph auth --product hosted-service <graph-api-key>
graph deploy --product hosted-service harsh-98/sample 
```

## Queries
Some gearbox related queries are present [here](queries/) and [graph interface](https://thegraph.com/hosted-service/subgraph/harsh-98/sample)