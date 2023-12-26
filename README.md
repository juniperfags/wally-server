## Contenido
El presente proyecto contiene lo siguiente:
- Despliegue en fly.io
- Documentación en swagger:
- Test unitarios de los servicios
- Cuatro endpoints: 2 encargados del flujo de cambio de moneda y los otros 2 para el módulo de auth.
- Dockerización

## Instalación
```bash
$ npm install
```

## Swagger
```bash
https://wally-server.fly.dev/docs
```

## Levantar la app
Se recomienda agregar un archivo de configuración .env en la raíz del proyecto antes de iniciar la app localmente


```bash
JWT_SECRET=YOUR_POWERFUL_SECRET_HERE
```
Después

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```

