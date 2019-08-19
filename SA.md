# Laboratorio de Service Accounts

## En este laboratorio revisaremos:
1) Como crear una cuenta de servicio
2) Permisos para administrar y ejecutar una cuenta de servicio (como recurso)
3) Permisos para una cuenta de servicio (como usuario)
4) Ejecutar una aplicación usando una cuenta de servicio

## Configuración Inicial (4 pasos)

### Paso 1 - Obtener nombre de la configuración activa (y guardamos en variable config_activa)
```bash
export config_activa=$(gcloud config configurations list --filter="IS_ACTIVE=True" --format 'value(NAME)')
```

### Paso 2 - Obtener nombre del proyecto (y guardamos en variable project)
```bash
export project=$(gcloud projects list --format 'value(PROJECT_ID)')
```

### Paso 3 - Guardamos email de usuario developer en la variable dev
```bash
export dev="dev1@instructor.ninja"
```

### Paso 4 - Guardamos nombre de cuenta de servicio
```bash
export cuentaDeServicio="cuenta-de-servicio"
```

### Paso 5 - Asignamos proyecto a configuración actual
```bash
gcloud config set project $project
```

## Cambiaremos a configuración Developer (2 ó 4 pasos)

### Paso 1 - Comprobamos la existencia de la configuracion "developer"
```bash
gcloud config configurations list
```
Si la configuración existe, cambiamos usando siguiente:

### Paso 2 - Cambio de configuración (Si Existe)
```bash
gcloud config configurations activate config-$project-dev
```
### Paso 2.1 - Creamos configuración (Si NO Existe)
```bash
gcloud config configurations create config-$project-dev
```
**Paso 2.1.3 Asignaremos el proyecto a la configuracion activa (developer)**
```bash
gcloud config set project $project
```

**Paso 2.1.3 Autenticarse (cambiaremos de usuario al nuevo developer)**
```bash
gcloud auth login
```

### Paso 2.1.3 Volvemos a configuración activa (inicial)
```bash
gcloud config configurations activate $config_activa
```

## Crear cuenta de servicio (4 pasos)
```bash
gcloud beta iam service-accounts create $cuentaDeServicio --description "Cuenta de Servicio" --display-name "sa"
```

### Paso 1 - Ver lista de servicios
```bash
gcloud beta iam service-accounts list
```

### Paso 2 - Damos Rol "Administrador de Objetos de Almacenamiento" a Cuenta de Servicio
```bash
gsutil iam ch serviceAccount:$cuentaDeServicio@$project.iam.gserviceaccount.com:objectAdmin gs://bucket-$project
```

### Paso 3 - Damos Rol "Usuario de Cuentas de Servicios" al Developer
```bash
gcloud iam service-accounts add-iam-policy-binding $cuentaDeServicio@$project.iam.gserviceaccount.com --member=user:$dev --role='roles/iam.serviceAccountUser'
```

### Paso 4 - Ver Roles de la Cuenta de Servicio (Veremos al Developer)
```bash
gcloud iam service-accounts get-iam-policy $cuentaDeServicio@$project.iam.gserviceaccount.com
```

## Ejecutar Aplicacion usando la Cuenta de Servicio (4 pasos)

### Paso 1 - Instalar dependencias de "Google Storage" para Node.js
```bash
npm install --save @google-cloud/storage
```

### Paso 2 - Generar llaves de Cuenta de Servicio (para usar las credenciales de Aplicación)
```bash
gcloud iam service-accounts keys create llaves.json --iam-account $cuentaDeServicio@$project.iam.gserviceaccount.com
```

### Paso 3 - Guardamos variable de credenciales de aplicación
```bash
export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/llaves.json
```

### Paso 4 - Ejecutamos programa de ejemplo para listar archivos
```bash
node -e 'require("./index.js").listaArchivos()'
```
## Prueba de Roles y Permisos para la cuenta de Servicio (4 pasos)

### Paso 1 - Quitamos Rol "Administrador de Objetos" a Cuenta de Servicio
```bash
gsutil iam ch -d serviceAccount:$cuentaDeServicio@$project.iam.gserviceaccount.com:objectAdmin gs://bucket-$project
```

### Paso 2 - Obtener politica del Bucket
```bash
gsutil iam get gs://bucket-$project
```

### Paso 3 - Ejecutamos programa de ejemplo para listar archivos
```bash
node -e 'require("./index.js").listaArchivos()'
```

### Paso 4 - Devolvemos el Rol "Administrador de Objetos" a Cuenta de Servicio (dejamos como estaba)
```bash
gsutil iam ch serviceAccount:$cuentaDeServicio@$project.iam.gserviceaccount.com:objectAdmin gs://bucket-$project
```
## Prueba de Roles y Permisos para Usuario (Developer) y Cuenta de Servicio (5 pasos)

### Paso 1 - Quitamos Rol "Visualizador de Proyecto" a Developer
```bash
gcloud projects remove-iam-policy-binding $project --member user:$dev --role roles/viewer
```

### Paso 2 - Quitamos Rol "Administrador de Objetos" a Developer
```bash
gsutil iam ch -d user:$dev:objectCreator gs://bucket-$project
```

### Paso 3 - Obtener politica del Bucket, actualziada.
```bash
gsutil iam get gs://bucket-$project
```

### Paso 4 - Cambiaremos a la configuración Developer
```bash
gcloud config configurations activate config-$project-dev
```

### Paso 5 - Listaremos el contenido del bucket
```bash
gsutil ls gs://bucket-$project
```

### Paso 5 - Ejecutamos
```bash
node -e 'require("./index.js").listaArchivos()'
```
