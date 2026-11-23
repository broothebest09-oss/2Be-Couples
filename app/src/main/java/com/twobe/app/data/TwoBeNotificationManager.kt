package com.twobe.app.data

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.graphics.Color
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.app.RemoteInput
import com.twobe.app.MainActivity
import java.util.Calendar

object TwoBeNotificationManager {

    // ========================================================
    // NOTIFICATION CHANNELS (Google Play Compliance)
    // ========================================================
    const val CHANNEL_MESSAGES = "messages"
    const val CHANNEL_KISSES_HUGS = "kisses_hugs"
    const val CHANNEL_LOCKED_LETTERS = "locked_letters"
    const val CHANNEL_DAILY_PROMPTS = "daily_prompts"
    const val CHANNEL_MILESTONES = "milestones"
    const val CHANNEL_CYCLE_TRACKER = "cycle_tracker"
    const val CHANNEL_SYSTEM = "system"
    const val CHANNEL_UNPAIR_REQUESTS = "unpair_requests"

    // Grouping
    const val GROUP_MESSAGES = "com.twobe.app.MESSAGES"
    const val NOTIFICATION_ID_MESSAGE_SUMMARY = 9999

    // Deep Link Action & Extras
    const val ACTION_DEEP_LINK = "com.twobe.app.action.DEEP_LINK"
    const val EXTRA_DESTINATION = "extra_destination"
    const val EXTRA_PAYLOAD_ID = "extra_payload_id"
    const val KEY_INLINE_REPLY = "key_inline_reply"

    // Preferences
    private const val PREFS_NAME = "twobe_notifications"
    private const val KEY_QUIET_HOURS_ENABLED = "quiet_hours_enabled"
    private const val KEY_QUIET_HOURS_START = "quiet_hours_start" // "22:00"
    private const val KEY_QUIET_HOURS_END = "quiet_hours_end"     // "07:00"
    private const val KEY_BIOMETRIC_PREVIEW_LOCK = "bio_preview_lock"

    /**
     * Initialize all 8 channels on Android 8.0+ (API 26+)
     */
    fun createAllNotificationChannels(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
            ?: return

        val defaultSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        val audioAttributes = AudioAttributes.Builder()
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .setUsage(AudioAttributes.USAGE_NOTIFICATION)
            .build()

        val channels = mutableListOf<NotificationChannel>()

        // CHANNEL 1: messages (HIGH, Sound ON, Vibration ON, Rose LED, Lockscreen YES)
        channels.add(
            NotificationChannel(
                CHANNEL_MESSAGES,
                "Messages",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications for new messages"
                enableLights(true)
                lightColor = Color.parseColor("#E8A5B9") // Rose LED
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 250, 150, 250)
                setSound(defaultSound, audioAttributes)
                lockscreenVisibility = Notification.VISIBILITY_PRIVATE
                setBypassDnd(false)
            }
        )

        // CHANNEL 2: kisses_hugs (HIGH, Custom pulse vibration, Pink LED, Bypass DND: NO)
        channels.add(
            NotificationChannel(
                CHANNEL_KISSES_HUGS,
                "Kisses & Hugs",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "When your partner sends you a kiss or hug"
                enableLights(true)
                lightColor = Color.parseColor("#FF69B4") // Hot pink LED
                enableVibration(true)
                // Pulse pattern mimicking a heartbeat
                vibrationPattern = longArrayOf(0, 150, 100, 150, 300, 150, 100, 150)
                setSound(defaultSound, audioAttributes)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                setBypassDnd(false)
            }
        )

        // CHANNEL 3: locked_letters (HIGH, Custom envelope sound, Purple LED)
        channels.add(
            NotificationChannel(
                CHANNEL_LOCKED_LETTERS,
                "Locked Letters",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "When a locked letter is ready to open"
                enableLights(true)
                lightColor = Color.parseColor("#9B4D6F") // Purple LED
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 300, 200, 400)
                setSound(defaultSound, audioAttributes)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                setBypassDnd(false)
            }
        )

        // CHANNEL 4: daily_prompts (DEFAULT, Sound OFF, Vibration OFF, LED OFF)
        channels.add(
            NotificationChannel(
                CHANNEL_DAILY_PROMPTS,
                "Daily Prompts",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Daily question of the day"
                enableLights(false)
                enableVibration(false)
                setSound(null, null)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                setBypassDnd(false)
            }
        )

        // CHANNEL 5: milestones (DEFAULT, Celebration sound, Gold LED)
        channels.add(
            NotificationChannel(
                CHANNEL_MILESTONES,
                "Milestones",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "When you reach a milestone (100th kiss, etc.)"
                enableLights(true)
                lightColor = Color.parseColor("#FFD700") // Gold LED
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 200, 100, 200, 100, 400)
                setSound(defaultSound, audioAttributes)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                setBypassDnd(false)
            }
        )

        // CHANNEL 6: cycle_tracker (DEFAULT, Sound OFF, Vibration OFF, Hide Details)
        channels.add(
            NotificationChannel(
                CHANNEL_CYCLE_TRACKER,
                "Cycle Tracker",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Period and cycle notifications"
                enableLights(false)
                enableVibration(false)
                setSound(null, null)
                lockscreenVisibility = Notification.VISIBILITY_SECRET // Sensitive health data
                setBypassDnd(false)
            }
        )

        // CHANNEL 7: system (HIGH, Sound ON, Vibration ON, Bypass DND: YES for security)
        channels.add(
            NotificationChannel(
                CHANNEL_SYSTEM,
                "System",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "App updates, security alerts, account notifications"
                enableLights(true)
                lightColor = Color.CYAN
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 300, 150, 300)
                setSound(defaultSound, audioAttributes)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                setBypassDnd(true) // Required for emergency security alerts
            }
        )

        // CHANNEL 8: unpair_requests (HIGH, Sound ON, Red LED, Bypass DND: YES)
        channels.add(
            NotificationChannel(
                CHANNEL_UNPAIR_REQUESTS,
                "Connection Requests",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "When partner requests to unpair"
                enableLights(true)
                lightColor = Color.RED // Red LED
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 250, 500)
                setSound(defaultSound, audioAttributes)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                setBypassDnd(true) // Crucial unpair cooling-off notification
            }
        )

        manager.createNotificationChannels(channels)
    }

    // ========================================================
    // QUIET HOURS LOGIC
    // ========================================================
    fun isQuietHoursActive(context: Context): Boolean {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        if (!prefs.getBoolean(KEY_QUIET_HOURS_ENABLED, false)) return false

        val startStr = prefs.getString(KEY_QUIET_HOURS_START, "22:00") ?: "22:00"
        val endStr = prefs.getString(KEY_QUIET_HOURS_END, "07:00") ?: "07:00"

        val now = Calendar.getInstance()
        val currentMinutes = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE)

        val startParts = startStr.split(":").map { it.toIntOrNull() ?: 0 }
        val endParts = endStr.split(":").map { it.toIntOrNull() ?: 0 }

        val startMinutes = startParts[0] * 60 + startParts[1]
        val endMinutes = endParts[0] * 60 + endParts[1]

        return if (startMinutes < endMinutes) {
            currentMinutes in startMinutes..endMinutes
        } else {
            // Over midnight (e.g. 22:00 to 07:00)
            currentMinutes >= startMinutes || currentMinutes < endMinutes
        }
    }

    // ========================================================
    // NOTIFICATION CONTENT TEMPLATES & SENDERS
    // ========================================================

    /**
     * 1. MESSAGE NOTIFICATION
     * Title: "[Partner Name]", Body: preview (50 chars), Grouping, Inline Reply
     */
    fun sendMessageNotification(
        context: Context,
        partnerName: String,
        messageText: String,
        messageId: String,
        isBiometricLockActive: Boolean = false,
        unreadCount: Int = 1
    ) {
        if (!hasNotificationPermission(context)) return

        val isQuiet = isQuietHoursActive(context)

        val contentText = if (isBiometricLockActive) {
            "New message"
        } else {
            if (messageText.length > 50) "${messageText.take(50)}..." else messageText
        }

        val deepLinkIntent = Intent(context, MainActivity::class.java).apply {
            action = ACTION_DEEP_LINK
            data = Uri.parse("twobe://chat?messageId=$messageId")
            putExtra(EXTRA_DESTINATION, "chat")
            putExtra(EXTRA_PAYLOAD_ID, messageId)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            messageId.hashCode(),
            deepLinkIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Action: Inline Reply
        val remoteInput = RemoteInput.Builder(KEY_INLINE_REPLY)
            .setLabel("Reply to $partnerName...")
            .build()

        val replyPendingIntent = PendingIntent.getActivity(
            context,
            messageId.hashCode() + 1,
            deepLinkIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) PendingIntent.FLAG_MUTABLE else 0)
        )

        val replyAction = NotificationCompat.Action.Builder(
            android.R.drawable.ic_menu_send,
            "Reply",
            replyPendingIntent
        ).addRemoteInput(remoteInput).build()

        val builder = NotificationCompat.Builder(context, CHANNEL_MESSAGES)
            .setSmallIcon(android.R.drawable.ic_dialog_email)
            .setContentTitle(partnerName)
            .setContentText(contentText)
            .setStyle(NotificationCompat.BigTextStyle().bigText(contentText))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setGroup(GROUP_MESSAGES)
            .addAction(replyAction)

        if (isQuiet) {
            builder.setSilent(true)
        }

        NotificationManagerCompat.from(context).notify(messageId.hashCode(), builder.build())

        // Group summary notification if 3+ unread
        if (unreadCount >= 3) {
            val summaryNotification = NotificationCompat.Builder(context, CHANNEL_MESSAGES)
                .setSmallIcon(android.R.drawable.ic_dialog_email)
                .setContentTitle(partnerName)
                .setContentText("$unreadCount new messages from $partnerName")
                .setGroup(GROUP_MESSAGES)
                .setGroupSummary(true)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .apply { if (isQuiet) setSilent(true) }
                .build()

            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID_MESSAGE_SUMMARY, summaryNotification)
        }
    }

    /**
     * 2. KISS / HUG NOTIFICATION
     * Title: "💋 Kiss from [Partner Name]" or "🤗 Hug from [Partner Name]"
     * Priority: HIGH (interrupts), Auto-cancel: NO, Actions: "Send back", "Later"
     */
    fun sendAffectionNotification(
        context: Context,
        partnerName: String,
        type: String = "kiss"
    ) {
        if (!hasNotificationPermission(context)) return

        val isQuiet = isQuietHoursActive(context)
        val emoji = if (type == "kiss") "💋" else "🤗"
        val title = "$emoji ${if (type == "kiss") "Kiss" else "Hug"} from $partnerName"
        val body = "Tap to send one back!"

        val deepLinkIntent = Intent(context, MainActivity::class.java).apply {
            action = ACTION_DEEP_LINK
            data = Uri.parse("twobe://affection?type=$type")
            putExtra(EXTRA_DESTINATION, "affection")
            putExtra(EXTRA_PAYLOAD_ID, type)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            2001,
            deepLinkIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val sendBackAction = NotificationCompat.Action.Builder(
            android.R.drawable.ic_menu_send,
            "Send back",
            pendingIntent
        ).build()

        val notification = NotificationCompat.Builder(context, CHANNEL_KISSES_HUGS)
            .setSmallIcon(android.R.drawable.ic_menu_compass)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(false) // Stays until user explicitly interacts
            .addAction(sendBackAction)
            .apply { if (isQuiet) setSilent(true) }
            .build()

        NotificationManagerCompat.from(context).notify(2001, notification)
    }

    /**
     * 3. LOCKED LETTER NOTIFICATION
     */
    fun sendLockedLetterNotification(
        context: Context,
        partnerName: String,
        letterId: String
    ) {
        if (!hasNotificationPermission(context)) return

        val isQuiet = isQuietHoursActive(context)
        val title = "🔒 Locked letter ready"
        val body = "A letter from $partnerName is ready to open"

        val deepLinkIntent = Intent(context, MainActivity::class.java).apply {
            action = ACTION_DEEP_LINK
            data = Uri.parse("twobe://locked_letter?letterId=$letterId")
            putExtra(EXTRA_DESTINATION, "locked_letter")
            putExtra(EXTRA_PAYLOAD_ID, letterId)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            letterId.hashCode(),
            deepLinkIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val openAction = NotificationCompat.Action.Builder(
            android.R.drawable.ic_dialog_email,
            "Open now",
            pendingIntent
        ).build()

        val notification = NotificationCompat.Builder(context, CHANNEL_LOCKED_LETTERS)
            .setSmallIcon(android.R.drawable.ic_dialog_email)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .addAction(openAction)
            .apply { if (isQuiet) setSilent(true) }
            .build()

        NotificationManagerCompat.from(context).notify(letterId.hashCode(), notification)
    }

    /**
     * 4. DAILY PROMPT NOTIFICATION
     */
    fun sendDailyPromptNotification(
        context: Context,
        promptQuestion: String
    ) {
        if (!hasNotificationPermission(context)) return

        // Daily prompts strictly respect quiet hours
        if (isQuietHoursActive(context)) return

        val title = "Question of the day"
        val body = if (promptQuestion.length > 50) "${promptQuestion.take(50)}..." else promptQuestion

        val deepLinkIntent = Intent(context, MainActivity::class.java).apply {
            action = ACTION_DEEP_LINK
            data = Uri.parse("twobe://prompt")
            putExtra(EXTRA_DESTINATION, "home_prompt")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            4001,
            deepLinkIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_DAILY_PROMPTS)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setSilent(true)
            .build()

        NotificationManagerCompat.from(context).notify(4001, notification)
    }

    /**
     * 5. MILESTONE NOTIFICATION
     */
    fun sendMilestoneNotification(
        context: Context,
        milestoneTitle: String,
        countText: String
    ) {
        if (!hasNotificationPermission(context)) return

        val isQuiet = isQuietHoursActive(context)
        val title = "🎉 Milestone reached!"
        val body = "You've exchanged $countText together"

        val deepLinkIntent = Intent(context, MainActivity::class.java).apply {
            action = ACTION_DEEP_LINK
            data = Uri.parse("twobe://us/stats")
            putExtra(EXTRA_DESTINATION, "us_stats")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            5001,
            deepLinkIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val viewAction = NotificationCompat.Action.Builder(
            android.R.drawable.ic_menu_view,
            "View",
            pendingIntent
        ).build()

        val notification = NotificationCompat.Builder(context, CHANNEL_MILESTONES)
            .setSmallIcon(android.R.drawable.star_on)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .addAction(viewAction)
            .apply { if (isQuiet) setSilent(true) }
            .build()

        NotificationManagerCompat.from(context).notify(5001, notification)
    }

    /**
     * 6. CYCLE TRACKER NOTIFICATION
     */
    fun sendCycleTrackerNotification(
        context: Context,
        phaseMessage: String,
        isBiometricLockActive: Boolean = false
    ) {
        if (!hasNotificationPermission(context)) return
        if (isQuietHoursActive(context)) return

        val title = "Cycle update"
        val body = if (isBiometricLockActive) "Cycle update" else phaseMessage

        val deepLinkIntent = Intent(context, MainActivity::class.java).apply {
            action = ACTION_DEEP_LINK
            data = Uri.parse("twobe://us/cycle")
            putExtra(EXTRA_DESTINATION, "us_cycle")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            6001,
            deepLinkIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_CYCLE_TRACKER)
            .setSmallIcon(android.R.drawable.ic_menu_my_calendar)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setSilent(true)
            .setVisibility(NotificationCompat.VISIBILITY_SECRET)
            .build()

        NotificationManagerCompat.from(context).notify(6001, notification)
    }

    /**
     * 7. SYSTEM NOTIFICATION (Bypasses DND for security alerts)
     */
    fun sendSystemNotification(
        context: Context,
        message: String,
        isSecurityAlert: Boolean = false
    ) {
        if (!hasNotificationPermission(context)) return

        val title = "2Be"
        val deepLinkIntent = Intent(context, MainActivity::class.java).apply {
            action = ACTION_DEEP_LINK
            data = Uri.parse("twobe://settings/security")
            putExtra(EXTRA_DESTINATION, "settings")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            7001,
            deepLinkIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, CHANNEL_SYSTEM)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle(title)
            .setContentText(message)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)

        if (isSecurityAlert) {
            builder.setPriority(NotificationCompat.PRIORITY_MAX)
            // Security alerts always bypass quiet hours and DND
        } else {
            builder.setPriority(NotificationCompat.PRIORITY_DEFAULT)
            if (isQuietHoursActive(context)) {
                builder.setSilent(true)
            }
        }

        NotificationManagerCompat.from(context).notify(7001, builder.build())
    }

    /**
     * 8. UNPAIR REQUEST NOTIFICATION
     * Always audible, bypasses DND and Quiet Hours
     */
    fun sendUnpairRequestNotification(
        context: Context,
        partnerName: String
    ) {
        if (!hasNotificationPermission(context)) return

        val title = "Connection request"
        val body = "$partnerName requested to unpair. You have 72 hours to respond."

        val deepLinkIntent = Intent(context, MainActivity::class.java).apply {
            action = ACTION_DEEP_LINK
            data = Uri.parse("twobe://settings/account")
            putExtra(EXTRA_DESTINATION, "settings_account")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            8001,
            deepLinkIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val reviewAction = NotificationCompat.Action.Builder(
            android.R.drawable.ic_menu_preferences,
            "Review",
            pendingIntent
        ).build()

        val notification = NotificationCompat.Builder(context, CHANNEL_UNPAIR_REQUESTS)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .addAction(reviewAction)
            // NEVER silent: unpair is critical mutual consent
            .build()

        NotificationManagerCompat.from(context).notify(8001, notification)
    }

    // ========================================================
    // PERMISSION HELPER (Android 13+ / API 33+)
    // ========================================================
    fun hasNotificationPermission(context: Context): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ActivityCompat.checkSelfPermission(
                context,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
    }
}
