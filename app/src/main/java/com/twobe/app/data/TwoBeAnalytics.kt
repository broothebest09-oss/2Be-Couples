package com.twobe.app.data

import android.content.Context
import android.os.Bundle
import android.util.Log
import java.util.concurrent.ConcurrentLinkedQueue

/**
 * 2Be Analytics Event Tracking Engine (GA4 / Firebase Analytics)
 *
 * Requirements:
 * - Event naming convention: snake_case, max 40 characters
 * - Category prefixes: screen_, user_, feature_, error_, system_, engagement_
 * - Max 25 parameters per event, parameter names snake_case max 40 characters
 * - Values: String, Long/Int, Double, Boolean
 * - User properties: pairing_date, account_age_days, has_cycle_tracker
 * - Respects user consent, batches events, debug mode console logging
 */
object TwoBeAnalytics {
    private const val TAG = "2BeAnalytics"
    private const val PREFS_NAME = "twobe_analytics_prefs"
    private const val KEY_CONSENT = "consent_analytics"
    private const val KEY_PAIRING_DATE = "user_prop_pairing_date"
    private const val KEY_CYCLE_TRACKER = "user_prop_has_cycle_tracker"

    private const val MAX_EVENT_NAME_LENGTH = 40
    private const val MAX_PARAM_KEY_LENGTH = 40
    private const val MAX_PARAMS_COUNT = 25

    private val eventQueue = ConcurrentLinkedQueue<AnalyticsEventData>()
    private var isInitialized = false
    private var currentScreen: String = "screen_home"
    private var previousScreen: String = ""
    private var screenViewCount: Int = 0
    private var sessionStartTime: Long = System.currentTimeMillis()

    data class AnalyticsEventData(
        val name: String,
        val params: Bundle,
        val timestamp: Long = System.currentTimeMillis()
    )

    fun init(context: Context) {
        if (isInitialized) return
        isInitialized = true
        sessionStartTime = System.currentTimeMillis()
        Log.i(TAG, "Firebase Analytics GA4 initialized for 2Be")
        trackAppOpened("icon")
    }

    fun setAnalyticsConsent(context: Context, granted: Boolean) {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putBoolean(KEY_CONSENT, granted)
            .apply()
        Log.i(TAG, "Analytics consent set to: $granted")
    }

    fun hasConsent(context: Context): Boolean {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getBoolean(KEY_CONSENT, true)
    }

    fun setUserProperties(context: Context, pairingDate: String?, hasCycleTracker: Boolean?) {
        val editor = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit()
        pairingDate?.let { editor.putString(KEY_PAIRING_DATE, it) }
        hasCycleTracker?.let { editor.putBoolean(KEY_CYCLE_TRACKER, it) }
        editor.apply()
        Log.d(TAG, "User properties updated: pairingDate=$pairingDate, hasCycleTracker=$hasCycleTracker")
    }

    private fun sanitizeName(name: String): String {
        var clean = name.trim().lowercase().replace(Regex("[^a-z0-9_]"), "_")
        if (clean.length > MAX_EVENT_NAME_LENGTH) {
            Log.w(TAG, "Event name '$clean' exceeds $MAX_EVENT_NAME_LENGTH characters. Truncating.")
            clean = clean.substring(0, MAX_EVENT_NAME_LENGTH)
        }
        return clean
    }

    private fun sanitizeParamKey(key: String): String {
        var clean = key.trim().lowercase().replace(Regex("[^a-z0-9_]"), "_")
        if (clean.length > MAX_PARAM_KEY_LENGTH) {
            clean = clean.substring(0, MAX_PARAM_KEY_LENGTH)
        }
        return clean
    }

    fun logEvent(context: Context, eventName: String, params: Bundle = Bundle()) {
        if (!hasConsent(context)) {
            Log.d(TAG, "Analytics event '$eventName' skipped (User consent revoked)")
            return
        }

        val cleanName = sanitizeName(eventName)
        val cleanParams = Bundle()

        var count = 0
        for (key in params.keySet()) {
            if (count >= MAX_PARAMS_COUNT) {
                Log.w(TAG, "Event '$cleanName' exceeded max params limit ($MAX_PARAMS_COUNT)")
                break
            }
            val sanitizedKey = sanitizeParamKey(key)
            when (val v = params.get(key)) {
                is String -> cleanParams.putString(sanitizedKey, v.take(100))
                is Int -> cleanParams.putInt(sanitizedKey, v)
                is Long -> cleanParams.putLong(sanitizedKey, v)
                is Double -> cleanParams.putDouble(sanitizedKey, v)
                is Float -> cleanParams.putDouble(sanitizedKey, v.toDouble())
                is Boolean -> cleanParams.putBoolean(sanitizedKey, v)
                else -> cleanParams.putString(sanitizedKey, v?.toString()?.take(100) ?: "none")
            }
            count++
        }

        cleanParams.putLong("event_timestamp", System.currentTimeMillis())

        Log.d(TAG, "Logging Event: $cleanName -> $cleanParams")
        eventQueue.offer(AnalyticsEventData(cleanName, cleanParams))

        // In a production app with com.google.firebase:firebase-analytics:
        // FirebaseAnalytics.getInstance(context).logEvent(cleanName, cleanParams)
    }

    // -------------------------------------------------------------
    // Screen Tracking (Automatic)
    // -------------------------------------------------------------
    fun trackScreenView(context: Context, screenName: String, screenClass: String = "MainActivity") {
        var cleanScreen = sanitizeName(screenName)
        if (!cleanScreen.startsWith("screen_")) cleanScreen = "screen_$cleanScreen"

        previousScreen = currentScreen
        currentScreen = cleanScreen
        screenViewCount++

        val bundle = Bundle().apply {
            putString("screen_name", cleanScreen)
            putString("screen_class", screenClass)
            putString("previous_screen", previousScreen)
            putInt("screen_index", screenViewCount)
        }
        logEvent(context, "screen_view", bundle)
    }

    // -------------------------------------------------------------
    // User Lifecycle Events
    // -------------------------------------------------------------
    fun trackSignupStart(context: Context, method: String) {
        logEvent(context, "user_signup_start", Bundle().apply {
            putString("method", method)
        })
    }

    fun trackSignupComplete(context: Context, method: String, timeToCompleteSecs: Long) {
        logEvent(context, "user_signup_complete", Bundle().apply {
            putString("method", method)
            putLong("time_to_complete_seconds", timeToCompleteSecs)
        })
    }

    fun trackProfileCreated(context: Context, hasNickname: Boolean, avatarSelected: String) {
        logEvent(context, "user_profile_created", Bundle().apply {
            putBoolean("has_nickname", hasNickname)
            putString("avatar_selected", avatarSelected)
        })
    }

    fun trackPairingInviteSent(context: Context, method: String) {
        logEvent(context, "user_pairing_invite_sent", Bundle().apply {
            putString("method", method)
        })
    }

    fun trackPairingComplete(context: Context, timeToPairSecs: Long, inviteMethod: String) {
        setUserProperties(context, pairingDate = System.currentTimeMillis().toString(), hasCycleTracker = null)
        logEvent(context, "user_pairing_complete", Bundle().apply {
            putLong("time_to_pair_seconds", timeToPairSecs)
            putString("invite_method", inviteMethod)
        })
    }

    fun trackFirstMessageSent(context: Context, messageType: String) {
        logEvent(context, "user_first_message_sent", Bundle().apply {
            putString("message_type", messageType)
        })
    }

    fun trackFirstKissSent(context: Context) {
        logEvent(context, "user_first_kiss_sent", Bundle())
    }

    fun trackFirstMemorySaved(context: Context, memoryType: String) {
        logEvent(context, "user_first_memory_saved", Bundle().apply {
            putString("memory_type", memoryType)
        })
    }

    // -------------------------------------------------------------
    // Feature Usage Events
    // -------------------------------------------------------------
    fun trackMessageSent(context: Context, messageType: String, hasMedia: Boolean, replyToMessage: Boolean) {
        logEvent(context, "feature_message_sent", Bundle().apply {
            putString("message_type", messageType)
            putBoolean("has_media", hasMedia)
            putBoolean("reply_to_message", replyToMessage)
        })
    }

    fun trackKissSyncCompleted(context: Context, durationSeconds: Long = 3L, partnerResponded: Boolean = true) {
        logEvent(context, "feature_kiss_sync_completed", Bundle().apply {
            putLong("duration_seconds", durationSeconds)
            putBoolean("partner_responded", partnerResponded)
        })
    }

    fun trackHugSyncCompleted(context: Context, durationSeconds: Long = 5L, partnerResponded: Boolean = true) {
        logEvent(context, "feature_hug_sync_completed", Bundle().apply {
            putLong("duration_seconds", durationSeconds)
            putBoolean("partner_responded", partnerResponded)
        })
    }

    fun trackLockedLetterCreated(context: Context, unlockType: String, hasMedia: Boolean) {
        logEvent(context, "feature_locked_letter_created", Bundle().apply {
            putString("unlock_type", unlockType)
            putBoolean("has_media", hasMedia)
        })
    }

    fun trackLockedLetterOpened(context: Context, unlockType: String, timeLockedHours: Double) {
        logEvent(context, "feature_locked_letter_opened", Bundle().apply {
            putString("unlock_type", unlockType)
            putDouble("time_locked_hours", timeLockedHours)
        })
    }

    fun trackScratchOffCreated(context: Context, contentType: String) {
        logEvent(context, "feature_scratch_off_created", Bundle().apply {
            putString("content_type", contentType)
        })
    }

    fun trackScratchOffRevealed(context: Context, contentType: String, scratchDurationSeconds: Long) {
        logEvent(context, "feature_scratch_off_revealed", Bundle().apply {
            putString("content_type", contentType)
            putLong("scratch_duration_seconds", scratchDurationSeconds)
        })
    }

    fun trackGratitudeNoteAdded(context: Context, noteLengthChars: Int) {
        logEvent(context, "feature_gratitude_note_added", Bundle().apply {
            putInt("note_length_chars", noteLengthChars)
        })
    }

    fun trackGratitudeNoteRead(context: Context, method: String) {
        logEvent(context, "feature_gratitude_note_read", Bundle().apply {
            putString("method", method)
        })
    }

    fun trackBucketItemAdded(context: Context, hasCategory: Boolean, hasTargetDate: Boolean) {
        logEvent(context, "feature_bucket_item_added", Bundle().apply {
            putBoolean("has_category", hasCategory)
            putBoolean("has_target_date", hasTargetDate)
        })
    }

    fun trackBucketItemCompleted(context: Context, timeToCompleteDays: Long, createdMemory: Boolean) {
        logEvent(context, "feature_bucket_item_completed", Bundle().apply {
            putLong("time_to_complete_days", timeToCompleteDays)
            putBoolean("created_memory", createdMemory)
        })
    }

    fun trackCycleLogCreated(context: Context, logType: String) {
        setUserProperties(context, pairingDate = null, hasCycleTracker = true)
        logEvent(context, "feature_cycle_log_created", Bundle().apply {
            putString("log_type", logType)
        })
    }

    fun trackAvatarCustomized(context: Context, categoryChanged: String) {
        logEvent(context, "feature_avatar_customized", Bundle().apply {
            putString("category_changed", categoryChanged)
        })
    }

    fun trackWeNeedToTalkStarted(context: Context) {
        logEvent(context, "feature_we_need_to_talk_started", Bundle())
    }

    fun trackWeNeedToTalkCompleted(context: Context, durationMinutes: Long, promptsFilled: Int) {
        logEvent(context, "feature_we_need_to_talk_completed", Bundle().apply {
            putLong("duration_minutes", durationMinutes)
            putInt("prompts_filled", promptsFilled)
        })
    }

    fun trackMemoryLocked(context: Context) {
        logEvent(context, "feature_memory_locked", Bundle())
    }

    fun trackMemoryUnlocked(context: Context, attempts: Int) {
        logEvent(context, "feature_memory_unlocked", Bundle().apply {
            putInt("attempts", attempts)
        })
    }

    // -------------------------------------------------------------
    // Engagement Events
    // -------------------------------------------------------------
    fun trackDailyPromptAnswered(context: Context, promptId: String, responseLengthChars: Int) {
        logEvent(context, "engagement_daily_prompt_answered", Bundle().apply {
            putString("prompt_id", promptId)
            putInt("response_length_chars", responseLengthChars)
        })
    }

    fun trackDailyPromptSkipped(context: Context, promptId: String) {
        logEvent(context, "engagement_daily_prompt_skipped", Bundle().apply {
            putString("prompt_id", promptId)
        })
    }

    fun trackAppOpened(source: String = "icon") {
        Log.d(TAG, "App opened via $source")
    }

    fun trackSessionEnded(context: Context) {
        val duration = (System.currentTimeMillis() - sessionStartTime) / 1000
        logEvent(context, "engagement_session_ended", Bundle().apply {
            putLong("session_duration_seconds", duration)
            putInt("screens_viewed", screenViewCount)
        })
    }

    fun trackStreakMilestoneReached(context: Context, streakDays: Int) {
        logEvent(context, "engagement_streak_milestone_reached", Bundle().apply {
            putInt("streak_days", streakDays)
        })
    }

    // -------------------------------------------------------------
    // Error & Performance Events
    // -------------------------------------------------------------
    fun trackErrorOccurred(context: Context, errorType: String, errorMessage: String, screenName: String, userAction: String) {
        logEvent(context, "error_occurred", Bundle().apply {
            putString("error_type", errorType)
            putString("error_message", errorMessage.take(100))
            putString("screen_name", screenName)
            putString("user_action", userAction)
        })
    }

    fun trackMessageSendFailed(context: Context, messageType: String, errorReason: String, retryCount: Int) {
        logEvent(context, "error_message_send_failed", Bundle().apply {
            putString("message_type", messageType)
            putString("error_reason", errorReason)
            putInt("retry_count", retryCount)
        })
    }

    fun trackSyncFailed(context: Context, feature: String, errorReason: String) {
        logEvent(context, "error_sync_failed", Bundle().apply {
            putString("feature", feature)
            putString("error_reason", errorReason)
        })
    }

    fun trackCrashReported(context: Context, crashType: String, stackTraceHash: String) {
        logEvent(context, "error_crash_reported", Bundle().apply {
            putString("crash_type", crashType)
            putString("stack_trace_hash", stackTraceHash)
        })
    }

    fun trackAnrDetected(context: Context, screenName: String, durationMs: Long) {
        logEvent(context, "error_anr_detected", Bundle().apply {
            putString("screen_name", screenName)
            putLong("duration_ms", durationMs)
        })
    }

    // -------------------------------------------------------------
    // System Events
    // -------------------------------------------------------------
    fun trackNotificationReceived(context: Context, channel: String, notificationType: String) {
        logEvent(context, "system_notification_received", Bundle().apply {
            putString("channel", channel)
            putString("notification_type", notificationType)
        })
    }

    fun trackNotificationTapped(context: Context, channel: String, notificationType: String) {
        logEvent(context, "system_notification_tapped", Bundle().apply {
            putString("channel", channel)
            putString("notification_type", notificationType)
        })
    }

    fun trackBackupCompleted(context: Context, backupSizeMb: Double, durationSeconds: Long) {
        logEvent(context, "system_backup_completed", Bundle().apply {
            putDouble("backup_size_mb", backupSizeMb)
            putLong("duration_seconds", durationSeconds)
        })
    }

    fun trackExportRequested(context: Context, dataTypes: List<String>, format: String) {
        logEvent(context, "system_export_requested", Bundle().apply {
            putString("data_types", dataTypes.joinToString(","))
            putString("format", format)
        })
    }

    fun trackUnpairRequested(context: Context, initiator: String, reason: String?) {
        logEvent(context, "system_unpair_requested", Bundle().apply {
            putString("initiator", initiator)
            putString("reason", reason ?: "not_specified")
        })
    }

    fun trackAccountDeleted(context: Context, accountAgeDays: Long, totalMessagesSent: Int) {
        logEvent(context, "system_account_deleted", Bundle().apply {
            putLong("account_age_days", accountAgeDays)
            putInt("total_messages_sent", totalMessagesSent)
        })
    }
}
