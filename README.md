# Envíos KIAN - Plataforma de Remesas

![Envíos KIAN Logo](https://via.placeholder.com/150x50/146EBE/FFFFFF?text=ENVIOS+KIAN)

## 📋 Descripción del Proyecto

Envíos KIAN es una plataforma moderna para la gestión de remesas internacionales, diseñada para facilitar el envío de dinero entre diferentes países. El sistema está optimizado para proporcionar una experiencia de usuario intuitiva y eficiente tanto en dispositivos móviles como en escritorio.

### Características Principales

- Panel de cliente con gestión de remesas
- Sistema de beneficiarios favoritos
- Multi-moneda con conversión en tiempo real
- Métodos de pago y recepción variados (QR, transferencia bancaria)
- Diseño responsivo con soporte para modo oscuro
- Interfaz moderna con animaciones y transiciones fluidas
- Indicadores de tipos de cambio en tiempo real con efectos visuales elegantes

## 🔧 Tecnologías Utilizadas

- **Framework Frontend**: Vue.js 3 con Composition API
- **Sistema de Rutas**: Vue Router
- **Gestión de Estado**: Pinia
- **CSS**: Tailwind CSS
- **Iconos**: Font Awesome
- **Empaquetador**: Vite

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior)

### Pasos de Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/kian-envios/ENVIOS-KIAN.git
   cd ENVIOS-KIAN
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Compilar para producción:
   ```bash
   npm run build
   ```

## 📁 Estructura del Proyecto

```
ENVIOS-KIAN/
├── src/                     # Código fuente
│   ├── assets/              # Recursos estáticos (imágenes, etc.)
│   ├── components/          # Componentes Vue reutilizables
│   ├── paginas/             # Componentes de página
│   │   ├── cliente/         # Módulo de cliente
│   │   │   ├── P_cliente.vue       # Componente principal de cliente
│   │   │   ├── MisRemesas.vue      # Gestión de remesas
│   │   │   ├── ModalRemesas.vue    # Contenedor de modales para remesas
│   │   │   ├── ModalPasosEnvios.vue # Componente base para modales con pasos
│   │   │   ├── MisRemesasTerminos.vue # Modal de términos y condiciones
│   │   │   ├── MisRemesasNueva.vue # Modal de nueva remesa
│   │   │   ├── MisRemesasPago.vue  # Modal de método de pago
│   │   │   ├── MisRemesasResumen.vue # Modal de resumen
│   │   │   ├── MisRemesasDetalle.vue # Modal de detalles
│   │   │   ├── Beneficiarios.vue   # Gestión de beneficiarios
│   │   │   ├── navbar.vue          # Barra de navegación
│   │   │   └── Sidebar.vue         # Barra lateral
│   ├── comun/               # Código común y utilitarios
│   ├── stores/              # Tiendas Pinia para gestión de estado
│   │   └── layoutStore.js   # Estado del layout responsivo
│   ├── router.js            # Configuración de rutas
│   ├── App.vue              # Componente raíz
│   ├── main.js              # Punto de entrada
│   ├── style.css            # Estilos globales
│   └── tailwind.css         # Importación de Tailwind
├── tailwind.config.js       # Configuración de Tailwind
├── vite.config.js           # Configuración de Vite
├── package.json             # Dependencias y scripts
└── README.md                # Este archivo
```

## 📘 Guía de Uso

### Sistema de Diseño

El proyecto utiliza un esquema de colores basado en azul (#146EBE) con las siguientes variables CSS globales:

```css
:root {
  --color-bg-primary: #ffffff;
  --color-blue-primary: #146EBE;
  --color-blue-secondary: #4c9ed9;
  /* ... otras variables ... */
}

.dark {
  --color-bg-primary: #2A3942;
  --color-bg-secondary: #202C33;
  /* ... otras variables de modo oscuro ... */
}
```

### Componentes Principales

#### Layout Responsivo

El sistema cuenta con un layout responsivo que adapta la interfaz según el tamaño de pantalla:

- **Desktop**: Muestra el sidebar completo y todas las opciones del menú
- **Mobile**: El sidebar se oculta y se puede mostrar mediante un botón hamburguesa

```javascript
// Ejemplo de uso del store de layout
import { useLayoutStore } from '../stores/layoutStore'

const layoutStore = useLayoutStore()
// Acceder al estado: layoutStore.isMobile, layoutStore.isSidebarOpen
// Acciones: layoutStore.toggleSidebar(), layoutStore.closeSidebar()
```

#### Sistema de Modales

El sistema utiliza un enfoque modular para los modales:

1. **ModalRemesas.vue**: Componente contenedor que gestiona todos los modales relacionados con remesas
2. **ModalPasosEnvios.vue**: Componente base para modales de múltiples pasos con indicadores de progreso
3. **Modales específicos**: Componentes individuales para cada funcionalidad (términos, nueva remesa, pago, etc.)

Ejemplo de uso de modales:

```javascript
// En MisRemesas.vue
import ModalRemesas from './ModalRemesas.vue'

// Estados para los modales
const showTermsModal = ref(false)
const showRemittanceModal = ref(false)
const currentStep = ref(1)

// Y en el template
<ModalRemesas 
  :showTermsModal="showTermsModal"
  :showRemittanceModal="showRemittanceModal" 
  :currentStep="currentStep"
  @acceptTerms="acceptTerms"
  @goToPayment="goToPayment"
/>
```

#### Tarjetas de Tipos de Cambio

El componente MisRemesas.vue incluye tarjetas interactivas que muestran los tipos de cambio:

- **Tipo estándar**: Muestra la tasa de cambio normal
- **Tipo especial**: Muestra una tasa preferencial con efectos visuales mejorados

Las tarjetas implementan:
- Efectos de vidrio (glassmorphism) con transparencias
- Animaciones sutiles en hover
- Efecto de brillo que recorre las tarjetas
- Diseño totalmente adaptable a modo claro y oscuro

```javascript
// Datos para los tipos de cambio
const cambioEstandar = ref(1.08)
const cambioEspecial = ref(1.09)
const fechaActualizacion = ref(new Date().toLocaleDateString('es-ES'))
```

### Convenciones de Código

- **Componentes**: Utilizan PascalCase para nombres de archivo (ej. `MisRemesas.vue`)
- **Variables**: Utilizan camelCase
- **CSS**: Se utilizan clases de Tailwind CSS y variables CSS personalizadas
- **Rutas**: Definidas en router.js con estructura jerárquica

## 🌙 Modo Oscuro

El proyecto soporta modo oscuro que se puede alternar mediante el componente `ThemeToggle`. El modo oscuro aplica un esquema de colores diferente definido en las variables CSS del tema.

## 📱 Responsividad

La aplicación está diseñada para funcionar en diferentes tamaños de pantalla:

- Móvil (<640px)
- Tablet (640px - 1024px)
- Desktop (>1024px)

El manejo responsivo se gestiona mediante:

1. Media queries de Tailwind CSS
2. Variables CSS personalizadas (en App.vue)
3. Estado compartido con Pinia (layoutStore.js)

## 🔄 Flujo de Trabajo de Remesas

1. El usuario inicia una nueva remesa desde la vista de MisRemesas
2. Acepta los términos y condiciones
3. Selecciona o crea un beneficiario
4. Especifica montos y métodos de envío
5. Confirma los detalles de la transacción
6. Recibe una notificación de éxito

## 🔄 Actualizaciones Recientes

### Versión 2.0.1 (Mayo 2023)

- **Refactorización del sistema de modales**: Separación de cada modal en componentes individuales con responsabilidad única
- **Nuevo componente ModalRemesas.vue**: Centraliza y gestiona todos los modales relacionados con remesas
- **Mejora visual con tarjetas de tipos de cambio**: Implementación de tarjetas interactivas con efectos de glassmorphism
- **Optimización de espaciado**: Ajustes en los márgenes y padding para una experiencia más compacta y elegante
- **Mejoras de rendimiento**: Reducción del tamaño de componentes y mejor distribución de responsabilidades

## 🤝 Contribución

Para contribuir al proyecto:

1. Asegúrate de seguir las convenciones de código
2. Crea una rama para tu característica o corrección
3. Envía un pull request con una descripción clara

## 📝 Notas Adicionales

- El proyecto utiliza Font Awesome para iconos
- Se recomienda Visual Studio Code con la extensión Volar para desarrollar

---

Desarrollado para Envíos KIAN © 2023
