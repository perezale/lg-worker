
# Orquestador

Este módulo gestiona el estado del pipeline de procesamiento y se implementa sobre las Azure Functions V3.

## Requerimientos

* Node v12.x

## Dependencias

* Módulo grobo-api

## Instalación

```sh
cd back-end/orquestador
npm install
```

Para desarrollo, copiar archivo de configuración indicando las variables en cada caso

local.settings.json
```sh
cp local.settings.ts.sample local.settings.ts
```

### Ambiente de desarrollo

Se recomienda el uso de __VS Code__ con las siguientes extensiones:

* Azure Storage

\* Puede requerir una cuenta de Azure activa

* Azurite V2 (Storage Emulator) para pruebas sobre Object Storage de forma local. Si se usa Azurite localmente, crear Blob Container 'tiles'.

  ```sh
  npm install -g azurite
  mkdir -p ~/.azurite/workspace
  azurite-blob -l ~/.azurite/workspace
  ```

## Troubleshooting

Si tenes una versión de Node incompatible, instalar nvm (gestor de versiones y agregar la versión 12.x)

Podés ver las versiones disponibles con ``` nvm ls-remote```

Instalar nvm y setear como default para usarse en la terminal de VS Code

```sh
nvm install 12.18.4
nvm alias default 12.18.4
```