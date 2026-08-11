export type IntentCategory =
  | 'CONVERSATION'
  | 'INFORMATION'
  | 'WEB_SEARCH'
  | 'OPEN_APP'
  | 'UI_ACTION'
  | 'DEVICE_CONTROL'
  | 'PHONE_CALL'
  | 'MESSAGE'
  | 'REMINDER'
  | 'ALARM'
  | 'CALENDAR'
  | 'SMART_HOME'
  | 'FILE_OPERATION'
  | 'MEDIA_CONTROL'
  | 'MULTI_STEP_TASK'
  | 'CLARIFICATION'
  | 'UNSUPPORTED_ACTION';

export type UIActionType =
  | 'TAP'
  | 'LONG_PRESS'
  | 'SWIPE_UP'
  | 'SWIPE_DOWN'
  | 'SWIPE_LEFT'
  | 'SWIPE_RIGHT'
  | 'TYPE_TEXT'
  | 'CLEAR_TEXT'
  | 'SELECT'
  | 'BACK'
  | 'HOME'
  | 'OPEN_APP'
  | 'CLOSE_APP'
  | 'SCROLL'
  | 'SEARCH'
  | 'PRESS_ENTER';

export type AppName =
  | 'Home'
  | 'YouTube'
  | 'WhatsApp'
  | 'Instagram'
  | 'Chrome'
  | 'Camera'
  | 'Smart Home'
  | 'Settings'
  | 'Reminders'
  | 'Contacts'
  | 'Files';

export interface UIElement {
  id: number;
  label: string;
  type: 'button' | 'input' | 'card' | 'switch' | 'link' | 'image' | 'icon';
  actionTarget: string;
  xPct: number; // position percentage for overlay tag
  yPct: number;
}

export interface ActionPayload {
  intent: IntentCategory;
  action: UIActionType | string;
  target: string;
  parameters: Record<string, any>;
  confidence: number; // 0 to 1
  requires_confirmation: boolean;
  confirmation_prompt?: string;
}

export interface MultiStepItem {
  id: string;
  stepNumber: number;
  description: string;
  actionPayload: ActionPayload;
  status: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  intent?: IntentCategory;
  actionPayload?: ActionPayload;
  groundingSources?: Array<{ title: string; url: string }>;
}

export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  category: 'preference' | 'goal' | 'app' | 'project' | 'general';
  createdAt: string;
}

export interface SmartHomeState {
  bedroomLight: boolean;
  livingRoomLight: boolean;
  acPower: boolean;
  acTemp: number;
  frontDoorLocked: boolean;
  fanSpeed: number;
}

export interface DeviceSettings {
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  brightness: number; // 0-100
  volume: number; // 0-100
  dndEnabled: boolean;
  airplaneMode: boolean;
}

export interface AlarmItem {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  recurringDays?: string[];
}

export interface ReminderItem {
  id: string;
  title: string;
  datetime: string;
  completed: boolean;
}

export interface ContactItem {
  id: string;
  name: string;
  relationship?: string;
  phoneNumber: string;
  avatarUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'doc' | 'audio';
  updatedAt: string;
}

export interface AssistantApiResponse {
  spokenResponse: string;
  intent: IntentCategory;
  actionPayload: ActionPayload;
  multiStepPlan?: MultiStepItem[];
  memoryItemToSave?: { key: string; value: string; category: MemoryItem['category'] };
  requiresConfirmation?: boolean;
  confirmationPrompt?: string;
  groundingSources?: Array<{ title: string; url: string }>;
}
