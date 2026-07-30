# Ponytail Skill

## Purpose
Manage and track complex multi-step tasks with clear progress visibility.

## When to Invoke
- Task involves 3+ files or steps
- User asks to "build", "create", "implement", or "develop" something
- Task requires coordinated changes across modules

## Process

1. **Break down the task** into discrete, verifiable steps
2. **Create todos** using the todo_write tool
3. **Work sequentially** — one todo at a time
4. **Mark progress** — update status as you work
5. **Adapt** — add/remove todos as you learn new information
6. **Verify** — run checks after completing each step
7. **Report** — summarize what was accomplished when done

## Todo Structure

Each todo should be:
- **Specific**: "Create Group model with member array" not "Work on groups"
- **Verifiable**: Can be confirmed as done or not
- **Atomic**: One logical unit of work

## Rules
- Never have more than one todo as `in_progress`
- Never skip verification after completing a step
- Always update todos when discovering new requirements
- Save all findings for the final response (don't give partial answers during work)
