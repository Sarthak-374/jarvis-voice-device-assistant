export type ExecutionMode = 'simulator' | 'real_device';

export type BridgeStatus = 'disconnected' | 'connecting' | 'connected' | 'unauthorized';

export type AndroidActionType =
  | 'TAP'
  | 'LONG_PRESS'
  | 'SWIPE'
  | 'TYPE_TEXT'
  | 'BACK'
  | 'HOME'
  | 'OPEN_APP'
  | 'SCROLL'
  | 'SEARCH';

export interface AndroidActionCommand {
  id: string;
  action: AndroidActionType;
  target: string; // e.g. "x:350,y:820" or "com.whatsapp" or "search_bar_id"
  parameters?: {
    text?: string;
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
    durationMs?: number;
    scrollDirection?: 'up' | 'down' | 'left' | 'right';
    packageName?: string;
  };
  requiresConfirmation?: boolean;
  confirmationPrompt?: string;
  timestamp: number;
}

export interface AndroidActionResult {
  commandId: string;
  success: boolean;
  action: AndroidActionType;
  target: string;
  executionTimeMs: number;
  message: string;
  nodeAffected?: string;
  timestamp: number;
}

export interface AndroidUIElementNode {
  nodeId: string;
  resourceId?: string;
  text?: string;
  contentDescription?: string;
  className: string;
  bounds: { left: number; top: number; right: number; bottom: number };
  clickable: boolean;
  scrollable: boolean;
  editable: boolean;
  visibleToUser: boolean;
}

export interface AndroidNodeTree {
  packageName: string;
  activityName: string;
  timestamp: number;
  rootNode: AndroidUIElementNode;
  allElements: AndroidUIElementNode[];
}

export interface AndroidBridgeState {
  mode: ExecutionMode;
  bridgeStatus: BridgeStatus;
  deviceModel: string | null;
  androidVersion: string | null;
  pairingToken: string;
  ipAddress: string;
  accessibilityGranted: boolean;
  lastPingTime: number | null;
  pendingCommandsCount: number;
  executedCommandsCount: number;
}

// ============================================================================
// 7 CORE ANDROID CONTROL ARCHITECTURE SERVICES INTERFACES
// ============================================================================

/**
 * 1. ACCESSIBILITY SERVICE
 * Interface to manage Android's AccessibilityService lifecycle and OS permissions.
 */
export interface IAccessibilityService {
  serviceStatus: 'active' | 'disabled' | 'permission_denied';
  serviceName: string;
  bindService(): Promise<boolean>;
  unbindService(): Promise<void>;
  isAccessibilityGranted(): Promise<boolean>;
  requestAccessibilityPermission(): Promise<void>;
}

/**
 * 2. VOICE INPUT SERVICE
 * Handles audio recording, streaming to speech engine, and wake-word detection on-device.
 */
export interface IVoiceInputService {
  isRecording: boolean;
  audioFormat: string;
  startVoiceStream(): Promise<void>;
  stopVoiceStream(): Promise<string>;
  onWakeWordDetected(callback: (wakeWord: string) => void): void;
}

/**
 * 3. ACTION EXECUTOR
 * Low-level executor dispatching gestures & hardware key events via AccessibilityNodeInfo/GestureDescription.
 * Supports: TAP, LONG_PRESS, SWIPE, TYPE_TEXT, BACK, HOME, OPEN_APP, SCROLL, SEARCH.
 */
export interface IActionExecutor {
  executeAction(command: AndroidActionCommand): Promise<AndroidActionResult>;
  getActionHistory(): AndroidActionResult[];
}

/**
 * 4. APP LAUNCHER
 * Intent-based launcher for starting and stopping installed apps via PackageManager.
 */
export interface IAppLauncher {
  launchApp(packageNameOrName: string): Promise<boolean>;
  closeApp(packageNameOrName: string): Promise<boolean>;
  getInstalledApps(): Promise<Array<{ packageName: string; appName: string; iconUri?: string }>>;
}

/**
 * 5. SCREEN READER
 * Captures accessibility node hierarchy and provides text-to-speech accessibility labels.
 */
export interface IScreenReader {
  captureScreenHierarchy(): Promise<AndroidNodeTree>;
  getVisibleTextNodes(): Promise<string[]>;
  speakNodeText(nodeId: string): Promise<void>;
}

/**
 * 6. UI ELEMENT DETECTOR
 * Analyzes AccessibilityNodeInfo nodes to resolve user natural language queries to coordinates/nodes.
 */
export interface IUIElementDetector {
  detectElements(screenTree: AndroidNodeTree): Promise<AndroidUIElementNode[]>;
  findElementByTextOrId(query: string): Promise<AndroidUIElementNode | null>;
}

/**
 * 7. CONFIRMATION MANAGER
 * Safety gateway requiring explicit user confirmation before executing destructive/sensitive Android actions.
 */
export interface IConfirmationManager {
  requiresConfirmation(action: AndroidActionCommand): boolean;
  requestUserConfirmation(prompt: string, action: AndroidActionCommand): Promise<boolean>;
}
