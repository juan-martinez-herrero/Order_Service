<Goals>
- Reducir rechazos de PR del agente por fallos en CI/validaciones o comportamientos inesperados.
- Minimizar fallos de comandos bash y de build.
- Permitir que el agente complete tareas más rápido, evitando exploración innecesaria (grep/find/code search).
- Entregar un microservicio de órdenes en Node/TypeScript que compile, se pruebe y se ejecute localmente y en CI.
- Facilitar tareas comunes: build, test, run, migraciones y ejecución con Postgres (docker).
- Reducir iteraciones por errores de configuración o integración.
</Goals>

<Limitations>
- Mantener estas instrucciones en un máximo aproximado de 2 páginas.
- No hacerlas específicas de una sola tarea; deben ser generales para el repositorio.
</Limitations>

<WhatToAdd>

<HighLevelDetails>
- Este repositorio contiene una aplicación TypeScript/Node.js con estructura modular:
  - `src/` (código fuente) y `tests/` (pruebas unitarias, integración, e2e).
- Lenguaje y runtimes:
  - Node.js 18 (o 20 si el proyecto lo requiere).
  - Gestor de build: npm o yarn.
- Tamaño aproximado: ~N archivos, ~N KLOC.
- Estándares:
  - Estilo/estático: Checkstyle/SpotBugs/PMD/Spotless (si aplica).
  - Pruebas: vitest + Mockito (si aplica).
</HighLevelDetails>

<BuildInstructions>

- **Bootstrap**:
  - npm install
  - Asegura Node.js 18/20: `node -v` debe coincidir.
  - Instala dependencias: `npm install` o `yarn install`.

- **Build**:
  - Si hay step de build: npm run build
  - Alternativa: npx tsc --build.

- **Test**:
  - Unit: npm test o npx vitest
  - Ejecutar suites específicas: npx vitest tests/domain --run
  - Integración / e2e:
    1. docker-compose up -d
    2. node scripts/migrate.js (o ts-node scripts/migrate.ts)
    3. npm test -- --config tests/e2e o npx vitest tests/e2e

- **Run**:
  - npm start (si existe)
  - node dist/main.js tras build
  - Para desarrollo: npx ts-node-dev src/main.ts (añadir script si falta)


- **Lint/Format** (si está configurado):
  - Revisar package.json para scripts `lint` y `format`. Si no existen, sugerir ESLint + Prettier.
  - Formato rápido: npx prettier --write "src/**/*.ts" "tests/**/*.ts"
  - Lint rápido: npx eslint "src/**/*.ts"

- **Workarounds validados**:
  - Ejecutar tests unitarios sin DB usando InMemoryOrderRepository.
  - Si fallan integraciones por migraciones, ejecutar manualmente scripts/migrate.ts apuntando al contenedor Postgres.
  - Si npm install falla en Windows long paths: git config --system core.longpaths true
  - En Windows, habilita rutas largas: `git config core.longpaths true`.
  - Verifica variables de entorno requeridas (credenciales locales en `.env` o variables del sistema).

- **Versiones** (ejemplo):
  - Node.js >= 18 (LTS)
  - npm moderno (>=9)
  - Postgres recomendado: versión definida en docker-compose.yml
</BuildInstructions>

<ProjectLayout>
- Layout principal:
  - package.json, tsconfig.json, vitest.config.ts, docker-compose.yml
  - src/
    - main.ts
    - application/ (use-cases, dtos, ports)
    - domain/ (entities, value-objects, events)
    - infrastructure/ (http, persistence, logging, messaging, database)
    - composition/ (config, container, PostgresContainer)
  - db/migrations/
  - scripts/migrate.ts
  - tests/ (unit, integration, e2e)
- Raíz:
  - CI: `.github/workflows/deploy.yml` (build + tests + lint).
  - Estático: `checkstyle.xml`, `spotbugs-exclude.xml`, `.editorconfig` (si existen).
- Checks antes de merge:
  - CI debe compilar, pasar tests y aprobar reglas estáticas.
  - (Opcional) Análisis seguridad: `dependency-check`, `owasp`, `codeql`, etc.
- Dependencias no obvias:
  - Variables de entorno para perfiles (dev/test/prod).
  - Certificados/keystores locales (si aplica).
- Índice rápido (ejemplo):
  - `/src`, `/tests`, `tsconfig.json`, `vitest.config.ts`, `docker-compose.yml`, `.github/workflows/*`, `README.md`.
</ProjectLayout>

</WhatToAdd>

<StepsToFollow>
- Revisa `README.md` y `CONTRIBUTING.md` para comandos y convenciones.
- Ejecuta build y tests desde la raíz: npm test o npx vitest
- Si falla algo:
  - Limpia (`clean`), versiones y vuelve a ejecutar.
  - Documenta el error y el workaround correspondiente.
- Para integracion:
   - docker-compose up -d
   - node scripts/migrate.js (o ts-node scripts/migrate.ts)
   - npm test (o npx vitest tests/integration tests/e2e)
- Para ejecutar servidor: npm start o npx ts-node-dev src/main.ts
-Si algo falla: revisar logs en output/terminal y verificar variables de entorno y cadena de conexión en src/composition/config.ts
- Confía en estas instrucciones; solo busca en el repo si falta información o detectas error.
</StepsToFollow>

<Tips>
- Añadir nuevas implementaciones de repositorios implementando el puerto src/application/ports/OrderRepository.ts y registrarlas en src/composition/container.ts.
- Para observar eventos/outbox, revisar src/infrastructure/messaging.
- Usar tests builders en tests/builders.ts para crear fixtures reutilizables.
</Tips>