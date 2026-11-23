package com.twobe.app.ui.screens

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.window.Dialog
import com.twobe.app.ui.components.ButtonVariant
import com.twobe.app.ui.components.TwoBeButton
import com.twobe.app.data.LockedLetterNotificationManager
import com.twobe.app.data.TwoBeSoundManager
import com.twobe.app.ui.theme.TwoBeHaptics
import com.twobe.app.ui.components.WeNeedToTalkDialog
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.AttachmentAction
import com.twobe.app.ui.components.ChatAttachmentBottomSheet
import com.twobe.app.ui.components.CreateLockedLetterModal
import com.twobe.app.ui.components.FullScreenMediaDialog
import com.twobe.app.ui.components.HoldAffectionType
import com.twobe.app.ui.components.KissHugHoldOverlay
import com.twobe.app.ui.components.LockedLetterStatusDialog
import com.twobe.app.ui.components.LucideHeartIcon
import com.twobe.app.ui.components.MessageBubbleItem
import com.twobe.app.ui.components.OpenLockedLetterModal
import com.twobe.app.ui.components.TypingIndicator
import com.twobe.app.ui.theme.TwoBeTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(
    partnerName: String = "Sarah",
    partnerAvatarEmoji: String = "🌸",
    onNavigateToPartnerProfile: () -> Unit = {}
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    // Interactive States
    var inputMessageText by remember { mutableStateOf("") }
    var isPartnerTyping by remember { mutableStateOf(false) }
    var isLoadingOlderMessages by remember { mutableStateOf(false) }
    var hasNetworkError by remember { mutableStateOf(false) }
    var showAttachmentMenu by remember { mutableStateOf(false) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    // Kiss / Hug hold overlay state
    var activeHoldOverlay by remember { mutableStateOf<HoldAffectionType?>(null) }

    // Media viewer state
    var selectedMediaMessage by remember { mutableStateOf<TwoBeMessage?>(null) }

    // Locked letter states
    var showCreateLockedLetterModal by remember { mutableStateOf(false) }
    var activeLockedLetterStatus by remember { mutableStateOf<LockedLetterPayload?>(null) }
    var activeOpenLockedLetter by remember { mutableStateOf<LockedLetterPayload?>(null) }

    // We Need to Talk mode states
    var showWeNeedToTalkDialog by remember { mutableStateOf(false) }
    var isGentleModeActive by remember { mutableStateOf(false) }

    // Micro-interactions & Message options
    val clipboardManager = LocalClipboardManager.current
    var messageForOptions by remember { mutableStateOf<TwoBeMessage?>(null) }
    var replyingToMessage by remember { mutableStateOf<TwoBeMessage?>(null) }

    // Message list with all 9 types initially represented
    val messages = remember {
        mutableStateListOf(
            TwoBeMessage(
                id = "1",
                senderIsMe = false,
                type = MessageType.TEXT,
                text = "Good morning, my world! Woke up thinking about how lucky I am to have you by my side. Have the sweetest day! 🌸",
                timestamp = "08:15 AM",
                dateGroup = "Yesterday"
            ),
            TwoBeMessage(
                id = "2",
                senderIsMe = true,
                type = MessageType.PHOTO,
                text = "Look at this peaceful morning sky outside my window ☁️",
                mediaUrl = "photo_morning",
                timestamp = "08:22 AM",
                dateGroup = "Yesterday"
            ),
            TwoBeMessage(
                id = "3",
                senderIsMe = false,
                type = MessageType.KISS,
                timestamp = "09:05 AM",
                dateGroup = "Yesterday"
            ),
            TwoBeMessage(
                id = "4",
                senderIsMe = true,
                type = MessageType.VIDEO,
                durationText = "0:24",
                timestamp = "11:40 AM",
                dateGroup = "Yesterday"
            ),
            TwoBeMessage(
                id = "5",
                senderIsMe = false,
                type = MessageType.FILE,
                fileName = "our_weekend_cabin_plan.pdf",
                fileSize = "2.1 MB",
                timestamp = "02:15 PM",
                dateGroup = "Today"
            ),
            TwoBeMessage(
                id = "6",
                senderIsMe = true,
                type = MessageType.SNAP,
                text = "Live snap from my coffee break ☕",
                timestamp = "03:10 PM",
                dateGroup = "Today"
            ),
            TwoBeMessage(
                id = "7",
                senderIsMe = false,
                type = MessageType.LOCKED_LETTER,
                lockedCondition = "Opens on your anniversary in 2 days 🔒",
                lockedLetterPayload = LockedLetterPayload(
                    senderName = partnerName,
                    letterContent = "My Dearest Love,\n\nI wrote this letter thinking about how far we've come. From that very first awkward coffee date where we talked for five straight hours until the cafe closed, to building our cozy dream together.\n\nThank you for loving me patiently, holding me gently, and believing in every crazy idea I share with you. Distance is only temporary, but what we are building is forever.\n\nI love you endlessly,\nAlways yours ❤️",
                    conditionType = UnlockConditionType.DATE_TIME,
                    unlockDateTime = LocalDateTime.now().plusDays(2),
                    showCountdownToPartner = true
                ),
                timestamp = "04:30 PM",
                dateGroup = "Today"
            ),
            TwoBeMessage(
                id = "8",
                senderIsMe = false,
                type = MessageType.SCRATCH_OFF,
                scratchSecretText = "Free back massage & homemade pasta dinner tonight! 🍝✨",
                timestamp = "05:00 PM",
                dateGroup = "Today"
            )
        )
    }

    fun currentTime(): String {
        return SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
    }

    fun sendMessage(type: MessageType, text: String = "", scratchText: String? = null) {
        TwoBeHaptics.mediumTap(view)
        when (type) {
            MessageType.KISS -> TwoBeSoundManager.playKissSent()
            MessageType.HUG -> TwoBeSoundManager.playHugWhoosh()
            MessageType.SCRATCH_OFF -> TwoBeSoundManager.playScratchOff()
            else -> TwoBeSoundManager.playMessageSend()
        }

        val newMsg = TwoBeMessage(
            senderIsMe = true,
            type = type,
            text = text,
            replyToMessageText = replyingToMessage?.text?.take(40)?.ifEmpty { replyingToMessage?.type?.name },
            scratchSecretText = scratchText,
            timestamp = currentTime(),
            dateGroup = "Today",
            status = MessageDeliveryStatus.SENT
        )
        replyingToMessage = null
        messages.add(newMsg)
        scope.launch {
            delay(100L)
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    // Simulate partner typing occasionally
    LaunchedEffect(Unit) {
        delay(4000L)
        isPartnerTyping = true
        delay(3500L)
        isPartnerTyping = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
            .imePadding()
    ) {
        // ==========================================
        // HEADER (Sticky Top)
        // ==========================================
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .shadow(
                    elevation = 2.dp,
                    ambientColor = colors.accent.copy(alpha = 0.05f)
                )
                .background(colors.surface)
                .padding(horizontal = spacing.medium, vertical = spacing.xSmall),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Left: Partner avatar (40px circle) + Name + Status text
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .clickable {
                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                        onNavigateToPartnerProfile()
                    }
                    .padding(4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(colors.primary.copy(alpha = 0.25f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = partnerAvatarEmoji, fontSize = 22.sp)
                    // Online dot
                    Box(
                        modifier = Modifier
                            .align(Alignment.BottomEnd)
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(colors.success)
                            .border(1.5.dp, colors.surface, CircleShape)
                    )
                }

                Spacer(modifier = Modifier.width(spacing.small))

                Column {
                    Text(
                        text = partnerName,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    Text(
                        text = if (isPartnerTyping) "typing..." else "Online",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = if (isPartnerTyping) colors.accent else colors.success
                    )
                }
            }

            // Right: We Need to Talk, Video Call placeholder & More menu
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .clickable {
                            TwoBeHaptics.lightTap(view)
                            showWeNeedToTalkDialog = true
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "🕊️", fontSize = 20.sp)
                }

                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .clickable {
                            TwoBeHaptics.lightTap(view)
                            // Placeholder for v2 call
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "📹", fontSize = 20.sp)
                }

                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .clickable {
                            TwoBeHaptics.lightTap(view)
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "⋮", fontSize = 22.sp, color = colors.textSecondary)
                }
            }
        }

        // Gentle Mode Active Banner
        if (isGentleModeActive) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(colors.accent.copy(alpha = 0.15f))
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "🕊️", fontSize = 16.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Gentle Mode: Breathe before replying",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.textPrimary
                    )
                }
                Text(
                    text = "Exit",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.primary,
                    modifier = Modifier.clickable { isGentleModeActive = false }
                )
            }
        }

        // Network error banner (edge case)
        if (hasNetworkError) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(colors.error)
                    .padding(horizontal = spacing.medium, vertical = 6.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Connection lost. Messages will send when back online.",
                        color = Color.White,
                        fontSize = 11.sp
                    )
                    Text(
                        text = "Retry",
                        color = Color.White,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .clickable { hasNetworkError = false }
                            .padding(4.dp)
                    )
                }
            }
        }

        // ==========================================
        // MESSAGE LIST (Fills Middle, Scrollable)
        // ==========================================
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
            if (messages.isEmpty()) {
                // Empty state
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(spacing.large),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(text = "💌", fontSize = 48.sp)
                    Text(
                        text = "Start your conversation",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary,
                        modifier = Modifier.padding(top = 12.dp)
                    )
                    Text(
                        text = "Send your first whisper, a secret scratch card, or hold to send a kiss.",
                        fontSize = 13.sp,
                        color = colors.textSecondary,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        TwoBeButton(text = "Send Kiss 💋", onClick = { activeHoldOverlay = HoldAffectionType.KISS })
                        TwoBeButton(text = "Send Hug 🤗", onClick = { activeHoldOverlay = HoldAffectionType.HUG })
                    }
                }
            } else {
                LazyColumn(
                    state = listState,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = spacing.medium),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    // Loading older messages indicator at top
                    item {
                        if (isLoadingOlderMessages) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = spacing.small),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(20.dp),
                                    color = colors.accent,
                                    strokeWidth = 2.dp
                                )
                            }
                        } else {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        isLoadingOlderMessages = true
                                        scope.launch {
                                            delay(1000L)
                                            isLoadingOlderMessages = false
                                        }
                                    }
                                    .padding(vertical = spacing.xSmall),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "Load earlier messages",
                                    fontSize = 11.sp,
                                    color = colors.textSecondary
                                )
                            }
                        }
                    }

                    // Messages with Day Separators
                    var lastDateGroup = ""
                    messages.forEach { msg ->
                        if (msg.dateGroup != lastDateGroup) {
                            lastDateGroup = msg.dateGroup
                            item(key = "separator_${msg.dateGroup}_${msg.id}") {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = spacing.small),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(999.dp))
                                            .background(colors.surfaceVariant)
                                            .padding(horizontal = spacing.small, vertical = 4.dp)
                                    ) {
                                        Text(
                                            text = msg.dateGroup,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = colors.textSecondary
                                        )
                                    }
                                }
                            }
                        }

                        item(key = msg.id) {
                            MessageBubbleItem(
                                message = msg,
                                onMediaClick = { clickedMsg ->
                                    if (clickedMsg.type == MessageType.LOCKED_LETTER) {
                                        val payload = clickedMsg.lockedLetterPayload ?: LockedLetterPayload(
                                            senderName = if (clickedMsg.senderIsMe) "You" else partnerName,
                                            letterContent = "My Dearest Love,\n\nI wrote this letter thinking about how far we've come. Distance is temporary, but what we have is forever. ❤️",
                                            conditionType = UnlockConditionType.DATE_TIME,
                                            unlockDateTime = LocalDateTime.now().plusDays(2),
                                            showCountdownToPartner = true
                                        )
                                        if (payload.isConditionMet() || clickedMsg.isUnlocked) {
                                            activeOpenLockedLetter = payload
                                        } else {
                                            activeLockedLetterStatus = payload
                                        }
                                    } else {
                                        selectedMediaMessage = clickedMsg
                                    }
                                },
                                onRetrySend = { it.status = MessageDeliveryStatus.SENT },
                                onReaction = { targetMsg, emoji ->
                                    val idx = messages.indexOfFirst { it.id == targetMsg.id }
                                    if (idx != -1) {
                                        val currentEmoji = messages[idx].reactionEmoji
                                        val newEmoji = if (currentEmoji == emoji) null else emoji
                                        messages[idx] = messages[idx].copy(reactionEmoji = newEmoji)
                                    }
                                },
                                onReply = { targetMsg ->
                                    replyingToMessage = targetMsg
                                },
                                onLongPress = { targetMsg ->
                                    messageForOptions = targetMsg
                                }
                            )
                        }
                    }

                    // Typing Indicator item
                    if (isPartnerTyping) {
                        item(key = "typing_indicator") {
                            Box(modifier = Modifier.padding(vertical = 4.dp)) {
                                TypingIndicator()
                            }
                        }
                    }
                }
            }
        }

        // ==========================================
        // REPLYING BANNER
        // ==========================================
        if (replyingToMessage != null) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(colors.surfaceVariant.copy(alpha = 0.6f))
                    .padding(horizontal = spacing.medium, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Replying to ${if (replyingToMessage!!.senderIsMe) "yourself" else partnerName}",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.primary
                    )
                    Text(
                        text = replyingToMessage!!.text.ifEmpty { replyingToMessage!!.type.name },
                        fontSize = 12.sp,
                        color = colors.textSecondary,
                        maxLines = 1,
                        overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                    )
                }
                Text(
                    text = "✕",
                    fontSize = 14.sp,
                    color = colors.textSecondary,
                    modifier = Modifier
                        .clip(CircleShape)
                        .clickable { replyingToMessage = null }
                        .padding(4.dp)
                )
            }
        }

        // ==========================================
        // QUICK ACTIONS STRIP (Above Input)
        // ==========================================
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.surface)
                .padding(horizontal = spacing.medium, vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(spacing.small),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Camera icon (opens camera snap)
            QuickInputPill(
                icon = "📸",
                label = "Snap",
                onClick = {
                    sendMessage(MessageType.SNAP, text = "New camera snap ✨")
                }
            )

            // Kiss icon 💋 (triggers kiss sync)
            QuickInputPill(
                icon = "💋",
                label = "Kiss",
                onClick = {
                    activeHoldOverlay = HoldAffectionType.KISS
                }
            )

            // Hug icon 🤗 (triggers hug sync)
            QuickInputPill(
                icon = "🤗",
                label = "Hug",
                onClick = {
                    activeHoldOverlay = HoldAffectionType.HUG
                }
            )

            // Scratch-off icon 🎁 (creates scratch-off message)
            QuickInputPill(
                icon = "🎁",
                label = "Scratch",
                onClick = {
                    sendMessage(
                        MessageType.SCRATCH_OFF,
                        scratchText = "You get 1 free wish granted tonight! ❤️"
                    )
                }
            )
        }

        // ==========================================
        // INPUT AREA (Sticky Bottom)
        // ==========================================
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.surface)
                .padding(horizontal = spacing.medium, vertical = spacing.xxSmall)
                .padding(bottom = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Plus Icon (opens attachment menu)
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(colors.surfaceVariant)
                    .clickable {
                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                        showAttachmentMenu = true
                    },
                contentAlignment = Alignment.Center
            ) {
                Text(text = "+", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = colors.accent)
            }

            Spacer(modifier = Modifier.width(spacing.xxSmall))

            // Text input field (multi-line, auto-expand up to 5 lines)
            OutlinedTextField(
                value = inputMessageText,
                onValueChange = { inputMessageText = it },
                placeholder = {
                    Text(
                        text = "Whisper something sweet...",
                        fontSize = 14.sp,
                        color = colors.textSecondary
                    )
                },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(22.dp),
                maxLines = 5,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = colors.background,
                    unfocusedContainerColor = colors.background,
                    focusedBorderColor = colors.primary,
                    unfocusedBorderColor = colors.border
                )
            )

            // Send Button (appears when text entered, with spring animation)
            AnimatedVisibility(
                visible = inputMessageText.isNotBlank(),
                enter = scaleIn(spring(stiffness = Spring.StiffnessMediumLow)) + fadeIn(),
                exit = scaleOut() + fadeOut()
            ) {
                Row {
                    Spacer(modifier = Modifier.width(spacing.xxSmall))
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .shadow(4.dp, CircleShape, spotColor = colors.primary)
                            .clip(CircleShape)
                            .background(
                                Brush.linearGradient(
                                    listOf(colors.primary, colors.accent)
                                )
                            )
                            .clickable {
                                if (inputMessageText.isNotBlank()) {
                                    view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                    sendMessage(MessageType.TEXT, text = inputMessageText.trim())
                                    inputMessageText = ""
                                }
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "↑", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }

    // Attachment Menu Modal Bottom Sheet
    if (showAttachmentMenu) {
        ChatAttachmentBottomSheet(
            sheetState = sheetState,
            onSelectAction = { action ->
                showAttachmentMenu = false
                when (action) {
                    AttachmentAction.PHOTO_GALLERY -> {
                        sendMessage(MessageType.PHOTO, text = "Shared from gallery 📸")
                    }
                    AttachmentAction.VIDEO_GALLERY -> {
                        sendMessage(MessageType.VIDEO, text = "Shared video 🎥")
                    }
                    AttachmentAction.FILE_DOCUMENT -> {
                        sendMessage(MessageType.FILE, text = "important_document.pdf")
                    }
                    AttachmentAction.LOCKED_LETTER -> {
                        showCreateLockedLetterModal = true
                    }
                    AttachmentAction.SCRATCH_OFF -> {
                        sendMessage(
                            MessageType.SCRATCH_OFF,
                            scratchText = "Redeemable for: 1 cozy breakfast in bed! 🥐☕"
                        )
                    }
                }
            },
            onDismiss = { showAttachmentMenu = false }
        )
    }

    // Kiss / Hug 3-second Interactive Hold Overlay
    if (activeHoldOverlay != null) {
        KissHugHoldOverlay(
            type = activeHoldOverlay!!,
            partnerName = partnerName,
            isPartnerOnline = true,
            onSuccess = { completedType ->
                activeHoldOverlay = null
                if (completedType == HoldAffectionType.KISS) {
                    sendMessage(MessageType.KISS)
                } else {
                    sendMessage(MessageType.HUG)
                }
            },
            onDismiss = { activeHoldOverlay = null }
        )
    }

    // Full Screen Media Preview Dialog
    FullScreenMediaDialog(
        message = selectedMediaMessage,
        onDismiss = { selectedMediaMessage = null }
    )

    // Create Locked Letter Modal
    if (showCreateLockedLetterModal) {
        CreateLockedLetterModal(
            onDismiss = { showCreateLockedLetterModal = false },
            onSendLetter = { payload ->
                showCreateLockedLetterModal = false
                val newMsg = TwoBeMessage(
                    senderIsMe = true,
                    type = MessageType.LOCKED_LETTER,
                    text = "A secret letter waiting for our special moment 🔒",
                    lockedCondition = payload.getConditionSummary(),
                    lockedLetterPayload = payload,
                    timestamp = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date()),
                    dateGroup = "Today"
                )
                messages.add(newMsg)
                scope.launch {
                    listState.animateScrollToItem(messages.size - 1)
                }

                if (payload.conditionType == UnlockConditionType.DATE_TIME) {
                    val epochMs = payload.unlockDateTime.atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli()
                    LockedLetterNotificationManager.scheduleTimeUnlockAlarm(
                        context = context,
                        letterId = payload.id,
                        unlockTimestampEpochMs = epochMs,
                        partnerName = "You"
                    )
                }
            }
        )
    }

    // Locked Letter Status Dialog (when sealed)
    activeLockedLetterStatus?.let { letter ->
        LockedLetterStatusDialog(
            letter = letter,
            onDismiss = { activeLockedLetterStatus = null },
            onUnlockSuccess = {
                activeLockedLetterStatus = null
                letter.isUnlocked = true
                letter.openedAtDateText = "Opened Today, " + SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
                val msgIndex = messages.indexOfFirst { it.lockedLetterPayload?.id == letter.id }
                if (msgIndex != -1) {
                    messages[msgIndex] = messages[msgIndex].copy(isUnlocked = true)
                }
                
                // Dispatch notification for met condition
                when (letter.conditionType) {
                    UnlockConditionType.DATE_TIME -> LockedLetterNotificationManager.sendTimeReachedNotification(context, partnerName, letter.id)
                    UnlockConditionType.AFTER_ACTION -> LockedLetterNotificationManager.sendActionMetNotification(context, partnerName, letter.targetActionType.label)
                    UnlockConditionType.LOCATION -> LockedLetterNotificationManager.sendLocationReachedNotification(context, letter.locationName)
                }

                activeOpenLockedLetter = letter
            }
        )
    }

    // Open Locked Letter Modal (unsealed celebration animation & letter view)
    activeOpenLockedLetter?.let { letter ->
        OpenLockedLetterModal(
            letter = letter,
            onDismiss = { activeOpenLockedLetter = null },
            onReply = { quoteText ->
                activeOpenLockedLetter = null
                inputMessageText = "Re: \"${quoteText.take(40)}...\" "
            }
        )
    }

    // We Need to Talk Mode Dialog
    if (showWeNeedToTalkDialog) {
        WeNeedToTalkDialog(
            partnerName = partnerName,
            onDismiss = { showWeNeedToTalkDialog = false },
            onActivateGentleMode = {
                isGentleModeActive = true
            }
        )
    }

    // Message Long-Press Micro-Interaction Options Dialog
    messageForOptions?.let { targetMsg ->
        Dialog(onDismissRequest = { messageForOptions = null }) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(24.dp))
                    .background(colors.surface)
                    .padding(20.dp)
                    .widthIn(min = 280.dp, max = 340.dp)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    // Floating Reaction Bar
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .background(colors.surfaceVariant.copy(alpha = 0.5f))
                            .padding(horizontal = 8.dp, vertical = 6.dp),
                        horizontalArrangement = Arrangement.SpaceEvenly,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        listOf("❤️", "😘", "🤗", "😂", "🔥", "🥺").forEach { emoji ->
                            Text(
                                text = emoji,
                                fontSize = 24.sp,
                                modifier = Modifier
                                    .clip(CircleShape)
                                    .clickable {
                                        TwoBeHaptics.lightTap(view)
                                        val idx = messages.indexOfFirst { it.id == targetMsg.id }
                                        if (idx != -1) {
                                            val current = messages[idx].reactionEmoji
                                            messages[idx] = messages[idx].copy(reactionEmoji = if (current == emoji) null else emoji)
                                        }
                                        messageForOptions = null
                                    }
                                    .padding(4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Action 1: Reply
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .clickable {
                                TwoBeHaptics.lightTap(view)
                                replyingToMessage = targetMsg
                                messageForOptions = null
                            }
                            .padding(vertical = 10.dp, horizontal = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "↩️", fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(text = "Reply", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = colors.textPrimary)
                    }

                    // Action 2: Copy (if text is not empty)
                    if (targetMsg.text.isNotEmpty()) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .clickable {
                                    TwoBeHaptics.lightTap(view)
                                    clipboardManager.setText(AnnotatedString(targetMsg.text))
                                    messageForOptions = null
                                }
                                .padding(vertical = 10.dp, horizontal = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = "📋", fontSize = 16.sp)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(text = "Copy text", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = colors.textPrimary)
                        }
                    }

                    // Action 3: Save to Memories
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .clickable {
                                TwoBeHaptics.milestoneBurst(view)
                                TwoBeSoundManager.playMilestoneReached()
                                messageForOptions = null
                            }
                            .padding(vertical = 10.dp, horizontal = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "⭐", fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(text = "Save to Memories", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = colors.primary)
                    }

                    // Action 4: Delete / Unsend (if message is from me)
                    if (targetMsg.senderIsMe) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .clickable {
                                    TwoBeHaptics.warningError(view)
                                    messages.removeIf { it.id == targetMsg.id }
                                    messageForOptions = null
                                }
                                .padding(vertical = 10.dp, horizontal = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = "🗑️", fontSize = 16.sp)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(text = "Delete message", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = colors.error)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    TwoBeButton(
                        text = "Cancel",
                        onClick = { messageForOptions = null },
                        variant = ButtonVariant.SECONDARY,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
    }
}

@Composable
fun QuickInputPill(
    icon: String,
    label: String,
    onClick: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val view = LocalView.current

    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(999.dp))
            .background(colors.surfaceVariant)
            .clickable {
                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                onClick()
            }
            .padding(horizontal = 10.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = icon, fontSize = 14.sp)
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = colors.textPrimary
        )
    }
}
