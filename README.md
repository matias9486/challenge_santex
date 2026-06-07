# challenge_santex
Challenge propuesto por Santex para aplicar lo aprendido en Santex Academy

## Pasos para correr la aplicación

1. Instalar Docker Desktop: Si no lo tienen, es el primer paso.
2. Clonar tu repositorio: 
   
   ```bash
   git clone https://github.com/matias9486/challenge_santex
   ```
3. Navegar a la carpeta del proyecto:
    ```bash
    cd challenge_santex
   ```
4. Copiar las variable de entorno del archivo de ejemplo al de ambiente. El template está completo, ya que no son valores reales, solo para desarrollo
    ```bash
    cp .env.template .env
   ```
5. Levantar todo con: 
   ```bash
    docker compose up
   ```

## Backend y Ejecutar seed
Ingresar la siguiente URL en el navegador para ejecutar el seed y ver documentación del backend: http://localhost:3000/api#/Seed/SeedController_seed

## Frontend
Ingresar la siguiente URL en el navegador para probar la aplicación: http://localhost:4200/
Usuario predefinido al ejecutar seed:
```
  "email": "matias@gmail.com",
  "password": "Matias1234"
```

## Sobre el backend y frontend
https://docs.google.com/document/d/12PD7PiDLasJQluxVoDVmLdZM_vs72uv5O52eP7EtUIk/edit?usp=sharing