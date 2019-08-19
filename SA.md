# Laboratorio de Service Accounts

## En este laboratorio revisaremos:
1) Como crear una cuenta de servicio


## Obtener nombre de la configuración activa (y guardamos en variable config_activa)
```bash
export config_activa=$(gcloud config configurations list --filter="IS_ACTIVE=True" --format 'value(NAME)')
```

## Obtener nombre del proyecto (y guardamos en variable project)
```bash
export project=$(gcloud projects list --format 'value(PROJECT_ID)')
```

## Guardamos email de nuevo usuario administrador en la variable admin
```bash
export admin="admin1@instructor.ninja"
```

## Guardamos email de nuevo usuario developer en la variable dev
```bash
export dev="dev1@instructor.ninja"
```

## Guardamos nombre de cuenta de servicio
```bash
export cuentaDeServicio="cuenta-de-servicio"
```

## Damos Rol de "Service Accounts Admin" a usuario Admin
```bash
gcloud projects add-iam-policy-binding $project --member user:$admin --role roles/iam.serviceAccountAdmin
```

## Cambiaremos a la configuración Administrador
```bash
gcloud config configurations activate config-$project-admin
```

## Crear cuenta de servicio
```bash
gcloud beta iam service-accounts create $cuentaDeServicio --description "Cuenta de Servicio" --display-name "sa"
```

## Ver lista de servicios
```bash
gcloud beta iam service-accounts list
```

## Damos Rol "Administrador de Objetos" a Cuenta de Servicio
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

## Instalar dependencias de "Storage" para Node.js
```bash
npm install --save @google-cloud/storage
```

## Generar llaves
```bash
gcloud iam service-accounts keys create llaves.json --iam-account $cuentaDeServicio@$project.iam.gserviceaccount.com
```

## Guardamos variable de credenciales de aplicación
```bash
export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/llaves.json
```

## Ejecutamos
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

## Damos Rol "Administrador de Objetos" a Cuenta de Servicio
```bash
gsutil iam ch -d serviceAccount:$cuentaDeServicio@$project.iam.gserviceaccount.com:objectAdmin gs://bucket-$project
```

## Ejecutamos
```bash
node -e 'require("./index.js").listaArchivos()'
```
