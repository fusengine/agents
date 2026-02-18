---
name: fix-patterns-core
description: Code fix examples for React useEffect anti-patterns 1-5 (derived state, expensive calc, state reset, event logic, parent notification)
when-to-use: Phase 4 proposing corrections for anti-patterns 1-5
keywords: fix, solution, useMemo, key, event-handler, derived-state, controlled-component
priority: high
related: anti-patterns.md, detection-rules.md, fix-patterns-advanced.md
---

# Fix Patterns (Core: #1-5)

## Fix 1: Derived State -> Computed Variable

```tsx
// BAD
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);

// GOOD
const fullName = firstName + ' ' + lastName;
```

---

## Fix 2: Expensive Calculation -> useMemo

```tsx
// BAD
const [visible, setVisible] = useState([]);
useEffect(() => {
  setVisible(getFilteredTodos(todos, filter));
}, [todos, filter]);

// GOOD
const visible = useMemo(
  () => getFilteredTodos(todos, filter),
  [todos, filter]
);
```

**Note**: React Compiler (v1.0+) auto-memoizes. If using Compiler, plain variable may suffice.

---

## Fix 3: State Reset -> Key Prop

```tsx
// BAD
function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');
  useEffect(() => { setComment(''); }, [userId]);
}

// GOOD
function ProfilePage({ userId }) {
  return <Profile userId={userId} key={userId} />;
}
function Profile({ userId }) {
  const [comment, setComment] = useState('');
}
```

---

## Fix 4: Event Logic -> Event Handler

```tsx
// BAD
useEffect(() => {
  if (product.isInCart) {
    showNotification(`Added ${product.name}!`);
  }
}, [product]);

// GOOD
function handleBuyClick() {
  addToCart(product);
  showNotification(`Added ${product.name}!`);
}
```

**Key question**: "Why does this code run?" If answer is "user clicked something" -> event handler.

---

## Fix 5: Parent Notification -> Same Handler

```tsx
// BAD
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);
  useEffect(() => { onChange(isOn); }, [isOn, onChange]);
  function handleClick() { setIsOn(!isOn); }
}

// GOOD (option A: uncontrolled)
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);
  function updateToggle(next: boolean) {
    setIsOn(next);
    onChange(next);
  }
  function handleClick() { updateToggle(!isOn); }
}

// GOOD (option B: controlled - preferred)
function Toggle({ isOn, onChange }: Props) {
  function handleClick() { onChange(!isOn); }
}
```

**Prefer controlled components** when parent already manages the state.
