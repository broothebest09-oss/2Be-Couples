/**
 * 2Be Analytics Event Tracking System
 * Backend: Firebase Analytics / Google Analytics 4 (GA4) Measurement Protocol
 *
 * Requirements:
 * - Event names: snake_case, prefixed with category (screen_, user_, feature_, error_, system_), max 40 chars.
 * - Parameters: max 25 per event, snake_case names (max 40 chars), values string | number | boolean.
 * - Automatic screen tracking, user lifecycle, feature usage, engagement, funnels, error & system events.
 * - User properties: pairing_date, account_age_days, has_cycle_tracker.
 * - Consent-aware (respects GDPR/CCPA settings), event batching (30s intervals / background), debug logging.
 */

export type EventCategory = 'screen' | 'user' | 'feature' | 'error' | 'system' | 'engagement';

export interface AnalyticsEvent {
  id: string;
  name: string;
  category: EventCategory;
  params: Record<string, string | number | boolean>;
  timestamp: number;
  synced: boolean;
}

export interface UserProperties {
  pairing_date?: string;
  account_age_days?: number;
  has_cycle_tracker?: boolean;
  age_tier?: string;
  app_version?: string;
  device_platform?: string;
}

export interface FunnelStep {
  name: string;
  event: string;
  description: string;
}

export interface FunnelDefinition {
  id: string;
  name: string;
  description: string;
  steps: FunnelStep[];
}

export const FUNNELS: Record<string, FunnelDefinition> = {
  onboarding: {
    id: 'onboarding',
    name: 'Onboarding & Pairing Funnel',
    description: 'Track drop-off from initial signup through first message sent',
    steps: [
      { name: 'Signup Start', event: 'user_signup_start', description: 'User taps Get Started' },
      { name: 'Profile Created', event: 'user_profile_created', description: 'Name & avatar configured' },
      { name: 'Pairing Invite Sent', event: 'user_pairing_invite_sent', description: 'Invite code generated/shared' },
      { name: 'Pairing Complete', event: 'user_pairing_complete', description: 'Both partners connected' },
      { name: 'First Message Sent', event: 'user_first_message_sent', description: 'First intimacy or text exchange' },
    ],
  },
  kiss_hug_sync: {
    id: 'kiss_hug_sync',
    name: 'Kiss / Hug Sync Funnel',
    description: 'Track tactile sync requests through mutual hold completion',
    steps: [
      { name: 'Affection Initiated', event: 'feature_kiss_button_tapped', description: 'User presses kiss/hug button' },
      { name: 'Partner Notified', event: 'feature_partner_notified', description: 'Real-time push / socket dispatched' },
      { name: 'Partner Responded', event: 'feature_partner_responded', description: 'Partner touches screen' },
      { name: 'Sync Completed', event: 'feature_kiss_sync_completed', description: 'Full 3-second haptic sync success' },
    ],
  },
  locked_letter: {
    id: 'locked_letter',
    name: 'Locked Letter Funnel',
    description: 'Track sealed digital letters from creation to condition unlock',
    steps: [
      { name: 'Letter Created', event: 'feature_locked_letter_created', description: 'Envelope sealed with condition' },
      { name: 'Letter Received', event: 'feature_letter_received', description: 'Delivered to partner chat feed' },
      { name: 'Unlock Condition Met', event: 'feature_unlock_condition_met', description: 'Time, action, or geo radius reached' },
      { name: 'Letter Opened', event: 'feature_locked_letter_opened', description: 'Envelope unpacked & read' },
    ],
  },
};

const GA_MEASUREMENT_ID = 'G-2BECOUPLES1';
const STORAGE_EVENTS_KEY = 'twobe_analytics_events';
const STORAGE_USER_PROPS_KEY = 'twobe_analytics_user_props';
const STORAGE_SESSION_KEY = 'twobe_analytics_session';
const MAX_LOGGED_EVENTS = 200;
const BATCH_INTERVAL_MS = 30000; // 30 seconds

class TwoBeAnalyticsEngine {
  private queue: AnalyticsEvent[] = [];
  private userProps: UserProperties = {};
  private currentScreen = 'screen_home';
  private previousScreen = '';
  private screenViewCount = 0;
  private sessionStartTime = Date.now();
  private batchTimer: ReturnType<typeof setInterval> | null = null;
  private isInitialized = false;

  constructor() {
    this.loadState();
  }

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Start session
    this.startSession();

    // Setup automatic periodic flush (every 30s)
    this.batchTimer = setInterval(() => {
      this.flushQueue();
    }, BATCH_INTERVAL_MS);

    // Setup lifecycle listeners for app backgrounding / unload
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.trackSessionEnded();
        this.flushQueue();
      } else if (document.visibilityState === 'visible') {
        this.trackAppOpened('icon');
      }
    });

    window.addEventListener('beforeunload', () => {
      this.trackSessionEnded();
      this.flushQueue();
    });

    // Initial app open event
    this.trackAppOpened('icon');

    console.log('%c[2Be Analytics] GA4 / Firebase Analytics initialized 🚀', 'color: #E8A5B9; font-weight: bold;');
  }

  /**
   * Evaluates user consent from localStorage (GDPR / CCPA).
   */
  public hasConsent(): boolean {
    try {
      const stored = localStorage.getItem('twobe_legal_consents');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.analytics === 'boolean') {
          return parsed.analytics;
        }
      }
    } catch {
      // fallback
    }
    return true; // Default opt-in with in-app toggle available in settings
  }

  /**
   * Set user properties: pairing_date, account_age_days, has_cycle_tracker, etc.
   */
  public setUserProperties(props: Partial<UserProperties>) {
    this.userProps = { ...this.userProps, ...props };
    try {
      localStorage.setItem(STORAGE_USER_PROPS_KEY, JSON.stringify(this.userProps));
    } catch {
      // ignore
    }
    console.log('[2Be Analytics] User properties updated:', this.userProps);
  }

  public getUserProperties(): UserProperties {
    return { ...this.userProps };
  }

  /**
   * Validate and sanitize event name & parameters according to GA4 rules:
   * - Event name: snake_case, max 40 chars, prefixed with category.
   * - Max 25 params, param names snake_case max 40 chars, values string | number | boolean.
   */
  private validateAndSanitize(
    rawName: string,
    rawParams: Record<string, any>
  ): { validName: string; validParams: Record<string, string | number | boolean>; category: EventCategory } {
    let name = rawName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (name.length > 40) {
      console.warn(`[2Be Analytics] Event name "${name}" exceeded 40 chars. Truncating.`);
      name = name.substring(0, 40);
    }

    // Determine category prefix
    let category: EventCategory = 'feature';
    if (name.startsWith('screen_')) category = 'screen';
    else if (name.startsWith('user_')) category = 'user';
    else if (name.startsWith('feature_')) category = 'feature';
    else if (name.startsWith('error_')) category = 'error';
    else if (name.startsWith('system_')) category = 'system';
    else if (name.startsWith('engagement_')) category = 'engagement';
    else {
      // Prefix default if missing
      name = `feature_${name}`;
      if (name.length > 40) name = name.substring(0, 40);
      category = 'feature';
    }

    const validParams: Record<string, string | number | boolean> = {};
    const keys = Object.keys(rawParams).slice(0, 25); // Max 25 parameters

    for (const k of keys) {
      let paramKey = k.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      if (paramKey.length > 40) paramKey = paramKey.substring(0, 40);

      const val = rawParams[k];
      if (typeof val === 'string') {
        validParams[paramKey] = val.substring(0, 100);
      } else if (typeof val === 'number') {
        validParams[paramKey] = isNaN(val) ? 0 : val;
      } else if (typeof val === 'boolean') {
        validParams[paramKey] = val;
      } else if (val === null || val === undefined) {
        validParams[paramKey] = 'none';
      } else {
        validParams[paramKey] = String(val).substring(0, 100);
      }
    }

    return { validName: name, validParams, category };
  }

  /**
   * Log any arbitrary analytics event with automatic validation, batching, and logging.
   */
  public logEvent(eventName: string, params: Record<string, any> = {}) {
    const { validName, validParams, category } = this.validateAndSanitize(eventName, params);

    const event: AnalyticsEvent = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: validName,
      category,
      params: {
        ...validParams,
        session_id: this.getSessionId(),
      },
      timestamp: Date.now(),
      synced: false,
    };

    // Console debug logging
    const consent = this.hasConsent();
    if (!consent) {
      console.log(
        `%c[2Be Analytics (Consent Denied - Blocked)] %c${event.name}`,
        'color: #8B7578; font-weight: bold;',
        'color: #9B4D6F;',
        event.params
      );
      this.recordToLocalHistory({ ...event, synced: false, params: { ...event.params, consent_denied: true } });
      return;
    }

    console.log(
      `%c[2Be Analytics] %c${event.name}`,
      'color: #E8A5B9; font-weight: bold;',
      'color: #38bdf8;',
      event.params
    );

    this.queue.push(event);
    this.recordToLocalHistory(event);

    // If urgent error or system event, flush immediately
    if (category === 'error' || event.name === 'system_unpair_requested' || event.name === 'system_account_deleted') {
      this.flushQueue();
    }
  }

  /**
   * Send batched events to Firebase / GA4 Measurement Protocol endpoint.
   */
  public async flushQueue() {
    if (this.queue.length === 0 || !this.hasConsent()) return;

    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      // In web companion, simulate or dispatch to GA4 endpoint
      // Payload follows GA4 Measurement Protocol:
      const payload = {
        client_id: this.getClientId(),
        user_id: localStorage.getItem('twobe_user_id') || 'twobe_user_local',
        user_properties: this.userProps,
        events: eventsToSend.map((e) => ({
          name: e.name,
          params: {
            ...e.params,
            engagement_time_msec: 100,
          },
        })),
      };

      // Mark locally as synced
      this.updateLocalHistorySynced(eventsToSend.map((e) => e.id));

      if (window.navigator?.sendBeacon) {
        const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=mock_secret`;
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        window.navigator.sendBeacon(url, blob);
      }
    } catch (err) {
      console.warn('[2Be Analytics] Flush error, retrying next cycle:', err);
      // Re-queue uncompleted events
      this.queue.unshift(...eventsToSend);
    }
  }

  // =========================================================================
  // SCREEN TRACKING (Automatic & Screen Transitions)
  // =========================================================================

  public trackScreenView(screenName: string, screenClass = 'HomeScreen', customPrev?: string) {
    let cleanScreen = screenName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (!cleanScreen.startsWith('screen_')) cleanScreen = `screen_${cleanScreen}`;

    const prev = customPrev || this.currentScreen;
    this.previousScreen = prev;
    this.currentScreen = cleanScreen;
    this.screenViewCount++;

    this.logEvent('screen_view', {
      screen_name: cleanScreen,
      screen_class: screenClass,
      previous_screen: prev,
      screen_index: this.screenViewCount,
    });
  }

  // =========================================================================
  // USER LIFECYCLE EVENTS
  // =========================================================================

  public trackSignupStart(method: 'email' | 'phone' | 'google') {
    this.logEvent('user_signup_start', { method });
  }

  public trackSignupComplete(method: 'email' | 'phone' | 'google', timeToCompleteSeconds: number) {
    this.logEvent('user_signup_complete', {
      method,
      time_to_complete_seconds: Math.round(timeToCompleteSeconds),
    });
  }

  public trackProfileCreated(hasNickname: boolean, avatarSelected: string) {
    this.logEvent('user_profile_created', {
      has_nickname: hasNickname,
      avatar_selected: avatarSelected,
    });
  }

  public trackPairingInviteSent(method: 'sms' | 'email' | 'link' | 'code') {
    this.logEvent('user_pairing_invite_sent', { method });
  }

  public trackPairingComplete(timeToPairSeconds: number, inviteMethod: string) {
    this.setUserProperties({
      pairing_date: new Date().toISOString().split('T')[0],
      account_age_days: 0,
    });
    this.logEvent('user_pairing_complete', {
      time_to_pair_seconds: Math.round(timeToPairSeconds),
      invite_method: inviteMethod,
    });
  }

  public trackFirstMessageSent(messageType: 'text' | 'photo' | 'video' | 'voice' | 'file') {
    this.logEvent('user_first_message_sent', { message_type: messageType });
  }

  public trackFirstKissSent() {
    this.logEvent('user_first_kiss_sent', {});
  }

  public trackFirstMemorySaved(memoryType: 'photo' | 'video' | 'text') {
    this.logEvent('user_first_memory_saved', { memory_type: memoryType });
  }

  // =========================================================================
  // FEATURE USAGE EVENTS
  // =========================================================================

  public trackMessageSent(messageType: string, hasMedia: boolean, replyToMessage: boolean) {
    this.logEvent('feature_message_sent', {
      message_type: messageType,
      has_media: hasMedia,
      reply_to_message: replyToMessage,
    });
  }

  public trackKissButtonTapped() {
    this.logEvent('feature_kiss_button_tapped', { trigger: 'haptic_heart' });
  }

  public trackPartnerNotified(feature: 'kiss' | 'hug' | 'letter') {
    this.logEvent('feature_partner_notified', { feature });
  }

  public trackPartnerResponded(feature: 'kiss' | 'hug') {
    this.logEvent('feature_partner_responded', { feature });
  }

  public trackKissSyncCompleted(durationSeconds = 3, partnerResponded = true) {
    this.logEvent('feature_kiss_sync_completed', {
      duration_seconds: durationSeconds,
      partner_responded: partnerResponded,
    });
  }

  public trackHugSyncCompleted(durationSeconds = 5, partnerResponded = true) {
    this.logEvent('feature_hug_sync_completed', {
      duration_seconds: durationSeconds,
      partner_responded: partnerResponded,
    });
  }

  public trackLockedLetterCreated(unlockType: 'date' | 'action' | 'location', hasMedia: boolean) {
    this.logEvent('feature_locked_letter_created', {
      unlock_type: unlockType,
      has_media: hasMedia,
    });
  }

  public trackLetterReceived(unlockType: string) {
    this.logEvent('feature_letter_received', { unlock_type: unlockType });
  }

  public trackUnlockConditionMet(unlockType: string) {
    this.logEvent('feature_unlock_condition_met', { unlock_type: unlockType });
  }

  public trackLockedLetterOpened(unlockType: 'date' | 'action' | 'location', timeLockedHours: number) {
    this.logEvent('feature_locked_letter_opened', {
      unlock_type: unlockType,
      time_locked_hours: Math.round(timeLockedHours * 10) / 10,
    });
  }

  public trackScratchOffCreated(contentType: 'text' | 'photo' | 'video') {
    this.logEvent('feature_scratch_off_created', { content_type: contentType });
  }

  public trackScratchOffRevealed(contentType: string, scratchDurationSeconds: number) {
    this.logEvent('feature_scratch_off_revealed', {
      content_type: contentType,
      scratch_duration_seconds: Math.round(scratchDurationSeconds),
    });
  }

  public trackGratitudeNoteAdded(noteLengthChars: number) {
    this.logEvent('feature_gratitude_note_added', { note_length_chars: noteLengthChars });
  }

  public trackGratitudeNoteRead(method: 'tap' | 'shake') {
    this.logEvent('feature_gratitude_note_read', { method });
  }

  public trackBucketItemAdded(hasCategory: boolean, hasTargetDate: boolean) {
    this.logEvent('feature_bucket_item_added', {
      has_category: hasCategory,
      has_target_date: hasTargetDate,
    });
  }

  public trackBucketItemCompleted(timeToCompleteDays: number, createdMemory: boolean) {
    this.logEvent('feature_bucket_item_completed', {
      time_to_complete_days: Math.round(timeToCompleteDays),
      created_memory: createdMemory,
    });
  }

  public trackCycleLogCreated(logType: 'start' | 'end' | 'symptoms') {
    this.setUserProperties({ has_cycle_tracker: true });
    this.logEvent('feature_cycle_log_created', { log_type: logType });
  }

  public trackAvatarCustomized(categoryChanged: 'body' | 'face' | 'clothes' | 'accessories') {
    this.logEvent('feature_avatar_customized', { category_changed: categoryChanged });
  }

  public trackWeNeedToTalkStarted() {
    this.logEvent('feature_we_need_to_talk_started', {});
  }

  public trackWeNeedToTalkCompleted(durationMinutes: number, promptsFilled: number) {
    this.logEvent('feature_we_need_to_talk_completed', {
      duration_minutes: Math.round(durationMinutes),
      prompts_filled: promptsFilled,
    });
  }

  public trackMemoryLocked() {
    this.logEvent('feature_memory_locked', {});
  }

  public trackMemoryUnlocked(attempts: number) {
    this.logEvent('feature_memory_unlocked', { attempts });
  }

  // =========================================================================
  // ENGAGEMENT EVENTS
  // =========================================================================

  public trackDailyPromptAnswered(promptId: string, responseLengthChars: number) {
    this.logEvent('engagement_daily_prompt_answered', {
      prompt_id: promptId,
      response_length_chars: responseLengthChars,
    });
  }

  public trackDailyPromptSkipped(promptId: string) {
    this.logEvent('engagement_daily_prompt_skipped', { prompt_id: promptId });
  }

  public trackAppOpened(source: 'icon' | 'notification' | 'deep_link' = 'icon') {
    this.logEvent('engagement_app_opened', { source });
  }

  public trackSessionEnded() {
    const sessionDurationSeconds = Math.round((Date.now() - this.sessionStartTime) / 1000);
    this.logEvent('engagement_session_ended', {
      session_duration_seconds: sessionDurationSeconds,
      screens_viewed: this.screenViewCount,
    });
  }

  public trackStreakMilestoneReached(streakDays: number) {
    this.logEvent('engagement_streak_milestone_reached', { streak_days: streakDays });
  }

  // =========================================================================
  // ERROR & PERFORMANCE EVENTS
  // =========================================================================

  public trackErrorOccurred(errorType: string, errorMessage: string, screenName: string, userAction: string) {
    this.logEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage.substring(0, 100),
      screen_name: screenName,
      user_action: userAction,
    });
  }

  public trackMessageSendFailed(messageType: string, errorReason: string, retryCount: number) {
    this.logEvent('error_message_send_failed', {
      message_type: messageType,
      error_reason: errorReason,
      retry_count: retryCount,
    });
  }

  public trackSyncFailed(feature: 'kiss' | 'hug' | 'letter', errorReason: string) {
    this.logEvent('error_sync_failed', {
      feature,
      error_reason: errorReason,
    });
  }

  public trackCrashReported(crashType: string, stackTraceHash: string) {
    this.logEvent('error_crash_reported', {
      crash_type: crashType,
      stack_trace_hash: stackTraceHash,
    });
  }

  public trackAnrDetected(screenName: string, durationMs: number) {
    this.logEvent('error_anr_detected', {
      screen_name: screenName,
      duration_ms: durationMs,
    });
  }

  // =========================================================================
  // SYSTEM EVENTS
  // =========================================================================

  public trackNotificationReceived(channel: string, notificationType: string) {
    this.logEvent('system_notification_received', {
      channel,
      notification_type: notificationType,
    });
  }

  public trackNotificationTapped(channel: string, notificationType: string) {
    this.logEvent('system_notification_tapped', {
      channel,
      notification_type: notificationType,
    });
  }

  public trackBackupCompleted(backupSizeMb: number, durationSeconds: number) {
    this.logEvent('system_backup_completed', {
      backup_size_mb: backupSizeMb,
      duration_seconds: Math.round(durationSeconds),
    });
  }

  public trackExportRequested(dataTypes: string[], format: 'json' | 'html' | 'zip') {
    this.logEvent('system_export_requested', {
      data_types: dataTypes.join(','),
      format,
    });
  }

  public trackUnpairRequested(initiator: 'self' | 'partner', reason?: string) {
    this.logEvent('system_unpair_requested', {
      initiator,
      reason: reason || 'not_specified',
    });
  }

  public trackAccountDeleted(accountAgeDays: number, totalMessagesSent: number) {
    this.logEvent('system_account_deleted', {
      account_age_days: accountAgeDays,
      total_messages_sent: totalMessagesSent,
    });
  }

  // =========================================================================
  // LOCAL EVENT STREAM, DIAGNOSTICS & DASHBOARD METRICS
  // =========================================================================

  public getLoggedEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem(STORAGE_EVENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public clearLoggedEvents() {
    this.queue = [];
    try {
      localStorage.removeItem(STORAGE_EVENTS_KEY);
    } catch {
      // ignore
    }
  }

  private recordToLocalHistory(event: AnalyticsEvent) {
    try {
      const history = this.getLoggedEvents();
      history.unshift(event);
      if (history.length > MAX_LOGGED_EVENTS) {
        history.length = MAX_LOGGED_EVENTS;
      }
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }

  private updateLocalHistorySynced(ids: string[]) {
    try {
      const history = this.getLoggedEvents();
      const idSet = new Set(ids);
      const updated = history.map((e) => (idSet.has(e.id) ? { ...e, synced: true } : e));
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  private startSession() {
    this.sessionStartTime = Date.now();
    const sessionId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    try {
      sessionStorage.setItem(STORAGE_SESSION_KEY, sessionId);
    } catch {
      // ignore
    }
  }

  private getSessionId(): string {
    try {
      return sessionStorage.getItem(STORAGE_SESSION_KEY) || 's_default';
    } catch {
      return 's_default';
    }
  }

  private getClientId(): string {
    try {
      let cid = localStorage.getItem('twobe_analytics_cid');
      if (!cid) {
        cid = `cid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('twobe_analytics_cid', cid);
      }
      return cid;
    } catch {
      return 'cid_default';
    }
  }

  private loadState() {
    try {
      const props = localStorage.getItem(STORAGE_USER_PROPS_KEY);
      if (props) this.userProps = JSON.parse(props);
    } catch {
      // ignore
    }
  }
}

export const analytics = new TwoBeAnalyticsEngine();
