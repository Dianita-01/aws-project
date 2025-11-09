# aws-project
AWS Project

# Primera Entrega: API REST SICEI

Este proyecto implementa una API REST simple en **Node.js con Express** para gestionar dos entidades: Alumnos y Profesores.

### **Tecnología**
**Framework:** Express.js (JavaScript).

### **Endpoints y Códigos HTTP**

| Método | Ruta | Función | 
| :---: | :--- | :--- | 
| **GET** | `/alumnos` | Listar todos | 
| **GET** | `/alumnos/{id}` | Obtener por ID | 
| **POST** | `/alumnos` | Crear nuevo alumno | 
| **PUT** | `/alumnos/{id}` | Actualizar por ID | 
| **DELETE** | `/alumnos/{id}` | Eliminar por ID | 
| **GET** | `/profesores` | Listar todos | 
| **GET** | `/profesores/{id}` | Obtener por ID | 
| **POST** | `/profesores` | Crear nuevo profesor |
| **PUT** | `/profesores/{id}` | Actualizar por ID | 
| **DELETE** | `/profesores/{id}` | Eliminar por ID | 

### **Instalación y ejecución**
Instalar dependencias: npm install
Ejecución: node index.js