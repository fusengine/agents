---
name: workouts
description: watchOS workout sessions with HealthKit, heart rate, calories, and fitness tracking
when-to-use: implementing fitness features, tracking workouts, accessing health data
keywords: HKWorkoutSession, HealthKit, workout, heart rate, calories, fitness
priority: high
related: complications.md, watch-connectivity.md
---

# watchOS Workouts

## When to Use

- Fitness app development
- Workout tracking
- Health data collection
- Real-time metrics display
- Activity rings contribution

## Key Concepts

### HKWorkoutSession
Manages active workout state.

**Key Points:**
- Request authorization first
- Configure workout type
- Start/pause/resume/end
- Runs in background

### HKLiveWorkoutBuilder
Collects data during workout.

**Key Points:**
- Attached to session
- Auto-collects metrics
- Saves to HealthKit
- Provides data stream

### Workout Types

| Type | Activity |
|------|----------|
| running | Outdoor/indoor run |
| cycling | Bike riding |
| swimming | Pool/open water |
| hiking | Outdoor hiking |
| yoga | Yoga session |
| other | Custom activity |

### Health Metrics

**Available Data:**
- Heart rate (BPM)
- Active calories
- Distance
- Pace/speed
- Steps
- Elevation

---

## Authorization

**Required:**
- Add HealthKit capability
- Request permissions per data type
- Handle denial gracefully
- Explain usage in Info.plist

---

## Workout Lifecycle

1. **Configure** - Set workout type, location
2. **Request Auth** - Get HealthKit permissions
3. **Create Session** - HKWorkoutSession
4. **Start** - Begin collection
5. **Collect** - Stream metrics
6. **End** - Stop and save
7. **Save** - Persist to HealthKit

---

## Best Practices

- ✅ Request only needed permissions
- ✅ Handle authorization denial
- ✅ Display real-time metrics
- ✅ Support workout pause/resume
- ✅ Save workout to HealthKit
- ❌ Don't access data without auth
- ❌ Don't drain battery unnecessarily
- ❌ Don't skip proper session end
