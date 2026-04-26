# Story 4.1: README Setup Instructions - Brownfield Addition

## User Story

As a developer,
I want to have clear environment setup instructions in the README.md,
So that I can quickly run the project locally in any environment.

## Story Context

**Existing System Integration:**
- Integrates with: README.md, .env.example
- Technology: Next.js, Supabase, OpenAI/LangChain
- Follows pattern: Standard AIOX setup documentation
- Touch points: Root README.md

## Acceptance Criteria

**Functional Requirements:**
1. README.md updated with "Local Setup" section
2. Instructions include dependency installation (npm install)
3. Instructions include environment variable configuration (.env.example to .env)
4. Instructions include running the development server (npm run dev)
5. Instructions include setting up local Supabase environment via Docker (supabase start)

**Integration Requirements:**
6. Setup instructions accurately reflect the current `package.json` scripts
7. Supabase and API key requirements are mentioned as prerequisites
8. Local Supabase credentials (URL, keys) are documented as coming from the CLI output

**Quality Requirements:**
9. Instructions are clear and tested (simulated locally)
10. README formatting is consistent with existing documentation

## Technical Notes

- **Integration Approach:** Update existing README.md to include a step-by-step guide for both App and Database.
- **Supabase Setup:** Use `npx supabase start` to run the local stack via Docker.
- **Key Constraints:** Must use `npm` as the package manager (based on `package-lock.json`).

## Definition of Done

- [x] Functional requirements met
- [x] Integration requirements verified
- [x] README updated and formatted correctly
- [x] Instructions verified by successful `npm run dev` simulation (if possible)

## Risk and Compatibility Check

- **Primary Risk:** Outdated or incorrect setup commands.
- **Mitigation:** Verify scripts in `package.json` before writing.
- **Rollback:** Git revert README.md if formatting breaks.

**Compatibility Verification:**
- [x] No code changes required, only documentation.
- [x] Additive changes to README.

## Dev Agent Record

### Agent Model Used
- Gemini 2.0 Flash

### Debug Log References
- N/A (Documentation update only)

### Completion Notes List
- Updated README.md with comprehensive local setup instructions.
- Included Docker-based Supabase setup via `npx supabase start`.
- Added `npx supabase status` for retrieving automatically generated credentials.
- Verified commands against `package.json`.

### File List
- README.md (Modified)
- docs/stories/story-4.1-readme-setup-instructions.md (Modified)

### Change Log
- 2026-04-26: Initial implementation of README setup instructions.
- 2026-04-26: Added Supabase Docker setup instructions.
- 2026-04-26: Clarified automatic credential generation and added status command.
- 2026-04-26: Story closed. Local setup documentation complete.

### Status
Done
