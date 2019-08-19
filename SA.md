# Laboratorio de Service Accounts

## En este laboratorio revisaremos:
1) Como crear una cuenta de servicio
2) Permisos para administrar y ejecutar una cuenta de servicio (como recurso)
3) Permisos para una cuenta de servicio (como usuario)
4) Ejecutar una aplicación usando una cuenta de servicio


## Obtener nombre de la configuración activa (y guardamos en variable config_activa)
```bash
export config_activa=$(gcloud config configurations list --filter="IS_ACTIVE=True" --format 'value(NAME)')
```

## Obtener nombre del proyecto (y guardamos en variable project)
```bash
export project=$(gcloud projects list --format 'value(PROJECT_ID)')
```

## Guardamos email de usuario developer en la variable dev
```bash
export dev="dev1@instructor.ninja"
```

## Guardamos nombre de cuenta de servicio
```bash
export cuentaDeServicio="cuenta-de-servicio"
```

## Cambiaremos a configuración Developer

### Comprobamos la existencia de la configuracion "developer"
```bash
gcloud config configurations list
```
Si la configuración existe, cambiamos usando siguiente:

### Cambio de configuración (Si Existe)
```bash
gcloud config configurations activate config-$project-dev
```
### Creamos configuración (Si NO Existe)
```bash
gcloud config configurations create config-$project-dev
```
**Asignaremos el proyecto a la configuracion activa (developer)**
```bash
gcloud config set project $project
```

**Autenticarse (cambiaremos de usuario al nuevo developer)**
```bash
gcloud auth login
```

### Volvemos a configuración activa (inicial)
```bash
gcloud config configurations activate $config_activa
```

## Crear cuenta de servicio
```bash
gcloud beta iam service-accounts create $cuentaDeServicio --description "Cuenta de Servicio" --display-name "sa"
```

## Ver lista de servicios
```bash
gcloud beta iam service-accounts list
```

## Damos Rol "Administrador de Objetos de Almacenamiento" a Cuenta de Servicio
```bash
gsutil iam ch serviceAccount:$cuentaDeServicio@$project.iam.gserviceaccount.com:objectAdmin gs://bucket-$project
```

## Damos Rol "Usuario de Cuentas de Servicios" al Developer
```bash
gcloud iam service-accounts add-iam-policy-binding $cuentaDeServicio@$project.iam.gserviceaccount.com --member=user:$dev --role='roles/iam.serviceAccountUser'
```

## Ver Roles de la Cuenta de Servicio
```bash
gcloud iam service-accounts get-iam-policy $cuentaDeServicio@$project.iam.gserviceaccount.com
```

## Instalar dependencias de "Google Storage" para Node.js
```bash
npm install --save @google-cloud/storage
```

## Generar llaves de Cuenta de Servicio (para usar las credenciales de Aplicación)
```bash
gcloud iam service-accounts keys create llaves.json --iam-account $cuentaDeServicio@$project.iam.gserviceaccount.com
```

## Guardamos variable de credenciales de aplicación
```bash
export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/llaves.json
```

## Ejecutamos programa de ejemplo para listar archivos
```bash
node -e 'require("./index.js").listaArchivos()'
```

## Quitamos Rol "Administrador de Objetos" a Cuenta de Servicio
```bash
gsutil iam ch -d serviceAccount:$cuentaDeServicio@$project.iam.gserviceaccount.com:objectAdmin gs://bucket-$project
```

## Obtener politica del Bucket
```bash
gsutil iam get gs://bucket-$project
```

## Ejecutamos programa de ejemplo para listar archivos
```bash
node -e 'require("./index.js").listaArchivos()'
```

## Damos Rol "Administrador de Objetos" a Cuenta de Servicio
```bash
gsutil iam ch serviceAccount:$cuentaDeServicio@$project.iam.gserviceaccount.com:objectAdmin gs://bucket-$project
```

## Quitamos Rol "Visualizador de Proyecto" a Developer
```bash
gcloud projects remove-iam-policy-binding $project --member user:$dev --role roles/viewer
```

## Quitamos Rol "Administrador de Objetos" a Developer
```bash
gsutil iam ch -d user:$dev:objectCreator gs://bucket-$project
```

## Obtener politica del Bucket, actualziada.
```bash
gsutil iam get gs://bucket-$project
```

## Listaremos el contenido del bucket
```bash
gsutil ls gs://bucket-$project
```

## Cambiaremos a la configuración Developer
```bash
gcloud config configurations activate config-$project-dev
```

## Listaremos el contenido del bucket
```bash
gsutil ls gs://bucket-$project
```

## Ejecutamos
```bash
node -e 'require("./index.js").listaArchivos()'
```
