# aws-project
AWS Project

# Entrega Final: API REST SICEI

Este proyecto implementa una API REST en **Node.js con Express** que migra la persistencia de datos a **Amazon RDS** y se integra con múltiples servicios de AWS para gestionar la información y sesiones de Alumnos

### **Tecnología**
* **Framework:** Express.js (JavaScript).
* **Base de Datos:** Amazon RDS (Relational Database Service) con **Sequelize ORM**.
* **Sesiones:** Amazon DynamoDB para el almacenamiento de sesiones.
* **Archivos:** Amazon S3 para el almacenamiento de fotos de perfil.
* **Notificaciones:** Amazon SNS para el envío de correos electrónicos.


### **Entidades y Campos**

| Entidad | Campos Clave | 
| :--- | :--- | 
| **Alumno** | `id`, `nombres`, `apellidos`, `matricula`, `promedio` `password`, `fotoPerfilUrl` |
| **Profesor** | `id`, `numeroEmpleado`, `nombres`, `apellidos`, `horasClase` | 


### **Endpoints y Códigos HTTP**

|   Método   | Ruta                           | Función                                           |
| :--------: | :----------------------------- | :------------------------------------------------ |
|   **GET**  | `/alumnos`                     | Listar todos los alumnos                          |
|   **GET**  | `/alumnos/{id}`                | Obtener alumno por ID                             |
|  **POST**  | `/alumnos`                     | Crear nuevo alumno                                |
|   **PUT**  | `/alumnos/{id}`                | Actualizar alumno por ID                          |
| **DELETE** | `/alumnos/{id}`                | Eliminar alumno por ID                            |
|  **POST**  | `/alumnos/{id}/fotoPerfil`     | Subir foto de perfil a S3                         |
|  **POST**  | `/alumnos/{id}/email`          | Enviar correo                                     |
|  **POST**  | `/alumnos/{id}/session/login`  | Crear sesión                                      |
|  **POST**  | `/alumnos/{id}/session/verify` | Verificar sesión                                  |
|  **POST**  | `/alumnos/{id}/session/logout` | Cerrar sesión                                     |


|   Método   | Ruta               | Función                     |
| :--------: | :----------------- | :-------------------------- |
|   **GET**  | `/profesores`      | Listar todos los profesores |
|   **GET**  | `/profesores/{id}` | Obtener profesor por ID     |
|  **POST**  | `/profesores`      | Crear nuevo profesor        |
|   **PUT**  | `/profesores/{id}` | Actualizar profesor por ID  |
| **DELETE** | `/profesores/{id}` | Eliminar profesor por ID    |


### **Instalación y Ejecución**

Para ejecutar en el servidor:

1.  Asegurar que todas las variables de entorno estén configuradas.
2.  Instalar dependencias: `npm install`.
3.  Ejecución: `node index.js`.