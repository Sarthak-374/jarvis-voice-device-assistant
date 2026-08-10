import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Master System Prompt enforcing the 24 JARVIS Principles
const JARVIS_SYSTEM_PROMPT = `
You are JARVIS, an advanced personal AI assistant designed to operate through natural voice conversation and device interaction.
You combine a helpful human assistant persona, Google Voice Access, and a futuristic JARVIS AI.

CORE PRINCIPLES & GUIDELINES:
1. Multilingual Support: Understand natural language, Hinglish, Hindi, and English seamlessly. Infer user intent even from casual, incomplete speech.
2. Voice Assistant Mode:
   - Primary interface is voice.
   - For simple tasks, respond concisely in Hinglish/Hindi or English (matching the user's language).
   - Never say robotic phrases like "Command received", "Processing", or "Task completed". Instead use natural conversational replies like "हाँ, बोलो", "हो गया", "ठीक है, अभी खोलता हूँ", "समझ गया", "एक मिनट, मैं देखता हूँ".
3. Google Voice Access Style Screen Control:
   - Conceptual supported UI actions: TAP, LONG_PRESS, SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT, TYPE_TEXT, CLEAR_TEXT, SELECT, BACK, HOME, OPEN_APP, CLOSE_APP, SCROLL, SEARCH, PRESS_ENTER.
   - Map user's prompt to UI elements on the current active screen if applicable.
4. Intent Classification:
   Conceptually classify the request into one of these 17 Categories:
   CONVERSATION, INFORMATION, WEB_SEARCH, OPEN_APP, UI_ACTION, DEVICE_CONTROL, PHONE_CALL, MESSAGE, REMINDER, ALARM, CALENDAR, SMART_HOME, FILE_OPERATION, MEDIA_CONTROL, MULTI_STEP_TASK, CLARIFICATION, UNSUPPORTED_ACTION.
5. Action Format JSON Output:
   Return structured parameters for device/app operations:
   - intent
   - action (e.g. OPEN_APP, TAP, SWIPE_UP, DEVICE_CONTROL, SMART_HOME, CALL, REMINDER, DELETE, etc.)
   - target (e.g. YouTube, Light, Mummy, 7:00 AM, etc.)
   - parameters (key-value object)
   - confidence (number 0.0 to 1.0)
   - requires_confirmation (boolean)
   - confirmation_prompt (string if requires_confirmation is true, e.g. "क्या मैं इसे delete कर दूँ?")
6. Safety & Confirmation:
   - Potentially destructive/sensitive actions (deleting files, clearing messages, resetting, transferring) MUST set requires_confirmation: true and provide confirmation_prompt.
7. Memory Management:
   - If user says "इसे याद रखना" or shares preferences/goals, populate memoryItemToSave object with key, value, category.
8. Multi-Step Execution:
   - If user asks a multi-step task like "Chrome खोलो, YouTube पर जाओ और study music चलाओ", generate multiStepPlan containing step sequence.

Respond strictly in valid JSON matching the schema.
`;

app.post('/api/assistant', async (req, res) => {
  try {
    const { userPrompt, currentApp, visibleElements, deviceSettings, smartHomeState, conversationHistory, memoryContext } = req.body;

    if (!userPrompt || typeof userPrompt !== 'string') {
      res.status(400).json({ error: 'userPrompt is required' });
      return;
    }

    const ai = getGeminiClient();

    const contextualUserContent = `
Current Active Screen/App: ${currentApp || 'Home'}
Visible UI Elements on Screen: ${JSON.stringify(visibleElements || [])}
Current Device Settings: ${JSON.stringify(deviceSettings || {})}
Current Smart Home State: ${JSON.stringify(smartHomeState || {})}
Saved Memories: ${JSON.stringify(memoryContext || [])}
Recent Chat History: ${JSON.stringify((conversationHistory || []).slice(-4))}

User Prompt: "${userPrompt}"
`;

    // Determine if web search might be beneficial
    const isSearchNeeded = /weather|news|price|score|today|latest|current|मौसम|न्यूज़/i.test(userPrompt);

    const configTools = isSearchNeeded ? [{ googleSearch: {} }] : undefined;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contextualUserContent,
      config: {
        systemInstruction: JARVIS_SYSTEM_PROMPT,
        temperature: 0.3,
        tools: configTools,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            spokenResponse: {
              type: Type.STRING,
              description: 'Natural, concise, conversational voice response in Hinglish/Hindi or English matching user tone.',
            },
            intent: {
              type: Type.STRING,
              description: 'Primary intent category from the 17 specified categories.',
            },
            actionPayload: {
              type: Type.OBJECT,
              properties: {
                intent: { type: Type.STRING },
                action: { type: Type.STRING },
                target: { type: Type.STRING },
                parameters: { type: Type.OBJECT },
                confidence: { type: Type.NUMBER },
                requires_confirmation: { type: Type.BOOLEAN },
                confirmation_prompt: { type: Type.STRING },
              },
              required: ['intent', 'action', 'target', 'confidence', 'requires_confirmation'],
            },
            multiStepPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  stepNumber: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                  actionPayload: {
                    type: Type.OBJECT,
                    properties: {
                      intent: { type: Type.STRING },
                      action: { type: Type.STRING },
                      target: { type: Type.STRING },
                      parameters: { type: Type.OBJECT },
                      confidence: { type: Type.NUMBER },
                      requires_confirmation: { type: Type.BOOLEAN },
                    },
                    required: ['intent', 'action', 'target'],
                  },
                  status: { type: Type.STRING },
                },
                required: ['id', 'stepNumber', 'description', 'actionPayload', 'status'],
              },
            },
            memoryItemToSave: {
              type: Type.OBJECT,
              properties: {
                key: { type: Type.STRING },
                value: { type: Type.STRING },
                category: { type: Type.STRING },
              },
            },
            requiresConfirmation: { type: Type.BOOLEAN },
            confirmationPrompt: { type: Type.STRING },
          },
          required: ['spokenResponse', 'intent', 'actionPayload'],
        },
      },
    });

    const text = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse Gemini JSON response:', text);
      parsedData = {
        spokenResponse: 'समझ गया, कार्रवाई कर रहा हूँ।',
        intent: 'CONVERSATION',
        actionPayload: {
          intent: 'CONVERSATION',
          action: 'NONE',
          target: 'assistant',
          parameters: {},
          confidence: 0.9,
          requires_confirmation: false,
        },
      };
    }

    // Extract grounding web search sources if present
    let groundingSources: Array<{ title: string; url: string }> = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      groundingSources = chunks
        .filter((c: any) => c.web && c.web.uri)
        .map((c: any) => ({
          title: c.web.title || c.web.uri,
          url: c.web.uri,
        }));
    }

    res.json({
      ...parsedData,
      groundingSources,
    });
  } catch (err: any) {
    console.error('Error in /api/assistant endpoint:', err);
    res.status(500).json({
      error: 'Assistant processing error',
      details: err.message,
      spokenResponse: 'माफ़ कीजिए, एक प्राविधिक समस्या आई है।',
      intent: 'CONVERSATION',
      actionPayload: {
        intent: 'CONVERSATION',
        action: 'ERROR',
        target: 'system',
        parameters: { error: err.message },
        confidence: 0.5,
        requires_confirmation: false,
      },
    });
  }
});

// ============================================================================
// ANDROID COMPANION BRIDGE API ENDPOINTS
// ============================================================================

let androidBridgeState = {
  bridgeStatus: 'disconnected' as 'disconnected' | 'connecting' | 'connected' | 'unauthorized',
  deviceModel: null as string | null,
  androidVersion: null as string | null,
  pairingToken: 'JARVIS-8890-ANDROID',
  ipAddress: '192.168.1.105',
  accessibilityGranted: false,
  lastPingTime: null as number | null,
  pendingCommandsCount: 0,
  executedCommandsCount: 0,
};

let pendingAndroidCommands: any[] = [];
let executedAndroidCommands: any[] = [];

app.get('/api/android/status', (req, res) => {
  res.json({
    ...androidBridgeState,
    requiresAccessibility: !androidBridgeState.accessibilityGranted || androidBridgeState.bridgeStatus !== 'connected',
    message: androidBridgeState.bridgeStatus === 'connected'
      ? 'Android Accessibility Service Connected'
      : 'Android Accessibility Service Required',
  });
});

app.post('/api/android/pair', (req, res) => {
  const { token, deviceModel, androidVersion, ipAddress, accessibilityGranted } = req.body;

  if (token && token === androidBridgeState.pairingToken) {
    androidBridgeState = {
      ...androidBridgeState,
      bridgeStatus: 'connected',
      deviceModel: deviceModel || 'Pixel 8 Pro (Simulated Bridge)',
      androidVersion: androidVersion || 'Android 15',
      ipAddress: ipAddress || '192.168.1.105',
      accessibilityGranted: accessibilityGranted ?? true,
      lastPingTime: Date.now(),
    };

    res.json({
      success: true,
      message: 'Android Companion App paired successfully via Accessibility Service',
      bridgeState: androidBridgeState,
    });
  } else if (token === 'DISCONNECT') {
    androidBridgeState = {
      ...androidBridgeState,
      bridgeStatus: 'disconnected',
      deviceModel: null,
      androidVersion: null,
      accessibilityGranted: false,
      lastPingTime: null,
    };
    res.json({
      success: true,
      message: 'Android Bridge disconnected',
      bridgeState: androidBridgeState,
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid pairing token',
      message: 'Provided pairing token does not match web interface credentials.',
    });
  }
});

app.post('/api/android/execute', (req, res) => {
  const { action, target, parameters, requiresConfirmation } = req.body;

  if (!action) {
    res.status(400).json({ error: 'Action parameter is required' });
    return;
  }

  const command = {
    id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    action,
    target: target || 'screen',
    parameters: parameters || {},
    requiresConfirmation: !!requiresConfirmation,
    timestamp: Date.now(),
    status: 'queued',
  };

  pendingAndroidCommands.push(command);
  androidBridgeState.pendingCommandsCount = pendingAndroidCommands.length;

  res.json({
    success: true,
    message: `Command [${action}] queued for real Android execution`,
    command,
    bridgeStatus: androidBridgeState.bridgeStatus,
    requiresAccessibilityWarning: androidBridgeState.bridgeStatus !== 'connected',
  });
});

app.get('/api/android/commands', (req, res) => {
  const commands = [...pendingAndroidCommands];
  pendingAndroidCommands = [];
  androidBridgeState.pendingCommandsCount = 0;
  androidBridgeState.executedCommandsCount += commands.length;

  res.json({
    commands,
    bridgeStatus: androidBridgeState.bridgeStatus,
  });
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JARVIS Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
