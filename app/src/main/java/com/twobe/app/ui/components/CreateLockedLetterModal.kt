package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter

@Composable
fun CreateLockedLetterModal(
    partnerName: String = "Sarah",
    onDismiss: () -> Unit,
    onSendLetter: (LockedLetterPayload) -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    // Inputs
    var letterContent by remember { mutableStateOf("") }
    val attachedMedia = remember { mutableStateListOf<LetterMediaItem>() }

    // Condition state
    var selectedCondition by remember { mutableStateOf(UnlockConditionType.DATE_TIME) }

    // Option 1: Date & Time
    var selectedDate by remember { mutableStateOf(LocalDate.now().plusDays(2)) }
    var selectedHour by remember { mutableIntStateOf(12) }
    var selectedMinute by remember { mutableIntStateOf(0) }

    // Option 2: Action Count
    var selectedActionType by remember { mutableStateOf(LetterActionType.KISSES) }
    var targetActionCount by remember { mutableIntStateOf(10) }

    // Option 3: Location
    var locationName by remember { mutableStateOf("Our Favorite Beach Cafe") }
    var locationRadius by remember { mutableStateOf(LocationRadius.RADIUS_500M) }

    // Toggles
    var showCountdownToPartner by remember { mutableStateOf(true) }

    val dateFormatter = DateTimeFormatter.ofPattern("MMM d, yyyy")

    // Construct live payload for preview
    val liveDateTime = LocalDateTime.of(selectedDate, LocalTime.of(selectedHour, selectedMinute))
    val livePayload = LockedLetterPayload(
        senderName = "You",
        letterContent = letterContent,
        mediaItems = attachedMedia.toList(),
        conditionType = selectedCondition,
        unlockDateTime = liveDateTime,
        targetActionType = selectedActionType,
        targetActionCount = targetActionCount,
        locationName = locationName,
        locationRadius = locationRadius,
        showCountdownToPartner = showCountdownToPartner
    )

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = colors.background
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
            ) {
                // Top Bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = spacing.medium, vertical = spacing.small),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss, modifier = Modifier.height(44.dp)) {
                        Text(text = "Cancel", fontSize = 14.sp, color = colors.textSecondary)
                    }

                    Text(
                        text = "Seal a Love Letter 💌",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )

                    Button(
                        onClick = {
                            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                            onSendLetter(livePayload)
                        },
                        enabled = letterContent.isNotBlank(),
                        shape = RoundedCornerShape(20.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = colors.accent),
                        modifier = Modifier.height(40.dp)
                    ) {
                        Text(text = "Send 🔒", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }

                Divider(color = colors.surfaceVariant, thickness = 1.dp)

                // Scrollable Content
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState())
                        .padding(spacing.medium),
                    verticalArrangement = Arrangement.spacedBy(spacing.medium)
                ) {
                    // Letter Text Area (max 5000 chars)
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Letter Content for $partnerName",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary
                            )
                            Text(
                                text = "${letterContent.length}/5000",
                                fontSize = 11.sp,
                                color = colors.textSecondary
                            )
                        }

                        OutlinedTextField(
                            value = letterContent,
                            onValueChange = { if (it.length <= 5000) letterContent = it },
                            placeholder = {
                                Text(
                                    text = "Pour your heart out... A romantic note, future promise, poem, or anniversary memories waiting to be unlocked.",
                                    fontSize = 13.sp,
                                    lineHeight = 18.sp,
                                    color = colors.textSecondary.copy(alpha = 0.7f)
                                )
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(140.dp),
                            shape = RoundedCornerShape(16.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = colors.surfaceVariant,
                                unfocusedContainerColor = colors.surfaceVariant,
                                focusedBorderColor = colors.primary,
                                unfocusedBorderColor = Color.Transparent
                            )
                        )
                    }

                    // Media Attachments: max 5 photos, max 2 videos
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Attach Photos (max 5) or Videos (max 2)",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary
                            )

                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                val photoCount = attachedMedia.count { !it.isVideo }
                                val videoCount = attachedMedia.count { it.isVideo }

                                if (photoCount < 5) {
                                    AssistChip(
                                        onClick = {
                                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                            attachedMedia.add(
                                                LetterMediaItem(
                                                    url = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80",
                                                    isVideo = false
                                                )
                                            )
                                        },
                                        label = { Text("+ Photo 📸", fontSize = 11.sp) }
                                    )
                                }
                                if (videoCount < 2) {
                                    AssistChip(
                                        onClick = {
                                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                            attachedMedia.add(
                                                LetterMediaItem(
                                                    url = "https://assets.mixkit.co/videos/preview/mixkit-holding-hands-in-a-sunny-park-4221-large.mp4",
                                                    isVideo = true,
                                                    durationText = "0:24"
                                                )
                                            )
                                        },
                                        label = { Text("+ Video 🎥", fontSize = 11.sp) }
                                    )
                                }
                            }
                        }

                        if (attachedMedia.isNotEmpty()) {
                            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                items(attachedMedia) { item ->
                                    Box(
                                        modifier = Modifier
                                            .size(72.dp)
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(colors.surfaceVariant)
                                            .border(1.dp, colors.primary.copy(alpha = 0.4f), RoundedCornerShape(12.dp)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(text = if (item.isVideo) "🎥 ${item.durationText}" else "📸 Photo", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        IconButton(
                                            onClick = { attachedMedia.remove(item) },
                                            modifier = Modifier
                                                .align(Alignment.TopEnd)
                                                .size(22.dp)
                                        ) {
                                            Text(text = "✕", fontSize = 11.sp, color = colors.error)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Select Unlock Condition (Radio Buttons)
                    Text(
                        text = "Select Unlock Condition:",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )

                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        UnlockConditionType.values().forEach { cond ->
                            val isSelected = selectedCondition == cond
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                        selectedCondition = cond
                                    },
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(
                                    containerColor = if (isSelected) colors.primary.copy(alpha = 0.12f) else colors.surfaceVariant
                                ),
                                border = if (isSelected) androidx.compose.foundation.BorderStroke(1.5.dp, colors.primary) else null
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(14.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    RadioButton(
                                        selected = isSelected,
                                        onClick = {
                                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                            selectedCondition = cond
                                        },
                                        colors = RadioButtonDefaults.colors(selectedColor = colors.primary)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(text = cond.emoji, fontSize = 20.sp)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Text(
                                            text = cond.label,
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = colors.textPrimary
                                        )
                                        Text(
                                            text = when (cond) {
                                                UnlockConditionType.DATE_TIME -> "Opens on an exact future calendar date & time"
                                                UnlockConditionType.AFTER_ACTION -> "Opens when partner sends X kisses, hugs, or snaps"
                                                UnlockConditionType.LOCATION -> "Opens when partner arrives at a special romantic spot"
                                            },
                                            fontSize = 11.sp,
                                            color = colors.textSecondary
                                        )
                                    }
                                }
                            }
                        }
                    }

                    // Condition Detailed Config
                    when (selectedCondition) {
                        // 1. Specific Date & Time
                        UnlockConditionType.DATE_TIME -> {
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                            ) {
                                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                    Text(text = "📅 Target Date & Time", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = colors.textPrimary)

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(text = "Date: ${selectedDate.format(dateFormatter)}", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                            OutlinedButton(onClick = { selectedDate = selectedDate.plusDays(1) }, contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)) {
                                                Text(text = "+1 Day", fontSize = 10.sp)
                                            }
                                            OutlinedButton(onClick = { selectedDate = selectedDate.plusWeeks(1) }, contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)) {
                                                Text(text = "+1 Wk", fontSize = 10.sp)
                                            }
                                            OutlinedButton(onClick = { selectedDate = LocalDate.of(2026, 12, 25) }, contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)) {
                                                Text(text = "Dec 25", fontSize = 10.sp)
                                            }
                                        }
                                    }

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(text = "Time: ${String.format("%02d:%02d", selectedHour, selectedMinute)}", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                            AssistChip(onClick = { selectedHour = 12; selectedMinute = 0 }, label = { Text("12:00 PM", fontSize = 10.sp) })
                                            AssistChip(onClick = { selectedHour = 20; selectedMinute = 0 }, label = { Text("8:00 PM", fontSize = 10.sp) })
                                        }
                                    }
                                }
                            }
                        }

                        // 2. After Action
                        UnlockConditionType.AFTER_ACTION -> {
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                            ) {
                                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                    Text(text = "🎯 Required Partner Action", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = colors.textPrimary)

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        LetterActionType.values().forEach { aType ->
                                            val isSel = selectedActionType == aType
                                            Box(
                                                modifier = Modifier
                                                    .weight(1f)
                                                    .clip(RoundedCornerShape(10.dp))
                                                    .background(if (isSel) colors.primary else colors.surface)
                                                    .clickable {
                                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                        selectedActionType = aType
                                                    }
                                                    .padding(vertical = 8.dp),
                                                contentAlignment = Alignment.Center
                                            ) {
                                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                                    Text(text = aType.emoji, fontSize = 16.sp)
                                                    Text(
                                                        text = aType.label,
                                                        fontSize = 10.sp,
                                                        fontWeight = if (isSel) FontWeight.Bold else FontWeight.Medium,
                                                        color = if (isSel) Color.White else colors.textPrimary
                                                    )
                                                }
                                            }
                                        }
                                    }

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(text = "Target count:", fontSize = 12.sp, color = colors.textPrimary)
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                                        ) {
                                            IconButton(
                                                onClick = { if (targetActionCount > 1) targetActionCount-- },
                                                modifier = Modifier.size(36.dp)
                                            ) {
                                                Text(text = "−", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                                            }
                                            Text(text = "$targetActionCount", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = colors.primary)
                                            IconButton(
                                                onClick = { if (targetActionCount < 100) targetActionCount++ },
                                                modifier = Modifier.size(36.dp)
                                            ) {
                                                Text(text = "+", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // 3. Location-Based
                        UnlockConditionType.LOCATION -> {
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                            ) {
                                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                    Text(text = "📍 Romantic Location", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = colors.textPrimary)

                                    OutlinedTextField(
                                        value = locationName,
                                        onValueChange = { locationName = it },
                                        placeholder = { Text("e.g. Airport, Central Park, Our First Date Spot") },
                                        singleLine = true,
                                        modifier = Modifier.fillMaxWidth(),
                                        shape = RoundedCornerShape(12.dp)
                                    )

                                    Text(text = "Unlock Radius:", fontSize = 11.sp, color = colors.textSecondary)
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        LocationRadius.values().forEach { rad ->
                                            val isRadSel = locationRadius == rad
                                            Box(
                                                modifier = Modifier
                                                    .weight(1f)
                                                    .clip(RoundedCornerShape(10.dp))
                                                    .background(if (isRadSel) colors.accent else colors.surface)
                                                    .clickable {
                                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                        locationRadius = rad
                                                    }
                                                    .padding(vertical = 8.dp),
                                                contentAlignment = Alignment.Center
                                            ) {
                                                Text(
                                                    text = "${rad.meters}m",
                                                    fontSize = 11.sp,
                                                    fontWeight = if (isRadSel) FontWeight.Bold else FontWeight.Medium,
                                                    color = if (isRadSel) Color.White else colors.textPrimary
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Optional toggle: Show countdown to partner
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 14.dp, vertical = 10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
                                Text(
                                    text = "Show countdown to partner",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = colors.textPrimary
                                )
                                Text(
                                    text = "Lets them see live timer or action progress bar in chat",
                                    fontSize = 11.sp,
                                    color = colors.textSecondary
                                )
                            }
                            Switch(
                                checked = showCountdownToPartner,
                                onCheckedChange = { showCountdownToPartner = it },
                                colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = colors.primary)
                            )
                        }
                    }

                    // Preview Card
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = colors.primary.copy(alpha = 0.12f)),
                        border = androidx.compose.foundation.BorderStroke(1.dp, colors.primary.copy(alpha = 0.4f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(48.dp)
                                    .clip(CircleShape)
                                    .background(colors.accent.copy(alpha = 0.2f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "🔒", fontSize = 24.sp)
                            }

                            Column {
                                Text(
                                    text = "Sealed Love Letter Preview",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Text(
                                    text = livePayload.getConditionSummary(),
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = colors.accent,
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                                Text(
                                    text = "Client-side encrypted with shared couple key • CMP-MESSAGE_LOCKED_LETTER",
                                    fontSize = 10.sp,
                                    color = colors.textSecondary,
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                            }
                        }
                    }

                    // Large Media Compression Notice (Edge Case 4)
                    if (attachedMedia.isNotEmpty()) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(colors.surfaceVariant.copy(alpha = 0.6f))
                                .padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = "⚡", fontSize = 16.sp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Large media auto-compressed (~65% saved) before end-to-end encryption",
                                fontSize = 11.sp,
                                color = colors.textSecondary
                            )
                        }
                    }

                    // Main Action Send Button
                    Button(
                        onClick = {
                            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                            onSendLetter(livePayload)
                        },
                        enabled = letterContent.isNotBlank(),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = colors.accent),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                    ) {
                        Text(
                            text = "Send Sealed Letter 💌",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }
    }
}
