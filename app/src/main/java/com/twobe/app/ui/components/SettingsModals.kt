package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.twobe.app.ui.screens.*
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing

// 1. Edit Profile Modal
@Composable
fun EditProfileModal(
    currentProfile: UserAccountProfile,
    onDismiss: () -> Unit,
    onSaveProfile: (UserAccountProfile) -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    var name by remember { mutableStateOf(currentProfile.displayName) }
    var nickname by remember { mutableStateOf(currentProfile.nickname) }
    var selectedEmoji by remember { mutableStateOf(currentProfile.avatarEmoji) }

    val presetAvatars = listOf(
        "🐰" to "Bunny",
        "🐻" to "Teddy",
        "🦊" to "Fox",
        "🐱" to "Kitten",
        "🐼" to "Panda",
        "🌸" to "Sakura",
        "✨" to "Starlight",
        "💖" to "Heart"
    )

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(24.dp)),
            color = colors.background,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(spacing.large)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(spacing.medium)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Edit Profile",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(36.dp)) {
                        Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                    }
                }

                // Avatar Selector
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .clip(CircleShape)
                            .background(colors.surfaceVariant),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = selectedEmoji, fontSize = 38.sp)
                    }
                    Text(
                        text = "Tap to change avatar icon:",
                        fontSize = 11.sp,
                        color = colors.textSecondary,
                        modifier = Modifier.padding(top = 8.dp, bottom = 4.dp)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        presetAvatars.take(4).forEach { (emoji, _) ->
                            val isSelected = selectedEmoji == emoji
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(CircleShape)
                                    .background(if (isSelected) colors.primary.copy(alpha = 0.2f) else colors.surfaceVariant)
                                    .border(
                                        width = if (isSelected) 2.dp else 0.dp,
                                        color = if (isSelected) colors.primary else Color.Transparent,
                                        shape = CircleShape
                                    )
                                    .clickable {
                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                        selectedEmoji = emoji
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = emoji, fontSize = 22.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        presetAvatars.drop(4).forEach { (emoji, _) ->
                            val isSelected = selectedEmoji == emoji
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(CircleShape)
                                    .background(if (isSelected) colors.primary.copy(alpha = 0.2f) else colors.surfaceVariant)
                                    .border(
                                        width = if (isSelected) 2.dp else 0.dp,
                                        color = if (isSelected) colors.primary else Color.Transparent,
                                        shape = CircleShape
                                    )
                                    .clickable {
                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                        selectedEmoji = emoji
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = emoji, fontSize = 22.sp)
                            }
                        }
                    }
                }

                // Name input
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = "Your Display Name",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.textPrimary
                    )
                    OutlinedTextField(
                        value = name,
                        onValueChange = { if (it.length <= 20) name = it },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                // Nickname input
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = "Your Private Nickname",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.textPrimary
                    )
                    OutlinedTextField(
                        value = nickname,
                        onValueChange = { if (it.length <= 25) nickname = it },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                TwoBeButton(
                    text = "Save Profile ✨",
                    onClick = {
                        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                        onSaveProfile(
                            currentProfile.copy(
                                displayName = name.trim().ifBlank { currentProfile.displayName },
                                nickname = nickname.trim(),
                                avatarEmoji = selectedEmoji
                            )
                        )
                    },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

// 2. Partner Profile Modal (View Only)
@Composable
fun PartnerProfileModal(
    partner: PartnerAccountProfile,
    onDismiss: () -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .clip(RoundedCornerShape(24.dp)),
            color = colors.background,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(spacing.large),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(spacing.medium)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Partner Profile",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(36.dp)) {
                        Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                    }
                }

                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(CircleShape)
                        .background(colors.accent.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = partner.avatarEmoji, fontSize = 42.sp)
                }

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = partner.displayName,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    Text(
                        text = "You call her \"${partner.nickname}\"",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = colors.accent
                    )
                }

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Connection Status", fontSize = 12.sp, color = colors.textSecondary)
                            Text(text = "🔒 Paired & Encrypted", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = colors.accent)
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Paired Since", fontSize = 12.sp, color = colors.textSecondary)
                            Text(text = partner.pairedDateText, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = colors.textPrimary)
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Days Together", fontSize = 12.sp, color = colors.textSecondary)
                            Text(text = "🔥 ${partner.daysTogether} days", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = colors.primary)
                        }
                    }
                }

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(colors.surface)
                        .padding(10.dp)
                ) {
                    Text(
                        text = "🔒 View Only. Partner controls their own profile and avatar updates.",
                        fontSize = 11.sp,
                        color = colors.textSecondary
                    )
                }

                TwoBeButton(
                    text = "Close",
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

// 3. Unpair Confirm Dialog
@Composable
fun UnpairConfirmDialog(
    partnerName: String,
    onDismiss: () -> Unit,
    onConfirmUnpair: () -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "Dissolve Connection?",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = colors.textPrimary
            )
        },
        text = {
            Text(
                text = "Are you sure you want to unpair from $partnerName? This will dissolve your private space. Dissolving requires mutual consent: both partners must approve before the connection is severed.",
                fontSize = 13.sp,
                lineHeight = 18.sp,
                color = colors.textSecondary
            )
        },
        confirmButton = {
            Button(
                onClick = {
                    view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                    onConfirmUnpair()
                },
                colors = ButtonDefaults.buttonColors(containerColor = colors.error),
                shape = RoundedCornerShape(18.dp)
            ) {
                Text(text = "Request Unpair", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(text = "Cancel", fontSize = 12.sp, color = colors.textSecondary)
            }
        },
        containerColor = colors.background,
        shape = RoundedCornerShape(24.dp)
    )
}

// 4. Backup Settings Modal
@Composable
fun BackupSettingsModal(
    backupInfo: CloudBackupInfo,
    onDismiss: () -> Unit,
    onToggleBackup: (Boolean) -> Unit,
    onBackupNow: () -> Unit,
    onRestore: () -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(24.dp)),
            color = colors.background,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(spacing.large),
                verticalArrangement = Arrangement.spacedBy(spacing.medium)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Cloud Backup",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(36.dp)) {
                        Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                    }
                }

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Google Drive Sync",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Text(
                                    text = backupInfo.backupAccount,
                                    fontSize = 11.sp,
                                    color = colors.textSecondary
                                )
                            }
                            Switch(
                                checked = backupInfo.isEnabled,
                                onCheckedChange = {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    onToggleBackup(it)
                                },
                                colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = colors.primary)
                            )
                        }

                        Divider(color = colors.surface, thickness = 1.dp)

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Last Backup", fontSize = 12.sp, color = colors.textSecondary)
                            Text(text = backupInfo.lastBackupDateText, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = colors.accent)
                        }
                    }
                }

                Text(
                    text = "🔒 Backups are client-side encrypted before uploading to your Google Drive. Only you and your partner hold the decryption key.",
                    fontSize = 11.sp,
                    lineHeight = 15.sp,
                    color = colors.textSecondary
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                            onBackupNow()
                        },
                        modifier = Modifier.weight(1f).height(46.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = colors.primary)
                    ) {
                        Text(text = "Back Up Now ☁️", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }

                    OutlinedButton(
                        onClick = {
                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                            onRestore()
                        },
                        modifier = Modifier.weight(1f).height(46.dp),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Text(text = "Restore Data 🔄", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = colors.accent)
                    }
                }
            }
        }
    }
}

// 5. Export Confirm Dialog
@Composable
fun ExportConfirmDialog(
    onDismiss: () -> Unit,
    onConfirmExport: () -> Unit
) {
    val colors = LocalTwoBeColors.current
    val view = LocalView.current

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(text = "Export All Data? 📦", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = colors.textPrimary)
        },
        text = {
            Text(
                text = "Export all your data? This includes messages, voice notes, photos, and mutual memories in a secure password-protected ZIP archive.",
                fontSize = 13.sp,
                lineHeight = 18.sp,
                color = colors.textSecondary
            )
        },
        confirmButton = {
            Button(
                onClick = {
                    view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                    onConfirmExport()
                },
                colors = ButtonDefaults.buttonColors(containerColor = colors.primary),
                shape = RoundedCornerShape(18.dp)
            ) {
                Text(text = "Download ZIP", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(text = "Cancel", fontSize = 12.sp, color = colors.textSecondary)
            }
        },
        containerColor = colors.background,
        shape = RoundedCornerShape(24.dp)
    )
}

// 6. Delete Account Confirm Dialog
@Composable
fun DeleteAccountConfirmDialog(
    onDismiss: () -> Unit,
    onConfirmDelete: () -> Unit
) {
    val colors = LocalTwoBeColors.current
    val view = LocalView.current

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(text = "Delete Account Permanently?", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = colors.error)
        },
        text = {
            Text(
                text = "Delete your account? This is permanent. Shared data (such as mutual memories and chat history) requires your partner's consent before permanent erasure.",
                fontSize = 13.sp,
                lineHeight = 18.sp,
                color = colors.textSecondary
            )
        },
        confirmButton = {
            Button(
                onClick = {
                    view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                    onConfirmDelete()
                },
                colors = ButtonDefaults.buttonColors(containerColor = colors.error),
                shape = RoundedCornerShape(18.dp)
            ) {
                Text(text = "Delete Permanently", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(text = "Cancel", fontSize = 12.sp, color = colors.textSecondary)
            }
        },
        containerColor = colors.background,
        shape = RoundedCornerShape(24.dp)
    )
}

// 7. Legal Text / Web View Modal
@Composable
fun LegalWebViewModal(
    title: String,
    content: String,
    onDismiss: () -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .fillMaxHeight(0.85f)
                .clip(RoundedCornerShape(24.dp)),
            color = colors.background,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(spacing.large)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = title,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(36.dp)) {
                        Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                    }
                }

                Spacer(modifier = Modifier.height(spacing.medium))

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState())
                ) {
                    Text(
                        text = content,
                        fontSize = 12.sp,
                        lineHeight = 18.sp,
                        color = colors.textSecondary
                    )
                }

                Spacer(modifier = Modifier.height(spacing.medium))

                TwoBeButton(
                    text = "Close",
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}
