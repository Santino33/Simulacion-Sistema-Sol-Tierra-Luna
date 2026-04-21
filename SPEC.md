# Simulación Sistema Sol-Tierra-Luna

## Descripción

Aplicación web completa que simula el sistema restringido de tres cuerpos (Sol-Tierra-Luna) utilizando el integrador numérico Runge-Kutta de cuarto orden (RK4).

## Características

### Física
- **Integrador**: RK4 (Runge-Kutta 4to orden) - implementación manual
- **Gravedad**: Ley de gravitación universal de Newton
- **Sistema**: 3 cuerpos (Sol, Tierra, Luna)
- **Métricas**: Energía cinética, potencial, total y error de conservación

### UI/UX
- Visualización 3D con React Three Fiber
- Panel de control con sliders y inputs
- Gráfico de energía en tiempo real
- Comparador numérico para diferentes dt
- Dark mode por defecto
- Animaciones fluidas con Framer Motion

### Controles
- dt: 1 segundo a 30 días
- Masas configurables
- Velocidades iniciales editables
- Vista 2D/3D
- Play/Pause/Reset

## Cómo ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## Arquitectura

```
src/
├── components/
│   ├── ui/              # shadcn/ui
│   ├── simulation/      # Canvas3D, Body, Scene
│   ├── controls/        # ControlPanel, Playback, Comparator
│   └── metrics/         # EnergyChart, MetricsGrid
├── hooks/
│   └── useSimulation.ts
├── lib/physics/
│   ├── constants.ts     # Constantes físicas
│   ├── derivatives.ts   # Ecuaciones diferenciales
│   ├── integrator.ts    # RK4
│   └── energy.ts        # Cálculo de energías
├── stores/
│   └── simulationStore.ts  # Zustand
└── types/
    └── physics.ts       # Interfaces
```

## Constantes Físicas

| Constante | Valor |
|-----------|-------|
| G | 6.67430e-11 m³/(kg·s²) |
| M_Sol | 1.989e30 kg |
| M_Tierra | 5.972e24 kg |
| M_Luna | 7.348e22 kg |
| 1 UA | 1.495978707e11 m |

## Condiciones Iniciales

| Cuerpo | Posición (m) | Velocidad (m/s) |
|--------|-------------|-----------------|
| Sol | (0, 0, 0) | (0, 0, 0) |
| Tierra | (1.496e11, 0, 0) | (0, 2.978e4, 0) |
| Luna | (1.4998e11, 0, 0) | (0, 3.022e4, 0) |

## RK4 Implementation

```typescript
// Estado: { positions: Vector3[], velocities: Vector3[] }

// k1 = f(t, U)
// k2 = f(t + dt/2, U + dt*k1/2)
// k3 = f(t + dt/2, U + dt*k2/2)
// k4 = f(t + dt, U + dt*k3)

// U(t+dt) = U(t) + dt*(k1 + 2*k2 + 2*k3 + k4)/6
```

## Mejoras Futuras

- [ ] Web Workers para cálculos físicos
- [ ] Más cuerpos celestes
- [ ] Modo realista vs simplificado
- [ ] Exportar datos de simulación
- [ ] Pantallas completas
- [ ] Optimización de rendimiento