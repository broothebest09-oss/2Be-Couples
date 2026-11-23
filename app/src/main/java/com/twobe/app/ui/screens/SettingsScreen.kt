package com.twobe.app.ui.screens

import android.view.HapticFeedbackConstants
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.data.TwoBeSoundManager
import com.twobe.app.ui.components.*
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing
import com.twobe.app.ui.theme.ThemeMode
import com.twobe.app.ui.theme.TwoBeHaptics
import java.time.LocalTime
import java.time.format.DateTimeFormatter

@Composable
fun SettingsScreen(
    currentThemeMode: ThemeMode,
    onThemeModeChange: (ThemeMode) -> Unit,
    biometricLockEnabled: Boolean,
    onBiometricLockToggle: (Boolean) -> Unit,
    onBack: () -> Unit,
    onUnpairConfirmed: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    // State holders
    var textScale by remember { mutableStateOf(AppTextScale.MEDIUM) }
    var profile by remember { mutableStateOf(UserAccountProfile()) }
    var partner by remember { mutableStateOf(PartnerAccountProfile()) }
    var backupInfo by remember { mutableStateOf(CloudBackupInfo()) }
    var storageInfo by remember { mutableStateOf(StorageUsageInfo()) }
    var notifications by remember { mutableStateOf(NotificationPreferences()) }
    var cycleTrackerEnabled by remember { mutableStateOf(true) }
    var soundEffectsEnabled by remember { mutableStateOf(TwoBeSoundManager.isSoundEnabled) }
    var hapticsEnabled by remember { mutableStateOf(true) }
    var highContrastEnabled by remember { mutableStateOf(false) }
    var reduceMotionEnabled by remember { mutableStateOf(false) }

    // Modals
    var showEditProfileModal by remember { mutableStateOf(false) }
    var showPartnerProfileModal by remember { mutableStateOf(false) }
    var showUnpairConfirmDialog by remember { mutableStateOf(false) }
    var showBackupModal by remember { mutableStateOf(false) }
    var showExportConfirmDialog by remember { mutableStateOf(false) }
    var showDeleteAccountConfirmDialog by remember { mutableStateOf(false) }
    var showCycleSetupModal by remember { mutableStateOf(false) }
    var showLegalModal by remember { mutableStateOf<Pair<String, String>?>(null) }
    var showTimePickerFor by remember { mutableStateOf<String?>(null) } // "prompt", "quiet_start", "quiet_end"

    // Toast feedback
    var feedbackMessage by remember { mutableStateOf<String?>(null) }

    val timeFormatter = DateTimeFormatter.ofPattern("h:mm a")

    Box(modifier = modifier.fillMaxSize().background(colors.background)) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = spacing.medium)
                .padding(bottom = 80.dp)
        ) {
            // ==========================================
            // HEADER BAR
            // ==========================================
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = spacing.small),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = {
                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                        onBack()
                    },
                    modifier = Modifier.size(44.dp)
                ) {
                    Text(
                        text = "←",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                }

                Text(
                    text = "Settings",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary,
                    modifier = Modifier.padding(start = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(spacing.small))

            // ==========================================
            // SECTION 1: ACCOUNT
            // ==========================================
            SettingsSectionHeader(title = "ACCOUNT")

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
            ) {
                Column {
                    // Profile Row
                    SettingsActionRow(
                        icon = profile.avatarEmoji,
                        title = "Profile",
                        subtitle = "${profile.displayName} • ${profile.nickname}",
                        badge = "Edit",
                        onClick = { showEditProfileModal = true }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Partner Row
                    SettingsActionRow(
                        icon = partner.avatarEmoji,
                        title = "Partner",
                        subtitle = "${partner.displayName} • ${partner.nickname}",
                        badge = "View only",
                        onClick = { showPartnerProfileModal = true }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Unpair Row
                    SettingsActionRow(
                        icon = "💔",
                        title = "Unpair",
                        subtitle = "Dissolve connection with ${partner.displayName}",
                        titleColor = colors.error,
                        onClick = { showUnpairConfirmDialog = true }
                    )
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // SECTION 2: PRIVACY
            // ==========================================
            SettingsSectionHeader(title = "PRIVACY")

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
            ) {
                Column {
                    // Biometric Lock Toggle
                    SettingsToggleRow(
                        icon = "🔒",
                        title = "Biometric Lock",
                        subtitle = "Enables Face ID / fingerprint to open 2Be",
                        checked = biometricLockEnabled,
                        onCheckedChange = {
                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                            onBiometricLockToggle(it)
                            feedbackMessage = if (it) "Biometric Lock enabled 🔒" else "Biometric Lock disabled"
                        }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // End-to-End Encryption
                    SettingsInfoRow(
                        icon = "🛡️",
                        title = "End-to-End Encryption",
                        description = "Always on. Your messages, photos, and memories are strictly private.",
                        highlight = "Active"
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Screenshot Prevention
                    SettingsInfoRow(
                        icon = "📸",
                        title = "Screenshot Prevention",
                        description = "Not available in v1. Trust-based couple space.",
                        highlight = "Trust Mode"
                    )
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // SECTION 3: DATA
            // ==========================================
            SettingsSectionHeader(title = "DATA")

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
            ) {
                Column {
                    // Cloud Backup
                    SettingsActionRow(
                        icon = "☁️",
                        title = "Cloud Backup",
                        subtitle = "Last backup: ${backupInfo.lastBackupDateText}",
                        badge = if (backupInfo.isEnabled) "Google Drive" else "Off",
                        onClick = { showBackupModal = true }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Storage Usage & Clear Cache
                    SettingsActionRow(
                        icon = "💾",
                        title = "Storage",
                        subtitle = "${storageInfo.localUsageMB} MB used (Cache: ${storageInfo.cacheMB} MB)",
                        badge = "Clear Cache",
                        onClick = {
                            storageInfo = storageInfo.copy(cacheMB = 0.0f)
                            feedbackMessage = "Cache cleared successfully! 🧹"
                        }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Export Data
                    SettingsActionRow(
                        icon = "📦",
                        title = "Export Data",
                        subtitle = "Download all chats, memories, and photos as ZIP",
                        onClick = { showExportConfirmDialog = true }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Delete Account
                    SettingsActionRow(
                        icon = "🗑️",
                        title = "Delete Account",
                        subtitle = "Permanent deletion. Shared data requires mutual consent.",
                        titleColor = colors.error,
                        onClick = { showDeleteAccountConfirmDialog = true }
                    )
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // SECTION 4: NOTIFICATIONS
            // ==========================================
            SettingsSectionHeader(title = "NOTIFICATIONS")

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
            ) {
                Column {
                    // Messages
                    SettingsToggleRow(
                        icon = "💬",
                        title = "Messages",
                        subtitle = "Notify when partner sends a text, snap, or file",
                        checked = notifications.messagesEnabled,
                        onCheckedChange = {
                            notifications = notifications.copy(messagesEnabled = it)
                        }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Kisses & Hugs
                    SettingsToggleRow(
                        icon = "💋",
                        title = "Kisses & Hugs",
                        subtitle = "Gentle haptic alert for quick affection taps",
                        checked = notifications.kissesAndHugsEnabled,
                        onCheckedChange = {
                            notifications = notifications.copy(kissesAndHugsEnabled = it)
                        }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Locked Letters
                    SettingsToggleRow(
                        icon = "💌",
                        title = "Locked Letters",
                        subtitle = "Notice when a timed love letter is unlocked",
                        checked = notifications.lockedLettersEnabled,
                        onCheckedChange = {
                            notifications = notifications.copy(lockedLettersEnabled = it)
                        }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Daily Prompt + Time Picker
                    Column(modifier = Modifier.padding(vertical = 4.dp)) {
                        SettingsToggleRow(
                            icon = "❓",
                            title = "Daily Prompt",
                            subtitle = "Question of the day reminder at ${notifications.dailyPromptTime.format(timeFormatter)}",
                            checked = notifications.dailyPromptEnabled,
                            onCheckedChange = {
                                notifications = notifications.copy(dailyPromptEnabled = it)
                            }
                        )
                        if (notifications.dailyPromptEnabled) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Prompt Time",
                                    fontSize = 12.sp,
                                    color = colors.textSecondary
                                )
                                OutlinedButton(
                                    onClick = {
                                        // Cycle through time presets for smooth mock interaction
                                        val nextHour = (notifications.dailyPromptTime.hour + 1) % 24
                                        notifications = notifications.copy(dailyPromptTime = LocalTime.of(nextHour, 0))
                                        feedbackMessage = "Daily prompt time set to ${notifications.dailyPromptTime.format(timeFormatter)}"
                                    },
                                    shape = RoundedCornerShape(12.dp),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text(
                                        text = notifications.dailyPromptTime.format(timeFormatter),
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = colors.primary
                                    )
                                }
                            }
                        }
                    }

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Quiet Hours + Start/End Pickers
                    Column(modifier = Modifier.padding(vertical = 4.dp)) {
                        SettingsToggleRow(
                            icon = "🌙",
                            title = "Quiet Hours",
                            subtitle = "Mute notification sounds and vibrations overnight",
                            checked = notifications.quietHoursEnabled,
                            onCheckedChange = {
                                notifications = notifications.copy(quietHoursEnabled = it)
                            }
                        )
                        if (notifications.quietHoursEnabled) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Quiet Window",
                                    fontSize = 12.sp,
                                    color = colors.textSecondary
                                )
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    OutlinedButton(
                                        onClick = {
                                            val newStart = (notifications.quietHoursStart.hour + 1) % 24
                                            notifications = notifications.copy(quietHoursStart = LocalTime.of(newStart, 0))
                                        },
                                        shape = RoundedCornerShape(12.dp),
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(text = notifications.quietHoursStart.format(timeFormatter), fontSize = 11.sp)
                                    }
                                    Text(text = "to", fontSize = 11.sp, color = colors.textSecondary, modifier = Modifier.align(Alignment.CenterVertically))
                                    OutlinedButton(
                                        onClick = {
                                            val newEnd = (notifications.quietHoursEnd.hour + 1) % 24
                                            notifications = notifications.copy(quietHoursEnd = LocalTime.of(newEnd, 0))
                                        },
                                        shape = RoundedCornerShape(12.dp),
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(text = notifications.quietHoursEnd.format(timeFormatter), fontSize = 11.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // SECTION 5: APPEARANCE
            // ==========================================
            SettingsSectionHeader(title = "APPEARANCE")

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(spacing.medium), verticalArrangement = Arrangement.spacedBy(spacing.medium)) {
                    // Theme Segmented Control: Light / Dark / System
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(
                            text = "Theme",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(999.dp))
                                .background(colors.surface)
                                .padding(3.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            listOf(
                                Triple(ThemeMode.LIGHT, "Light", "☀️"),
                                Triple(ThemeMode.DARK, "Dark", "🌙"),
                                Triple(ThemeMode.SYSTEM, "System", "📱")
                            ).forEach { (mode, label, icon) ->
                                val isSelected = currentThemeMode == mode
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(38.dp)
                                        .clip(RoundedCornerShape(999.dp))
                                        .background(if (isSelected) colors.primary else Color.Transparent)
                                        .clickable {
                                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                            onThemeModeChange(mode)
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Text(text = icon, fontSize = 13.sp)
                                        Text(
                                            text = label,
                                            fontSize = 12.sp,
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                            color = if (isSelected) Color.White else colors.textPrimary
                                        )
                                    }
                                }
                            }
                        }
                    }

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Text Size Segmented Control: Small / Medium / Large
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(
                            text = "Text Size",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(999.dp))
                                .background(colors.surface)
                                .padding(3.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            AppTextScale.values().forEach { scaleOpt ->
                                val isSelected = textScale == scaleOpt
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(38.dp)
                                        .clip(RoundedCornerShape(999.dp))
                                        .background(if (isSelected) colors.accent else Color.Transparent)
                                        .clickable {
                                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                            textScale = scaleOpt
                                            feedbackMessage = "Text size set to ${scaleOpt.label}"
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = scaleOpt.label,
                                        fontSize = 12.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                        color = if (isSelected) Color.White else colors.textPrimary
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // SECTION: ACCESSIBILITY & SOUNDS
            // ==========================================
            SettingsSectionHeader(title = "ACCESSIBILITY & SOUNDS")

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
            ) {
                Column {
                    // Sound Effects Toggle (Soft pops, chimes, clinks)
                    SettingsToggleRow(
                        title = "Sound Effects",
                        subtitle = "Soft pops, romantic chimes, kisses & hugs",
                        checked = soundEffectsEnabled,
                        onCheckedChange = {
                            soundEffectsEnabled = it
                            TwoBeSoundManager.isSoundEnabled = it
                            feedbackMessage = if (it) "Sound effects unmuted 🔔" else "Sound effects muted 🔕"
                        }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Haptic Feedback Toggle
                    SettingsToggleRow(
                        title = "Haptic Feedback",
                        subtitle = "Tactile sensations on taps, syncs & milestones",
                        checked = hapticsEnabled,
                        onCheckedChange = {
                            hapticsEnabled = it
                            feedbackMessage = if (it) "Haptics enabled 📳" else "Haptics disabled"
                        }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // High Contrast Mode
                    SettingsToggleRow(
                        title = "High Contrast Mode",
                        subtitle = "Sharper contrast borders and bolder text",
                        checked = highContrastEnabled,
                        onCheckedChange = {
                            highContrastEnabled = it
                            feedbackMessage = if (it) "High contrast active" else "Standard contrast"
                        }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Reduce Motion
                    SettingsToggleRow(
                        title = "Reduce Motion",
                        subtitle = "Disables spring physics and pulse animations",
                        checked = reduceMotionEnabled,
                        onCheckedChange = {
                            reduceMotionEnabled = it
                            feedbackMessage = if (it) "Animations reduced" else "Full animations active"
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // SECTION 6: HEALTH
            // ==========================================
            SettingsSectionHeader(title = "HEALTH")

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
            ) {
                Column {
                    SettingsToggleRow(
                        icon = "🌸",
                        title = "Cycle Tracker",
                        subtitle = "Track rhythm to help partner support you better. Zero-knowledge privacy.",
                        checked = cycleTrackerEnabled,
                        onCheckedChange = { enabled ->
                            cycleTrackerEnabled = enabled
                            if (enabled) {
                                showCycleSetupModal = true
                            } else {
                                feedbackMessage = "Cycle tracker disabled"
                            }
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // SECTION 7: ABOUT
            // ==========================================
            SettingsSectionHeader(title = "ABOUT")

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
            ) {
                Column {
                    // Help (FAQ + Support)
                    SettingsActionRow(
                        icon = "💡",
                        title = "Help & FAQ",
                        subtitle = "Frequently asked questions and support contact",
                        onClick = {
                            showLegalModal = "Help & FAQ" to (
                                "2Be is a private space created exclusively for 2 people.\n\n" +
                                "1. How does End-to-End Encryption work?\n" +
                                "All messages, photos, notes, and cycle records are encrypted on your device using a shared 256-bit key pair. No server has your decryption keys.\n\n" +
                                "2. Can my partner see my cycle symptoms?\n" +
                                "No. Detailed symptom logs and private notes are strictly stored on your own device. Your partner only receives high-level supportive phase insights.\n\n" +
                                "3. How does Unpairing work?\n" +
                                "Unpairing requires mutual consent. Both partners must approve to dissolve the shared space.\n\n" +
                                "Need help? Email us anytime at support@2be.app"
                            )
                        }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Terms of Service
                    SettingsActionRow(
                        icon = "📜",
                        title = "Terms of Service",
                        subtitle = "Mutual agreements, privacy commitments, and fair use",
                        onClick = {
                            showLegalModal = "Terms of Service" to (
                                "Welcome to 2Be.\n\n" +
                                "1. Intimate Couple Sanctity\n" +
                                "2Be is designed exclusively for two consensual partners. Each couple space is isolated, encrypted, and free from public indexing or third-party advertising.\n\n" +
                                "2. Mutual Ownership\n" +
                                "All memories and shared items are co-owned. Deletion of permanent shared memories requires mutual consent.\n\n" +
                                "3. Zero Advertising & Zero Data Monetization\n" +
                                "We will never sell or train AI models on your private messages, photos, or intimacies.\n\n" +
                                "Effective date: November 2026."
                            )
                        }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Privacy Policy
                    SettingsActionRow(
                        icon = "🛡️",
                        title = "Privacy Policy",
                        subtitle = "Zero data monetization. Client-side encryption standards.",
                        onClick = {
                            showLegalModal = "Privacy Policy" to (
                                "Your Privacy is Paramount.\n\n" +
                                "1. Zero-Knowledge Architecture\n" +
                                "We employ client-side encryption. We cannot read your chats, view your photos, or inspect your gratitude notes.\n\n" +
                                "2. Local Symptom Encryption\n" +
                                "Health and menstrual tracking records never leave your device in raw form.\n\n" +
                                "3. Cloud Backups\n" +
                                "If you enable Google Drive backup, your encrypted blob is uploaded directly to your personal Google Drive account."
                            )
                        }
                    )

                    Divider(color = colors.surface, thickness = 0.8.dp)

                    // Version
                    SettingsInfoRow(
                        icon = "✨",
                        title = "Version",
                        description = "2Be for Android • Build 104",
                        highlight = "v1.0.4"
                    )
                }
            }
        }

        // Feedback Banner
        feedbackMessage?.let { msg ->
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 24.dp, start = 16.dp, end = 16.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(colors.accent)
                    .clickable { feedbackMessage = null }
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(text = "✓", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Text(text = msg, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = Color.White)
                }
            }
        }

        // ==========================================
        // MODALS & DIALOGS
        // ==========================================

        // Profile Edit Modal
        if (showEditProfileModal) {
            EditProfileModal(
                currentProfile = profile,
                onDismiss = { showEditProfileModal = false },
                onSaveProfile = { updated ->
                    profile = updated
                    showEditProfileModal = false
                    feedbackMessage = "Profile updated ✨"
                }
            )
        }

        // Partner Profile Modal
        if (showPartnerProfileModal) {
            PartnerProfileModal(
                partner = partner,
                onDismiss = { showPartnerProfileModal = false }
            )
        }

        // Unpair Confirm Dialog
        if (showUnpairConfirmDialog) {
            UnpairConfirmDialog(
                partnerName = partner.displayName,
                onDismiss = { showUnpairConfirmDialog = false },
                onConfirmUnpair = {
                    showUnpairConfirmDialog = false
                    feedbackMessage = "Unpair request sent to ${partner.displayName}. Awaiting partner approval."
                    onUnpairConfirmed()
                }
            )
        }

        // Backup Settings Modal
        if (showBackupModal) {
            BackupSettingsModal(
                backupInfo = backupInfo,
                onDismiss = { showBackupModal = false },
                onToggleBackup = { isEnabled ->
                    backupInfo = backupInfo.copy(isEnabled = isEnabled)
                },
                onBackupNow = {
                    backupInfo = backupInfo.copy(lastBackupDateText = "Just now")
                    feedbackMessage = "Encrypted backup saved to Google Drive ☁️"
                },
                onRestore = {
                    feedbackMessage = "Data successfully verified & restored 🔄"
                }
            )
        }

        // Export Confirm Dialog
        if (showExportConfirmDialog) {
            ExportConfirmDialog(
                onDismiss = { showExportConfirmDialog = false },
                onConfirmExport = {
                    showExportConfirmDialog = false
                    feedbackMessage = "Preparing ZIP export... Download will begin shortly 📦"
                }
            )
        }

        // Delete Account Confirm Dialog
        if (showDeleteAccountConfirmDialog) {
            DeleteAccountConfirmDialog(
                onDismiss = { showDeleteAccountConfirmDialog = false },
                onConfirmDelete = {
                    showDeleteAccountConfirmDialog = false
                    feedbackMessage = "Account deletion initiated. Consent request sent to partner."
                }
            )
        }

        // Cycle Tracker Setup Modal
        if (showCycleSetupModal) {
            CycleSetupDialog(
                initialSettings = CycleSettings(),
                isInitialSetup = true,
                onDismiss = { showCycleSetupModal = false },
                onSave = {
                    showCycleSetupModal = false
                    cycleTrackerEnabled = true
                    feedbackMessage = "Cycle Tracker configured & enabled 🌸"
                }
            )
        }

        // Legal / FAQ Reader Modal
        showLegalModal?.let { (title, content) ->
            LegalWebViewModal(
                title = title,
                content = content,
                onDismiss = { showLegalModal = null }
            )
        }
    }
}

@Composable
private fun SettingsSectionHeader(title: String) {
    val colors = LocalTwoBeColors.current
    Text(
        text = title,
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        color = colors.textSecondary,
        letterSpacing = 1.2.sp,
        modifier = Modifier.padding(start = 4.dp, bottom = 6.dp)
    )
}

@Composable
private fun SettingsActionRow(
    icon: String,
    title: String,
    subtitle: String,
    badge: String? = null,
    titleColor: Color? = null,
    onClick: () -> Unit
) {
    val colors = LocalTwoBeColors.current
    val view = LocalView.current

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable {
                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                onClick()
            }
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            modifier = Modifier.weight(1f).padding(end = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(text = icon, fontSize = 20.sp)
            Column {
                Text(
                    text = title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = titleColor ?: colors.textPrimary
                )
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = colors.textSecondary,
                    maxLines = 1
                )
            }
        }

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            badge?.let {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(colors.surface)
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = it,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.accent
                    )
                }
            }
            Text(text = "›", fontSize = 18.sp, color = colors.textSecondary)
        }
    }
}

@Composable
private fun SettingsToggleRow(
    icon: String,
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    val colors = LocalTwoBeColors.current
    val view = LocalView.current

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            modifier = Modifier.weight(1f).padding(end = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(text = icon, fontSize = 20.sp)
            Column {
                Text(
                    text = title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = colors.textSecondary,
                    lineHeight = 15.sp
                )
            }
        }

        Switch(
            checked = checked,
            onCheckedChange = {
                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                onCheckedChange(it)
            },
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = colors.primary
            )
        )
    }
}

@Composable
private fun SettingsInfoRow(
    icon: String,
    title: String,
    description: String,
    highlight: String
) {
    val colors = LocalTwoBeColors.current

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            modifier = Modifier.weight(1f).padding(end = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(text = icon, fontSize = 20.sp)
            Column {
                Text(
                    text = title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )
                Text(
                    text = description,
                    fontSize = 11.sp,
                    color = colors.textSecondary,
                    lineHeight = 15.sp
                )
            }
        }

        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(colors.surface)
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            Text(
                text = highlight,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = colors.primary
            )
        }
    }
}
