
# Guía de Instalación y Ejecución de Thinkia Voice

Esta guía te ayudará a instalar y ejecutar el proyecto en tu ordenador paso a paso.

## 1. Requisitos Previos
Antes de empezar, necesitas tener instalado **Node.js**:
- Descárgalo e instálalo desde aquí: [https://nodejs.org/es/download/prebuilt-installer](https://nodejs.org/es/download/prebuilt-installer)
- Elige la versión **LTS** (Recomendada).

## 2. Descargar el Proyecto
1.  Si tienes acceso al repositorio, clónalo o descarga el ZIP:
    -   GitHub: [https://github.com/maanuuvegasCreator/Thinkia_Voice](https://github.com/maanuuvegasCreator/Thinkia_Voice)
2.  Si descargaste el ZIP, descomprímelo en una carpeta de tu elección.

## 3. Instalar Dependencias
1.  Abre una terminal (PowerShell, CMD, o la terminal de VS Code).
2.  Navega hasta la carpeta del proyecto:
    ```bash
    cd ruta/a/tu/carpeta/Call_Center_Demo
    ```
3.  Ejecuta el siguiente comando para instalar las librerías necesarias:
    ```bash
    npm install
    ```

## 4. Configurar Variables de Entorno
El proyecto necesita una clave de API para funcionar correctamente.
1.  En la carpeta del proyecto, verás un archivo llamado `.env.example`.
2.  Haz una copia de este archivo y renómbralo a `.env`.
3.  Abre el archivo `.env` con un editor de texto (Bloc de notas, VS Code, etc.).
4.  Pega tu clave de API de ElevenLabs donde dice `tu_api_key_aqui`:
    ```env
    VITE_ELEVENLABS_API_KEY=sk_tu_clave_real_de_elevenlabs
    ```
    *(Pídele esta clave a Manuel si no la tienes)*.

## 5. Ejecutar la Aplicación
1.  En la terminal, ejecuta:
    ```bash
    npm run dev
    ```
2.  Verás un mensaje como este:
    ```
    Local:   http://localhost:5173/
    ```
3.  Abre ese enlace en tu navegador para ver la aplicación.

## Solución de Problemas
- **Error "npm no se reconoce"**: Asegúrate de haber instalado Node.js y reiniciado tu ordenador.
- **Error de API**: Verifica que la clave en `.env` sea correcta y el archivo se llame exactamente `.env`.
