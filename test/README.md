# Testing Guide

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) for testing, following Next.js best practices.

## Test Structure

- **Unit Tests**: Test individual utilities and functions (`lib/__tests__/`)
- **Component Tests**: Test React components (`components/__tests__/`, `components/ui/__tests__/`)
- **Integration Tests**: Test component interactions (can be added as needed)

## Running Tests

```bash
# Run tests in watch mode (development)
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Writing Tests

### Example: Testing a Utility Function

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../my-function';

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction('input')).toBe('expected-output');
  });
});
```

### Example: Testing a Component

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    await user.click(screen.getByRole('button'));
    // Assert expected behavior
  });
});
```

## Best Practices

1. **Test user behavior, not implementation details**
2. **Use semantic queries** (`getByRole`, `getByLabelText`, etc.)
3. **Keep tests focused** - one concept per test
4. **Mock external dependencies** (APIs, animations, etc.)
5. **Clean up after tests** (handled automatically via setup.ts)

## Mocking

Common mocks are set up in `test/setup.ts`:
- Next.js router (`next/navigation`)
- `window.matchMedia`
- `IntersectionObserver`

## Coverage

Aim for meaningful coverage, not 100%. Focus on:
- Critical user flows
- Complex logic
- Edge cases
- Utility functions

