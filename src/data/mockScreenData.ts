import { AppName, ContactItem, FileItem, UIElement, SmartHomeState, DeviceSettings, AlarmItem, ReminderItem, MemoryItem } from '../types';

export const INITIAL_SMART_HOME: SmartHomeState = {
  bedroomLight: false,
  livingRoomLight: true,
  acPower: true,
  acTemp: 24,
  frontDoorLocked: true,
  fanSpeed: 2,
};

export const INITIAL_DEVICE_SETTINGS: DeviceSettings = {
  wifiEnabled: true,
  bluetoothEnabled: true,
  brightness: 80,
  volume: 75,
  dndEnabled: false,
  airplaneMode: false,
};

export const INITIAL_CONTACTS: ContactItem[] = [
  { id: '1', name: 'Mummy', relationship: 'Mother', phoneNumber: '+91 98765 43210' },
  { id: '2', name: 'Papa', relationship: 'Father', phoneNumber: '+91 98765 12345' },
  { id: '3', name: 'Rohan Sharma', relationship: 'Friend', phoneNumber: '+91 91234 56789' },
  { id: '4', name: 'Priya Verma', relationship: 'Colleague', phoneNumber: '+91 99887 76655' },
  { id: '5', name: 'Boss', relationship: 'Work', phoneNumber: '+91 90000 11111' },
];

export const INITIAL_ALARMS: AlarmItem[] = [
  { id: 'a1', time: '07:00 AM', label: 'Morning Wakeup', enabled: true, recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { id: 'a2', time: '08:00 AM', label: 'Workout Time', enabled: false },
  { id: 'a3', time: '10:00 PM', label: 'Night Sleep Reminder', enabled: true },
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  { id: 'r1', title: 'Complete AI Studio project submission', datetime: 'Tomorrow at 6:00 PM', completed: false },
  { id: 'r2', title: 'Buy groceries & fruits', datetime: 'Today at 8:00 PM', completed: false },
];

export const INITIAL_FILES: FileItem[] = [
  { id: 'f1', name: 'Project_Specification.pdf', size: '2.4 MB', type: 'pdf', updatedAt: 'Today' },
  { id: 'f2', name: 'Family_Photo_2026.jpg', size: '4.8 MB', type: 'image', updatedAt: 'Yesterday' },
  { id: 'f3', name: 'Meeting_Notes_Aug.docx', size: '1.1 MB', type: 'doc', updatedAt: 'Aug 8' },
  { id: 'f4', name: 'Voice_Note_001.m4a', size: '3.2 MB', type: 'audio', updatedAt: 'Aug 5' },
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  { id: 'm1', key: 'Preferred Language', value: 'Hinglish / Hindi', category: 'preference', createdAt: '2026-08-01' },
  { id: 'm2', key: 'Favorite YouTube Channel', value: 'Coding & Study Lofi Beats', category: 'preference', createdAt: '2026-08-03' },
  { id: 'm3', key: 'Ongoing Project', value: 'JARVIS Voice & Device Automation Assistant', category: 'project', createdAt: '2026-08-05' },
  { id: 'm4', key: 'Wakeup Preference', value: '7:00 AM Alarm with gentle music', category: 'preference', createdAt: '2026-08-08' },
];

// Mapping of UI elements for Google Voice Access overlay tag positioning
export const APP_SCREEN_ELEMENTS: Record<AppName, UIElement[]> = {
  Home: [
    { id: 1, label: 'YouTube', type: 'icon', actionTarget: 'YouTube', xPct: 18, yPct: 22 },
    { id: 2, label: 'WhatsApp', type: 'icon', actionTarget: 'WhatsApp', xPct: 42, yPct: 22 },
    { id: 3, label: 'Instagram', type: 'icon', actionTarget: 'Instagram', xPct: 66, yPct: 22 },
    { id: 4, label: 'Chrome', type: 'icon', actionTarget: 'Chrome', xPct: 88, yPct: 22 },
    { id: 5, label: 'Camera', type: 'icon', actionTarget: 'Camera', xPct: 18, yPct: 42 },
    { id: 6, label: 'Smart Home', type: 'icon', actionTarget: 'Smart Home', xPct: 42, yPct: 42 },
    { id: 7, label: 'Settings', type: 'icon', actionTarget: 'Settings', xPct: 66, yPct: 42 },
    { id: 8, label: 'Reminders', type: 'icon', actionTarget: 'Reminders', xPct: 88, yPct: 42 },
    { id: 9, label: 'Contacts', type: 'icon', actionTarget: 'Contacts', xPct: 18, yPct: 62 },
    { id: 10, label: 'Files', type: 'icon', actionTarget: 'Files', xPct: 42, yPct: 62 },
  ],
  YouTube: [
    { id: 11, label: 'Search Field', type: 'input', actionTarget: 'YouTube Search Bar', xPct: 45, yPct: 12 },
    { id: 12, label: 'Search Button', type: 'button', actionTarget: 'Search Submit', xPct: 88, yPct: 12 },
    { id: 13, label: 'Video 1: Study Lofi Music 24/7', type: 'card', actionTarget: 'Play Study Music Video', xPct: 50, yPct: 35 },
    { id: 14, label: 'Video 2: Artificial Intelligence Tutorial', type: 'card', actionTarget: 'Play AI Video', xPct: 50, yPct: 62 },
    { id: 15, label: 'Play / Pause Video', type: 'button', actionTarget: 'Video Playback Toggle', xPct: 50, yPct: 88 },
  ],
  WhatsApp: [
    { id: 16, label: 'Chat: Mummy', type: 'card', actionTarget: 'Open Mummy Chat', xPct: 50, yPct: 22 },
    { id: 17, label: 'Chat: Papa', type: 'card', actionTarget: 'Open Papa Chat', xPct: 50, yPct: 38 },
    { id: 18, label: 'Chat: Boss', type: 'card', actionTarget: 'Open Boss Chat', xPct: 50, yPct: 54 },
    { id: 19, label: 'Message Input', type: 'input', actionTarget: 'Chat Message Input Box', xPct: 42, yPct: 88 },
    { id: 20, label: 'Send Button', type: 'button', actionTarget: 'Send Message', xPct: 88, yPct: 88 },
  ],
  Instagram: [
    { id: 21, label: 'Profile Tab', type: 'button', actionTarget: 'Profile Screen', xPct: 85, yPct: 10 },
    { id: 22, label: 'Follow / Unfollow', type: 'button', actionTarget: 'Follow User', xPct: 50, yPct: 32 },
    { id: 23, label: 'Recent Post 1', type: 'image', actionTarget: 'View Photo 1', xPct: 30, yPct: 58 },
    { id: 24, label: 'Recent Post 2', type: 'image', actionTarget: 'View Photo 2', xPct: 70, yPct: 58 },
  ],
  Chrome: [
    { id: 25, label: 'URL / Search Box', type: 'input', actionTarget: 'Chrome Address Bar', xPct: 50, yPct: 10 },
    { id: 26, label: 'Google Search Button', type: 'button', actionTarget: 'Google Search Submit', xPct: 86, yPct: 10 },
    { id: 27, label: 'Open YouTube Website', type: 'link', actionTarget: 'Navigate YouTube URL', xPct: 35, yPct: 40 },
    { id: 28, label: 'Open ChatGPT Website', type: 'link', actionTarget: 'Navigate ChatGPT URL', xPct: 70, yPct: 40 },
  ],
  Camera: [
    { id: 29, label: 'Flash Toggle', type: 'switch', actionTarget: 'Toggle Flash', xPct: 20, yPct: 10 },
    { id: 30, label: 'Shutter Button', type: 'button', actionTarget: 'Capture Photo', xPct: 50, yPct: 85 },
    { id: 31, label: 'Switch Camera', type: 'button', actionTarget: 'Flip Camera Front/Back', xPct: 80, yPct: 85 },
  ],
  'Smart Home': [
    { id: 32, label: 'Bedroom Light Switch', type: 'switch', actionTarget: 'Toggle Bedroom Light', xPct: 30, yPct: 28 },
    { id: 33, label: 'Living Room Light Switch', type: 'switch', actionTarget: 'Toggle Living Room Light', xPct: 70, yPct: 28 },
    { id: 34, label: 'AC Power Switch', type: 'switch', actionTarget: 'Toggle AC Power', xPct: 30, yPct: 50 },
    { id: 35, label: 'AC Temp Increase', type: 'button', actionTarget: 'AC Temp Up', xPct: 80, yPct: 50 },
    { id: 36, label: 'AC Temp Decrease', type: 'button', actionTarget: 'AC Temp Down', xPct: 65, yPct: 50 },
  ],
  Settings: [
    { id: 37, label: 'Wi-Fi Switch', type: 'switch', actionTarget: 'Toggle Wi-Fi', xPct: 80, yPct: 22 },
    { id: 38, label: 'Bluetooth Switch', type: 'switch', actionTarget: 'Toggle Bluetooth', xPct: 80, yPct: 36 },
    { id: 39, label: 'Brightness Slider', type: 'input', actionTarget: 'Set Brightness Level', xPct: 50, yPct: 52 },
    { id: 40, label: 'Volume Slider', type: 'input', actionTarget: 'Set Volume Level', xPct: 50, yPct: 68 },
  ],
  Reminders: [
    { id: 41, label: 'Add Alarm', type: 'button', actionTarget: 'Create Alarm 7 AM', xPct: 85, yPct: 12 },
    { id: 42, label: 'Alarm 7:00 AM Switch', type: 'switch', actionTarget: 'Toggle Alarm 7 AM', xPct: 82, yPct: 30 },
    { id: 43, label: 'Add New Reminder', type: 'button', actionTarget: 'Create Reminder', xPct: 50, yPct: 88 },
  ],
  Contacts: [
    { id: 44, label: 'Call Mummy', type: 'button', actionTarget: 'Initiate Call Mummy', xPct: 85, yPct: 22 },
    { id: 45, label: 'Call Papa', type: 'button', actionTarget: 'Initiate Call Papa', xPct: 85, yPct: 38 },
    { id: 46, label: 'Call Boss', type: 'button', actionTarget: 'Initiate Call Boss', xPct: 85, yPct: 54 },
  ],
  Files: [
    { id: 47, label: 'Project_Specification.pdf', type: 'card', actionTarget: 'Open PDF File', xPct: 50, yPct: 25 },
    { id: 48, label: 'Delete File (Destructive)', type: 'button', actionTarget: 'Delete File Target', xPct: 85, yPct: 25 },
  ],
};

export const SAMPLE_VOICE_COMMANDS = [
  { text: 'YouTube खोल दो और उसमें study music चलाओ.', icon: 'Youtube', category: 'Multi-Step / App' },
  { text: 'Bed room की light बंद कर दो.', icon: 'Home', category: 'Smart Home' },
  { text: 'मेरी मम्मी को call लगाओ.', icon: 'Phone', category: 'Phone Call' },
  { text: 'कल सुबह 7 बजे मुझे उठाना.', icon: 'AlarmClock', category: 'Alarm' },
  { text: 'Camera खोलो और photo खींचो.', icon: 'Camera', category: 'Camera' },
  { text: 'Search box में ChatGPT लिखो.', icon: 'Search', category: 'Screen Control' },
  { text: 'Wi-Fi बंद कर दो.', icon: 'Wifi', category: 'Device Settings' },
  { text: 'इसे याद रखना कि मेरा पसंदीदा रंग नीला है.', icon: 'Brain', category: 'Memory' },
  { text: 'आज का मौसम बताओ.', icon: 'Sun', category: 'Web Search' },
  { text: 'Project_Specification.pdf delete कर दो.', icon: 'Trash2', category: 'Destructive Confirmation' },
];
