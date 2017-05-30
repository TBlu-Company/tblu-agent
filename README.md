# tblu-agent
[![TBLu-A](https://tblu.com.br/static/smallLogo.png)](https://tblu.com.br)

TBlu-A é um projeto da empresa [TBlu Company](https://tblu.com.br) para o agente coletor de metricas e transmissor de coletas.

# Dependencia

## NodeJS
Este projeto  desenvolvido em NodeJS, este é requerido para o seu funcionamento.

[![NodeJS](https://github.com/nodejs/nodejs.org/blob/master/static/images/logos/nodejs.png)](https://nodejs.org)


## Acesso ao NPM (via internet):
Também é necessario o acesso a internet no serviço do NPM para instalação de novas dependencias e modulos

## Acesso ao API TBlu (via internet)
Para o envio e recebimento de metricas e coletas, o acesso ao site **https://api.tblu.com.br** também deve estar liberado

# Como utilizar
Deve se utilizar os parametros **start** ou **service**:

## Start
Incicia o agente coletor:
```sh
$ npm run tblu start
```

## Service
Instala o agente coletor como serviço:
```sh
$ npm run tblu service install
```
## Ajuda
Outros comandos ou informações utilizar:
```sh
$ npm run tblu help
```



# CompanyUUID e ComponenteUUID
Durante a primeira execução, sera soliticado a entrada dos UUIDs da empresa e do componente, esses UUIDs devem ser obtidos no site da TBlu.

# Multiplataforma
O software é multiplataforma, atualmente esta homologado para:
- Windows
- Linux

License
----

TBlu Company

