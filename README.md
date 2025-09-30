# Reuters AutoComplete - Word Search Application

---
A production-ready autocomplete search component built with React, TypeScript, and Material-UI.

## Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Preview

<img width="675" height="729" alt="Screenshot from 2025-09-30 18-34-48" src="https://github.com/user-attachments/assets/198d0555-499e-4a75-b588-9256b12525da" />


## Post-Interview Improvements

After the initial interview implementation, I identified several areas for optimization and enhancement. Here's what I improved in one more hour:

### 1. Caching Implementation

**Issue:** Initially tried using `cacheTime` in React Query but data wasn't being cached properly.

**Solution:** Discovered that React Query v5 changed the API. The correct property is `gcTime` (garbage collection time), not `cacheTime`.

```typescript
export const useGetWord = ({ query, limit }) => {
  return useQuery({
    queryKey: ['words', query, limit],
    queryFn: () => fetchWords({ query, limit }),
    enabled: Boolean(query),
    staleTime: 1000 * 60 * 5,    // 5 minutes
    gcTime: 1000 * 60 * 10,      // 10 minutes (formerly cacheTime)
    retry: 2,
  })
}
```

This ensures repeated searches return instantly from cache rather than making new API calls.

---

### 2. Component Memoization

**Problem:** List items were re-rendering on every keystroke, causing noticeable performance issues.

**Solution:** Wrapped `WordListItem` in `React.memo()` to prevent re-renders unless props actually change.

```typescript
export const WordListItem = memo(({ word, index, isSelected, onClick }) => {
  // Component only re-renders if word, index, isSelected, or onClick changes
});
```

---

### 3. Event Handler Optimization with useCallback

**Problem:** Event handlers were being recreated on every render, causing child components to re-render unnecessarily.

**Solution:** Wrapped all event handlers in `useCallback` to maintain referential equality across renders.

```typescript
const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearch(value);
  debouncedSetSearch(value);
}, [debouncedSetSearch]);
```

---

### 4. Extracting WordListItem Component

**Decision:** Moved list item into a separate file (`WordListItem.tsx`).

**Reasoning:** Separating it into its own file makes it easier to test independently, improves code organization, and follows the single responsibility principle. It also makes the memoization strategy more explicit and maintainable.

---

### 5. Preventing Layout Reflow

**Problem:** There was significant repaint happening when results appeared, causing the layout to shift.

**Solution:** Used fixed positioning and explicit dimensions for the results container to prevent reflow when the list size changes.

```typescript
<Box sx={{ marginTop: 2, position: 'relative' }}>
  {/* Results container with fixed dimensions */}
  <Box sx={{
    maxHeight: 300,
    overflowY: 'auto',
    // Fixed dimensions prevent layout shifts
  }}>
```

This ensures the rest of the page doesn't jump around when search results load.

---

### 6. Testing Strategy

Focused on testing user behavior rather than implementation details. Created tests for:

- Component rendering and input interaction
- Debouncing verification (ensuring only 1 API call after rapid typing)
- Successful search results display
- Empty state handling
- Loading state during API calls
- Error state handling

Used `waitFor` to handle async operations and mocked axios for predictable test scenarios.

```typescript
it('Should test debounce input API calls', async () => {
  const mockWords = ['test'];
  mockedAxios.get.mockResolvedValue({ data: mockWords });
  
  await userEvent.type(input, 'test');
  
  await waitFor(() => {
    expect(mockedAxios.get).toHaveBeenCalledTimes(1); // Only 1 call despite 4 keystrokes
  }, { timeout: 1000 });
});
```

---

### 7. UX Enhancements

Added several features to improve user experience:

**Configurable Result Limits**
- Radio buttons for 5, 10, 50, and 100 results
- Stored as number type to avoid repeated parsing

**Visual Feedback**
- Loading spinner during API calls
- Error alerts for failed requests
- Info message when no results found
- Selected item highlighting

**Input Constraints**
- 30 character limit to prevent abuse
- Automatic selection reset when searching

---

### 8. Accessibility

Added proper ARIA attributes to make the component screen-reader friendly:

```typescript
<TextField
  inputProps={{
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-controls': 'word-search-results',
    'aria-expanded': showResults
  }}
/>

<Box id="word-search-results">
  <List role="listbox">
    {data.map((word, idx) => (
      <ListItemButton
        role="option"
        aria-selected={highlightedIndex === idx}
      >
```

Also included a visually hidden status region for screen reader announcements about search results.


## Project Structure
```
src/
├── components/
│   ├── WordSearch.tsx      # Main search component
│   ├── WordListItem.tsx    # Memoized list item component
│   └── WordSearch.test.tsx # Unit tests
├── hooks/
│   └── useGetWords.ts      # Custom React Query hook
├── utils/
│   ├── debounce.ts         # Debounce utility
│   ├── constant.ts         # App constants
│   └── setupTests.ts       # Test configuration
├── App.tsx                 # Root component with theme
└── main.tsx                # App entry point
```

---
---



## Key Technical Decisions

**Debouncing:** 500ms delay balances responsiveness with API load reduction

**React Query:** Provides automatic caching, request deduplication, and background refetching out of the box

**TypeScript:** Catches type errors at compile time and improves code maintainability

**Memoization:** Applied strategically only where re-renders were causing performance issues

**Testing Philosophy:** Focus on user behavior and integration over isolated unit tests
