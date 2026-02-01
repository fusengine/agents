---
name: device-tools
description: XcodeBuildMCP tools for physical iOS devices - build, install, launch, test
when-to-use: deploying to iPhone/iPad, testing on real hardware, validating before release
keywords: device, build_device, install_app_device, launch_app_device, list_devices
priority: high
requires: simulator-tools.md
related: ui-automation.md
---

# iOS Device Tools

## When to Use

- Testing on real hardware
- Validating performance
- Testing device-specific features
- Pre-release validation
- Testing push notifications

## Available MCP Tools

### list_devices
Show all connected iOS devices.

**Returns:**
- Device name, model, iOS version
- UDID for targeting
- Connection status (USB/Wi-Fi)

**Use when:**
- Finding connected devices
- Getting device UDID

### build_device
Build app for physical device.

**Parameters:**
- `projectPath` - Project path
- `scheme` - Build scheme
- `destination` - Device identifier

**Use when:**
- Preparing device build
- Release validation

### install_app_device
Deploy app to connected device.

**Parameters:**
- `appPath` - Built app path
- `deviceId` - Target device UDID

**Use when:**
- Installing for testing
- Deploying beta builds

### launch_app_device
Start app on device.

**Parameters:**
- `bundleId` - App bundle identifier
- `deviceId` - Target device

**Use when:**
- Testing on device
- Manual validation

### test_device
Run tests on physical device.

**Parameters:**
- `projectPath` - Project path
- `scheme` - Test scheme
- `deviceId` - Target device

**Use when:**
- Performance testing
- Hardware-specific tests

### start_device_log_cap / stop_device_log_cap
Capture device logs.

**Use when:**
- Debugging device-specific issues
- Crash investigation

---

## Workflow: Device Testing

1. `list_devices` - Find connected device
2. `build_device` - Build for device
3. `install_app_device` - Deploy
4. `start_device_log_cap` - Start logging
5. `launch_app_device` - Run app
6. `stop_device_log_cap` - Get logs

---

## Device vs Simulator

| Aspect | Simulator | Device |
|--------|-----------|--------|
| Speed | Faster builds | Slower builds |
| Performance | Not accurate | Real metrics |
| Push notifications | Limited | Full support |
| Sensors | Simulated | Real data |
| Battery testing | No | Yes |

---

## Best Practices

- ✅ Test on oldest supported iOS version
- ✅ Test on device before App Store submission
- ✅ Use Wi-Fi debugging for convenience
- ✅ Capture logs for debugging
- ❌ Don't skip device testing
- ❌ Don't assume simulator matches device
