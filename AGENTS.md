You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Repo Context
- DARTS Portal is an Angular app served via a Node.js Express server
- Local dev uses Yarn and Node 22+
- Tests use Jest (unit/integration) and Cypress (e2e with axe-core WCAG 2.2 AA checks)

## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images
  - `NgOptimizedImage` does not work for inline base64 images

## Accessibility Requirements
- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Review Guidelines (DARTS Portal)

### Overview
- Apply these rules when reviewing changes; focus on P0/P1 blockers and use the required comment format.

### Scope and Process
- Apply rules to changes in the PR only.
- Prefer specific, line-anchored feedback with rationale and concrete fixes.
- Treat P0 and P1 as blocking; treat P2 as advisory.

### Repo Scope
- DARTS Portal is an Angular v20+ standalone app using GOV.UK/HMCTS design system patterns.
- Prefer modern Angular primitives (standalone components, template control flow, signals).
- Ensure accessibility aligns with WCAG 2.2 AA.

### P0 Rules (Blockers)

#### Security and Safety
- Avoid unsanitised HTML or `bypassSecurityTrust*` without justification and tests.
- Avoid interpolating user data into `[innerHTML]`, `[srcdoc]`, or `style`, and avoid unsafe URL handling.
- Avoid credentials, tokens, secrets, or PII in code, logs, comments, or tests.

#### Accessibility
- Keep interactive elements keyboard reachable; do not put `click` handlers on non-interactive elements without proper roles/tabindex.
- Provide visible labels or `aria-label` for form controls and buttons; ensure images have meaningful `alt`.

#### Architecture and Build Integrity
- Use standalone components/routes/providers; avoid adding Angular modules when standalone is appropriate.
- Avoid mixing signals and imperative RxJS in ways that cause side-effects in template evaluation.
- Avoid barrel exports (`index.ts`, `export *`) and barrel imports; use direct imports.
- Avoid CI/test failures, TypeScript errors, or missing required checks.

### P1 Rules (High Priority)

#### Angular Correctness
- Prefer `@if`, `@for`, `@switch` over legacy structural directives in new/changed templates.
- Use computed signals and pure functions for derived state; avoid methods with side effects in templates.
- Choose RxJS concurrency intentionally: `switchMap` for latest-only, `exhaustMap` for form submit, `concatMap` when order matters.
- Prefer the `async` pipe for template-owned subscriptions where possible, rather than subscribing imperatively in the component.
- Avoid nested `subscribe()` calls inside observable chains, especially when the outer stream is already consumed by the template or `async` pipe.
- Do not use `tap()` to trigger dependent HTTP requests that mutate component state used for guards, navigation, or rendering.
- Prefer composing dependent requests into one stream with `switchMap`, `combineLatest`, or `forkJoin`, and ensure derived state is cleared when the source value is absent.

#### Code Quality Fundamentals
- Use clear, descriptive names; avoid abbreviations that obscure intent.
- Keep components and services small and cohesive; extract helpers for readability.
- Prefer simple, readable code; add comments that explain why decisions were made.
- Apply modern Angular features in new/changed code.

#### Performance
- Avoid heavy work in templates (no `.map()`/`.filter()` or non-pure pipes in bindings).
- Lazy-load routes and large features; avoid broad shared providers when a standalone provider suffices.
- Guard against large third-party dependencies; note size and reason if introduced.

#### Testing
- Add or maintain tests for new logic and error/empty states.
- Prefer Angular Testing Library/Harnesses; avoid brittle DOM selectors/data-testids when a Harness exists.

#### Function Design
- Prefer small, single-purpose, pure functions.
- Keep cyclomatic complexity low.
- Pass explicit inputs and return data rather than performing side effects.

### Green Coding and Efficiency
- Favor OnPush change detection; avoid computing logic inside templates.
- Prefer `async` pipe for subscription management; clean up manual subscriptions with `takeUntil()` and `ngOnDestroy`.
- Use `@ViewChild` and `@ViewChildren` over direct DOM references.
- Clean up timers, event listeners, and subscriptions on destruction.
- Prefer lazy-loaded modules and deferrable views.
- Use `track` expressions in `@for`.
- Cache API/HTTP responses that do not change frequently.
- Avoid binding new object/array literals in templates; compute once in a signal or helper.
- Prefer pure pipes or computed signals over inline operations that allocate each change detection.
- Throttle or debounce high-frequency events before updating state.
- Avoid long-running synchronous work; offload heavy computation to Web Workers.
- Use native browser and Angular APIs over large libraries for simple operations.
- Optimize images and prefer SVG icons.
- Avoid unnecessary DOM depth and wrappers.

### P2 Rules (Advisory)
- Prefer container vs presentational component separation when complexity grows.
- Keep features self-contained by default; avoid barrels and prefer direct imports.
- Provide brief inline docs when introducing patterns others should copy.
- Keep shared definition files (`*.interface.ts`, `*.type.ts`, `*.constant.ts`, `*.mock.ts`) isolated and side-effect free; prefer one export per file, and avoid re-exports, runtime logic, or framework-specific dependencies. If a small set of constants are always used together, prefer a single exported object with an explicit shape over multiple single-constant files.
- Prefer explicit file suffixes to indicate responsibility (`.component`, `.service`, `.directive`, `.pipe`, `.interface`, `.type`, `.constant`, `.mock`, etc.); avoid unsuffixed files unless they are pure, framework-agnostic helpers.

### Ignore Unless Requested
- Ignore typos in comments/docs unless critical.
- Ignore pure formatting churn without semantic change.

