import {
  IAccessibilityService,
  IVoiceInputService,
  IActionExecutor,
  IAppLauncher,
  IScreenReader,
  IUIElementDetector,
  IConfirmationManager,
  AndroidActionCommand,
  AndroidActionResult,
  AndroidNodeTree,
  AndroidUIElementNode,
} from './types';

/**
 * 1. Accessibility Service Implementation
 */
export class AccessibilityServiceImpl implements IAccessibilityService {
  serviceStatus: 'active' | 'disabled' | 'permission_denied' = 'disabled';
  serviceName = 'com.jarvis.assistant/.service.JarvisAccessibilityService';

  async bindService(): Promise<boolean> {
    console.log('[Android Architecture] Binding to AccessibilityService:', this.serviceName);
    this.serviceStatus = 'active';
    return true;
  }

  async unbindService(): Promise<void> {
    console.log('[Android Architecture] Unbinding AccessibilityService');
    this.serviceStatus = 'disabled';
  }

  async isAccessibilityGranted(): Promise<boolean> {
    return this.serviceStatus === 'active';
  }

  async requestAccessibilityPermission(): Promise<void> {
    console.log('[Android Architecture] Launching system intent: android.settings.ACCESSIBILITY_SETTINGS');
  }
}

/**
 * 2. Voice Input Service Implementation
 */
export class VoiceInputServiceImpl implements IVoiceInputService {
  isRecording = false;
  audioFormat = 'PCM_16BIT_16KHZ_MONO';
  private wakeWordCallbacks: Array<(wakeWord: string) => void> = [];

  async startVoiceStream(): Promise<void> {
    this.isRecording = true;
    console.log('[Android Architecture] AudioRecord initialized with format:', this.audioFormat);
  }

  async stopVoiceStream(): Promise<string> {
    this.isRecording = false;
    console.log('[Android Architecture] AudioRecord stopped.');
    return 'Voice stream captured';
  }

  onWakeWordDetected(callback: (wakeWord: string) => void): void {
    this.wakeWordCallbacks.push(callback);
  }

  simulateWakeWord(wakeWord = 'Hey Jarvis') {
    this.wakeWordCallbacks.forEach((cb) => cb(wakeWord));
  }
}

/**
 * 3. Action Executor Implementation
 * Supports TAP, LONG_PRESS, SWIPE, TYPE_TEXT, BACK, HOME, OPEN_APP, SCROLL, SEARCH
 */
export class ActionExecutorImpl implements IActionExecutor {
  private history: AndroidActionResult[] = [];

  async executeAction(command: AndroidActionCommand): Promise<AndroidActionResult> {
    const startTime = Date.now();
    console.log(`[Android Action Executor] Dispatching action: ${command.action} on target: ${command.target}`);

    // Simulate action execution latency & verification
    await new Promise((r) => setTimeout(r, 150));

    const result: AndroidActionResult = {
      commandId: command.id,
      success: true,
      action: command.action,
      target: command.target,
      executionTimeMs: Date.now() - startTime,
      message: `Executed ${command.action} via AccessibilityNodeInfo / GestureDescription`,
      timestamp: Date.now(),
    };

    this.history.unshift(result);
    return result;
  }

  getActionHistory(): AndroidActionResult[] {
    return this.history;
  }
}

/**
 * 4. App Launcher Implementation
 */
export class AppLauncherImpl implements IAppLauncher {
  private installedApps = [
    { packageName: 'com.google.android.youtube', appName: 'YouTube' },
    { packageName: 'com.whatsapp', appName: 'WhatsApp' },
    { packageName: 'com.instagram.android', appName: 'Instagram' },
    { packageName: 'com.android.chrome', appName: 'Chrome' },
    { packageName: 'com.android.camera2', appName: 'Camera' },
    { packageName: 'com.jarvis.smarthome', appName: 'Smart Home' },
    { packageName: 'com.android.settings', appName: 'Settings' },
  ];

  async launchApp(packageNameOrName: string): Promise<boolean> {
    console.log(`[Android App Launcher] Intent launch: android.intent.action.MAIN -> ${packageNameOrName}`);
    return true;
  }

  async closeApp(packageNameOrName: string): Promise<boolean> {
    console.log(`[Android App Launcher] Force stopping application package: ${packageNameOrName}`);
    return true;
  }

  async getInstalledApps() {
    return this.installedApps;
  }
}

/**
 * 5. Screen Reader Implementation
 */
export class ScreenReaderImpl implements IScreenReader {
  async captureScreenHierarchy(): Promise<AndroidNodeTree> {
    const rootNode: AndroidUIElementNode = {
      nodeId: 'node_root',
      className: 'android.widget.FrameLayout',
      bounds: { left: 0, top: 0, right: 1080, bottom: 2400 },
      clickable: false,
      scrollable: true,
      editable: false,
      visibleToUser: true,
      text: 'Screen Root Window',
    };

    return {
      packageName: 'com.jarvis.activeapp',
      activityName: 'MainActivity',
      timestamp: Date.now(),
      rootNode,
      allElements: [rootNode],
    };
  }

  async getVisibleTextNodes(): Promise<string[]> {
    return ['YouTube', 'WhatsApp', 'Search Bar', 'Settings', 'Bedroom Light'];
  }

  async speakNodeText(nodeId: string): Promise<void> {
    console.log(`[Android Screen Reader] TTS output for node ID: ${nodeId}`);
  }
}

/**
 * 6. UI Element Detector Implementation
 */
export class UIElementDetectorImpl implements IUIElementDetector {
  async detectElements(screenTree: AndroidNodeTree): Promise<AndroidUIElementNode[]> {
    return screenTree.allElements;
  }

  async findElementByTextOrId(query: string): Promise<AndroidUIElementNode | null> {
    console.log(`[Android Element Detector] Querying AccessibilityNodeInfo tree for text: "${query}"`);
    return {
      nodeId: `node_${Date.now()}`,
      className: 'android.widget.Button',
      text: query,
      bounds: { left: 100, top: 500, right: 400, bottom: 600 },
      clickable: true,
      scrollable: false,
      editable: false,
      visibleToUser: true,
    };
  }
}

/**
 * 7. Confirmation Manager Implementation
 */
export class ConfirmationManagerImpl implements IConfirmationManager {
  private sensitiveActions = ['DELETE', 'FACTORY_RESET', 'CLEAR_DATA', 'TRANSFER_MONEY', 'SEND_SMS'];

  requiresConfirmation(action: AndroidActionCommand): boolean {
    return action.requiresConfirmation || this.sensitiveActions.includes(action.action.toUpperCase());
  }

  async requestUserConfirmation(prompt: string, action: AndroidActionCommand): Promise<boolean> {
    console.log(`[Android Safety Gateway] Confirmation prompt triggered: "${prompt}" for action: ${action.action}`);
    return true;
  }
}

// Export singleton instances for easy application-wide consumption
export const accessibilityService = new AccessibilityServiceImpl();
export const voiceInputService = new VoiceInputServiceImpl();
export const actionExecutor = new ActionExecutorImpl();
export const appLauncher = new AppLauncherImpl();
export const screenReader = new ScreenReaderImpl();
export const uiElementDetector = new UIElementDetectorImpl();
export const confirmationManager = new ConfirmationManagerImpl();
