---
name: fix-patterns-advanced
description: Code fix examples for React useEffect anti-patterns 6-9 (effect chains, missing cleanup, manual subscription, app init)
when-to-use: Phase 4 proposing corrections for anti-patterns 6-9
keywords: fix, solution, cleanup, AbortController, useSyncExternalStore, effect-chains, module-init
priority: high
related: anti-patterns.md, detection-rules.md, fix-patterns-core.md
---

# Fix Patterns (Advanced: #6-9)

## Fix 6: Effect Chains -> Single Handler

```tsx
// BAD
useEffect(() => {
  if (card?.gold) setGoldCount(c => c + 1);
}, [card]);
useEffect(() => {
  if (goldCount > 3) { setRound(r => r + 1); setGoldCount(0); }
}, [goldCount]);
useEffect(() => {
  if (round > 5) setGameOver(true);
}, [round]);

// GOOD
const isGameOver = round > 5;
function handlePlaceCard(nextCard: Card) {
  setCard(nextCard);
  if (nextCard.gold) {
    if (goldCount < 3) {
      setGoldCount(goldCount + 1);
    } else {
      setGoldCount(0);
      setRound(round + 1);
    }
  }
}
```

---

## Fix 7: Missing Cleanup -> AbortController

```tsx
// BAD
useEffect(() => {
  fetchResults(query).then(json => setResults(json));
}, [query]);

// GOOD (ignore flag)
useEffect(() => {
  let ignore = false;
  fetchResults(query).then(json => {
    if (!ignore) setResults(json);
  });
  return () => { ignore = true; };
}, [query]);

// BEST: Use TanStack Query (no manual Effect needed)
const { data } = useQuery({
  queryKey: ['results', query],
  queryFn: () => fetchResults(query),
});
```

---

## Fix 8: Manual Subscription -> useSyncExternalStore

```tsx
// BAD
const [isOnline, setIsOnline] = useState(true);
useEffect(() => {
  const update = () => setIsOnline(navigator.onLine);
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  return () => {
    window.removeEventListener('online', update);
    window.removeEventListener('offline', update);
  };
}, []);

// GOOD
function subscribe(cb: () => void) {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => {
    window.removeEventListener('online', cb);
    window.removeEventListener('offline', cb);
  };
}
const isOnline = useSyncExternalStore(
  subscribe,
  () => navigator.onLine,
  () => true
);
```

---

## Fix 9: App Init -> Module-Level

```tsx
// BAD
function App() {
  useEffect(() => {
    checkAuthToken();
    loadConfig();
  }, []);
}

// GOOD (option A: module-level)
if (typeof window !== 'undefined') {
  checkAuthToken();
  loadConfig();
}
function App() { /* ... */ }

// GOOD (option B: guard flag)
let didInit = false;
function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      checkAuthToken();
      loadConfig();
    }
  }, []);
}
```
