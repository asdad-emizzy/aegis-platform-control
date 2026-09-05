# Lovable Independence Rule

This project must remain independent of Lovable-specific runtime, build, configuration, branding, and tooling dependencies.

Lovable may be used as a development/generation environment, but Lovable must not become an architectural dependency of the application.

## Rules

### 1. No Lovable Runtime Dependency

Do not introduce or retain Lovable-specific packages, plugins, wrappers, runtime services, or build dependencies unless explicitly required and approved.

Prefer official/native framework packages and configuration.

Examples:

- Standard Vite configuration instead of Lovable Vite wrappers.
- Official TanStack Start/Vite configuration instead of Lovable-specific abstractions.
- Standard React, TypeScript, Tailwind, Nitro, and other framework tooling.

### 2. No Lovable Branding

Do not introduce Lovable branding into the application.

This includes:

- Lovable logos
- Lovable icons
- Lovable favicons
- Lovable badges
- Lovable images
- Lovable metadata
- Lovable page titles
- Lovable URLs intended only for branding

Preserve the application's own product identity and branding.

### 3. No Lovable-Specific Architecture

Application architecture must not depend on Lovable.

Business logic, domain logic, APIs, authentication, authorization, persistence, integrations, routing, and UI behavior must remain framework/application-owned.

Do not create abstractions whose only purpose is to support Lovable.

### 4. Prefer Portable Configuration

When configuring the application:

- Prefer official framework configuration.
- Prefer standard package-manager scripts.
- Prefer standard environment variables.
- Prefer repository-local configuration.
- Avoid hidden platform-specific behavior.
- Avoid generated configuration that cannot be understood or maintained outside Lovable.

### 5. Dependency Discipline

Do not add dependencies merely because Lovable recommends or generates them.

Before adding a dependency, determine whether it is:

1. Required by the application.
2. Required by the chosen framework.
3. Required by an actual external integration.

If none apply, do not add it.

Remove dependencies that become unused after refactoring.

Do not perform unrelated dependency upgrades.

### 6. Preserve Existing Behavior

Lovable independence is a decoupling concern, not a redesign.

When removing Lovable coupling:

- Preserve business behavior.
- Preserve domain boundaries.
- Preserve API contracts.
- Preserve routes.
- Preserve authentication.
- Preserve authorization.
- Preserve integrations.
- Preserve existing UI functionality.
- Preserve framework architecture.

Only change what is necessary to remove Lovable coupling.

### 7. Before Adding Platform-Specific Code

If a proposed change introduces a platform-specific dependency, first ask:

> Can this be implemented using the application's existing framework or a standard/open-source package instead?

Prefer the portable solution.

### 8. Continuous Lovable Reference Audit

When modifying project configuration, dependencies, build tooling, or application metadata, check for accidental introduction of:

- `lovable`
- `Lovable`
- `lovable.dev`
- `.lovable`
- Lovable-specific packages
- Lovable-specific assets
- Lovable-specific configuration

Do not remove legitimate references blindly. Determine whether each reference is actually required.

### 9. Definition of Done

A project is considered Lovable-independent when:

- It can be installed outside Lovable.
- It can run locally from the repository.
- It can build using the repository's standard tooling.
- It does not require Lovable to execute the application.
- It does not contain Lovable branding.
- Its framework configuration uses official/native tooling.
- Its source code can be maintained normally in VS Code.
- Its deployment process does not depend on Lovable.

## Engineering Principle

**Use Lovable as a development accelerator, not as an application dependency.**

The application must remain portable, understandable, and independently maintainable outside Lovable.
