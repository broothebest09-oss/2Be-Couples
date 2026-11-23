package com.twobe.app.ui.screens

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
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
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.AffectionSyncOverlay
import com.twobe.app.ui.components.AffectionType
import com.twobe.app.ui.components.HoldAffectionType
import com.twobe.app.ui.components.KissHugHoldOverlay
import com.twobe.app.ui.components.ButtonVariant
import com.twobe.app.ui.components.LucideHeartIcon
import com.twobe.app.ui.components.LucideSettingsIcon
import com.twobe.app.ui.components.TwoBeButton
import com.twobe.app.ui.components.TwoBeCard
import com.twobe.app.ui.components.PullToRefreshHeartIndicator
import com.twobe.app.ui.components.shimmerBackground
import com.twobe.app.ui.components.shimmerBrush
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import com.twobe.app.ui.theme.TwoBeTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun HomeScreen(
    partnerName: String = "Sarah",
    userAvatarEmoji: String = "🐰",
    partnerAvatarEmoji: String = "🌸",
    streakDays: Int = 15,
    onNavigateToAvatar: () -> Unit = {},
    onNavigateToChat: (openCamera: Boolean) -> Unit = {},
    onOpenSettings: () -> Unit = {}
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current
    val scope = rememberCoroutineScope()

    // Screen State Management
    var screenState by remember { mutableStateOf(HomeLoadingState.SUCCESS) }
    var isRefreshing by remember { mutableStateOf(false) }
    var activeAffection by remember { mutableStateOf<AffectionType?>(null) }
    var activeHoldAffection by remember { mutableStateOf<HoldAffectionType?>(null) }
    var selectedUpcomingDetail by remember { mutableStateOf<UpcomingEvent?>(null) }

    // Partner presence state
    var partnerPresence by remember { mutableStateOf(PartnerPresence.ONLINE) }
    var partnerCustomStatus by remember { mutableStateOf("Thinking of you 💭") }

    // Daily Prompt state
    var dailyPromptText by remember { mutableStateOf("What's one thing you appreciate about them today?") }
    var promptInput by remember { mutableStateOf("") }
    var isPromptSaved by remember { mutableStateOf(false) }
    var isPromptSkipped by remember { mutableStateOf(false) }
    var shareWithPartner by remember { mutableStateOf(true) }

    // Upcoming Events List
    val upcomingEvents = remember {
        mutableStateListOf(
            UpcomingEvent(
                id = "1",
                title = "Letter from $partnerName",
                subtitle = "Opens in 2 days 🔒",
                countdownDays = 2,
                iconEmoji = "💌",
                isLockedLetter = true,
                dateText = "Nov 25"
            ),
            UpcomingEvent(
                id = "2",
                title = "100 Days Together Milestone",
                subtitle = "Only 5 days left 🎉",
                countdownDays = 5,
                iconEmoji = "🥂",
                dateText = "Nov 28"
            ),
            UpcomingEvent(
                id = "3",
                title = "Our Anniversary",
                subtitle = "In 12 days ❤️",
                countdownDays = 12,
                iconEmoji = "💍",
                dateText = "Dec 5"
            )
        )
    }

    val todayDateString = remember {
        val formatter = SimpleDateFormat("EEEE, MMM d", Locale.getDefault())
        formatter.format(Date())
    }

    // LIVING ANIMATIONS
    // 1. Gentle bobbing animation for avatars
    val bobbingTransition = rememberInfiniteTransition(label = "bobbing")
    val bobOffsetUser by bobbingTransition.animateFloat(
        initialValue = -3f,
        targetValue = 3f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "userBob"
    )
    val bobOffsetPartner by bobbingTransition.animateFloat(
        initialValue = 3f,
        targetValue = -3f,
        animationSpec = infiniteRepeatable(
            animation = tween(2400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "partnerBob"
    )

    // 2. Pulsing streak flame animation
    val pulseTransition = rememberInfiniteTransition(label = "streakPulse")
    val streakPulse by pulseTransition.animateFloat(
        initialValue = 1.0f,
        targetValue = 1.14f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "flamePulse"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        colors.gradientStart,
                        colors.background.copy(alpha = 0.98f),
                        colors.gradientEnd
                    )
                )
            )
    ) {
        when (screenState) {
            HomeLoadingState.LOADING -> {
                HomeScreenSkeleton()
            }

            HomeLoadingState.EMPTY -> {
                HomeScreenEmpty(onPairClick = onNavigateToAvatar)
            }

            HomeLoadingState.ERROR -> {
                HomeScreenError(onRetry = { screenState = HomeLoadingState.SUCCESS })
            }

            HomeLoadingState.OFFLINE, HomeLoadingState.SUCCESS -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(horizontal = spacing.medium, vertical = spacing.small)
                ) {
                    // Custom Heart Pulse Pull-to-Refresh Indicator
                    PullToRefreshHeartIndicator(isRefreshing = isRefreshing)

                    // Offline banner if in offline state
                    if (screenState == HomeLoadingState.OFFLINE) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(colors.accent)
                                .padding(horizontal = spacing.medium, vertical = spacing.xxSmall)
                        ) {
                            Text(
                                text = "⚡ Offline Mode • Showing cached memories",
                                color = Color.White,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                        Spacer(modifier = Modifier.height(spacing.small))
                    }

                    // ==========================================
                    // REGION 1 - HEADER
                    // ==========================================
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = spacing.small),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        // Your Avatar (48px circle, left)
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .scale(1f + (bobOffsetUser / 80f))
                                .shadow(
                                    elevation = 6.dp,
                                    shape = CircleShape,
                                    spotColor = colors.primary
                                )
                                .clip(CircleShape)
                                .background(
                                    Brush.linearGradient(
                                        listOf(colors.primary.copy(alpha = 0.35f), colors.primary)
                                    )
                                )
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    onNavigateToAvatar()
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = userAvatarEmoji, fontSize = 24.sp)
                        }

                        // Center: Streak counter with fire emoji & Today's date
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Row(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(999.dp))
                                    .background(colors.surface)
                                    .border(1.dp, colors.border, RoundedCornerShape(999.dp))
                                    .padding(horizontal = spacing.small, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "🔥",
                                    fontSize = 16.sp,
                                    modifier = Modifier.scale(streakPulse)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "$streakDays days",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.accent
                                )
                            }

                            Text(
                                text = todayDateString,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = colors.textSecondary,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }

                        // Partner's Avatar (48px circle, right)
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .scale(1f + (bobOffsetPartner / 80f))
                                .shadow(
                                    elevation = 6.dp,
                                    shape = CircleShape,
                                    spotColor = colors.accent
                                )
                                .clip(CircleShape)
                                .background(
                                    Brush.linearGradient(
                                        listOf(colors.accent.copy(alpha = 0.25f), colors.accent)
                                    )
                                )
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    onNavigateToAvatar()
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = partnerAvatarEmoji, fontSize = 24.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(spacing.medium))

                    // ==========================================
                    // REGION 2 - PARTNER STATUS
                    // ==========================================
                    TwoBeCard(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onNavigateToAvatar()
                            },
                        elevation = 6.dp
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            // Avatar (64px circle)
                            Box(
                                modifier = Modifier
                                    .size(64.dp)
                                    .clip(CircleShape)
                                    .background(colors.primary.copy(alpha = 0.25f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = partnerAvatarEmoji, fontSize = 32.sp)

                                // Online status dot
                                if (partnerPresence == PartnerPresence.ONLINE) {
                                    Box(
                                        modifier = Modifier
                                            .align(Alignment.BottomEnd)
                                            .size(14.dp)
                                            .clip(CircleShape)
                                            .background(colors.success)
                                            .border(2.dp, colors.surface, CircleShape)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(spacing.small))

                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = partnerName,
                                        fontSize = 17.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = colors.textPrimary
                                    )

                                    Text(
                                        text = partnerPresence.label,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = if (partnerPresence == PartnerPresence.ONLINE) colors.success else colors.textSecondary
                                    )
                                }

                                Text(
                                    text = partnerCustomStatus,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = colors.accent,
                                    modifier = Modifier.padding(top = 2.dp)
                                )

                                Text(
                                    text = "Tap to visit ${partnerName}'s living avatar space",
                                    fontSize = 11.sp,
                                    color = colors.textSecondary,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(spacing.medium))

                    // ==========================================
                    // REGION 3 - DAILY PROMPT
                    // ==========================================
                    val promptShimmerBrush = shimmerBrush(targetValue = 800f, showShimmer = !isPromptSaved)

                    TwoBeCard(
                        modifier = Modifier.fillMaxWidth(),
                        elevation = 4.dp
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "QUESTION OF THE DAY",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.accent,
                                    letterSpacing = 1.sp
                                )

                                if (!isPromptSaved && !isPromptSkipped) {
                                    Text(
                                        text = "${promptInput.length}/500",
                                        fontSize = 11.sp,
                                        color = if (promptInput.length > 450) colors.error else colors.textSecondary
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(spacing.xxSmall))

                            Text(
                                text = "“$dailyPromptText”",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = colors.textPrimary,
                                lineHeight = 24.sp
                            )

                            Spacer(modifier = Modifier.height(spacing.small))

                            if (isPromptSaved) {
                                // Animated Saved confirmation card
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(colors.surfaceVariant)
                                        .padding(spacing.small),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(text = "Saved ✓", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = colors.success)
                                    Spacer(modifier = Modifier.width(spacing.small))
                                    Text(
                                        text = if (shareWithPartner) "Shared to private chat with $partnerName" else "Saved secretly to your private journal",
                                        fontSize = 12.sp,
                                        color = colors.textSecondary
                                    )
                                }
                            } else if (isPromptSkipped) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(colors.surfaceVariant)
                                        .padding(spacing.small),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(text = "Skipped for today", fontSize = 13.sp, color = colors.textSecondary)
                                    Text(
                                        text = "Undo",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = colors.accent,
                                        modifier = Modifier
                                            .clickable { isPromptSkipped = false }
                                            .padding(4.dp)
                                    )
                                }
                            } else {
                                // Multi-line text input (max 500 chars)
                                OutlinedTextField(
                                    value = promptInput,
                                    onValueChange = {
                                        if (it.length <= 500) promptInput = it
                                    },
                                    placeholder = {
                                        Text(
                                            text = "Write your heartfelt answer here...",
                                            fontSize = 13.sp,
                                            color = colors.textSecondary
                                        )
                                    },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(110.dp),
                                    shape = RoundedCornerShape(12.dp),
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedBorderColor = colors.primary,
                                        unfocusedBorderColor = colors.border
                                    )
                                )

                                Spacer(modifier = Modifier.height(spacing.xxSmall))

                                // Private vs Share toggle
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "Share with $partnerName",
                                        fontSize = 12.sp,
                                        color = colors.textSecondary
                                    )
                                    Switch(
                                        checked = shareWithPartner,
                                        onCheckedChange = { shareWithPartner = it },
                                        colors = SwitchDefaults.colors(
                                            checkedThumbColor = Color.White,
                                            checkedTrackColor = colors.accent
                                        )
                                    )
                                }

                                Spacer(modifier = Modifier.height(spacing.small))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    TwoBeButton(
                                        text = "Save",
                                        onClick = {
                                            if (promptInput.isNotBlank()) {
                                                view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                                isPromptSaved = true
                                            }
                                        },
                                        enabled = promptInput.isNotBlank(),
                                        variant = ButtonVariant.PRIMARY
                                    )

                                    Text(
                                        text = "Skip for today",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = colors.textSecondary,
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(6.dp))
                                            .clickable {
                                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                isPromptSkipped = true
                                            }
                                            .padding(horizontal = 8.dp, vertical = 6.dp)
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(spacing.large))

                    // ==========================================
                    // REGION 4 - QUICK ACTIONS (Three 80px circles)
                    // ==========================================
                    Text(
                        text = "QUICK AFFECTION",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.accent,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(spacing.small))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Button 1: Send Kiss 💋 (pink gradient)
                        TactileCircleActionButton(
                            label = "Send Kiss 💋",
                            emoji = "💋",
                            gradient = listOf(Color(0xFFFF9EB5), Color(0xFFE85D88)),
                            onClick = {
                                activeHoldAffection = HoldAffectionType.KISS
                            }
                        )

                        // Button 2: Send Hug 🤗 (purple gradient)
                        TactileCircleActionButton(
                            label = "Send Hug 🤗",
                            emoji = "🤗",
                            gradient = listOf(Color(0xFFD8B4FE), Color(0xFF9333EA)),
                            onClick = {
                                activeHoldAffection = HoldAffectionType.HUG
                            }
                        )

                        // Button 3: Send Snap 📸 (blue gradient)
                        TactileCircleActionButton(
                            label = "Send Snap 📸",
                            emoji = "📸",
                            gradient = listOf(Color(0xFF93C5FD), Color(0xFF2563EB)),
                            onClick = {
                                onNavigateToChat(true)
                            }
                        )
                    }

                    Spacer(modifier = Modifier.height(spacing.large))

                    // ==========================================
                    // REGION 5 - UPCOMING
                    // ==========================================
                    Text(
                        text = "Coming up",
                        fontSize = 19.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )

                    Spacer(modifier = Modifier.height(spacing.small))

                    if (upcomingEvents.isEmpty()) {
                        TwoBeCard(modifier = Modifier.fillMaxWidth()) {
                            Text(
                                text = "Nothing scheduled yet",
                                fontSize = 14.sp,
                                color = colors.textSecondary,
                                textAlign = TextAlign.Center,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = spacing.medium)
                            )
                        }
                    } else {
                        Column(verticalArrangement = Arrangement.spacedBy(spacing.xxSmall)) {
                            upcomingEvents.forEach { event ->
                                TwoBeCard(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                            selectedUpcomingDetail = event
                                        },
                                    elevation = 3.dp
                                ) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            modifier = Modifier.weight(1f)
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .size(44.dp)
                                                    .clip(RoundedCornerShape(12.dp))
                                                    .background(colors.primary.copy(alpha = 0.2f)),
                                                contentAlignment = Alignment.Center
                                            ) {
                                                Text(text = event.iconEmoji, fontSize = 22.sp)
                                            }

                                            Column(modifier = Modifier.padding(start = spacing.small)) {
                                                Text(
                                                    text = event.title,
                                                    fontSize = 15.sp,
                                                    fontWeight = FontWeight.SemiBold,
                                                    color = colors.textPrimary
                                                )
                                                Text(
                                                    text = event.subtitle,
                                                    fontSize = 12.sp,
                                                    color = colors.accent,
                                                    modifier = Modifier.padding(top = 2.dp)
                                                )
                                            }
                                        }

                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(999.dp))
                                                .background(colors.surfaceVariant)
                                                .padding(horizontal = spacing.small, vertical = 4.dp)
                                        ) {
                                            Text(
                                                text = event.dateText,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = colors.textSecondary
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(spacing.huge))
                }
            }
        }

        // Real-Time Kiss / Hug 3-second Interactive Hold Sync Overlay
        if (activeHoldAffection != null) {
            KissHugHoldOverlay(
                type = activeHoldAffection!!,
                partnerName = partnerName,
                isPartnerInApp = true,
                onSuccess = { completedType ->
                    activeHoldAffection = null
                },
                onDismiss = { activeHoldAffection = null }
            )
        }

        // Affection Kiss / Hug Sync Overlay (fallback quick animation)
        AffectionSyncOverlay(
            type = activeAffection,
            onDismiss = { activeAffection = null }
        )

        // Detail dialog for upcoming events
        if (selectedUpcomingDetail != null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.5f))
                    .clickable { selectedUpcomingDetail = null },
                contentAlignment = Alignment.Center
            ) {
                TwoBeCard(
                    modifier = Modifier
                        .fillMaxWidth(0.85f)
                        .clickable(enabled = false) {},
                    elevation = 16.dp
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = selectedUpcomingDetail!!.iconEmoji, fontSize = 48.sp)
                        Text(
                            text = selectedUpcomingDetail!!.title,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary,
                            modifier = Modifier.padding(top = spacing.small)
                        )
                        Text(
                            text = selectedUpcomingDetail!!.subtitle,
                            fontSize = 13.sp,
                            color = colors.accent,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                        Spacer(modifier = Modifier.height(spacing.medium))
                        TwoBeButton(
                            text = "Got it",
                            onClick = { selectedUpcomingDetail = null },
                            variant = ButtonVariant.PRIMARY,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
        }
    }
}

/**
 * 80px Diameter circular button with spring press physics and tactile feedback
 */
@Composable
fun TactileCircleActionButton(
    label: String,
    emoji: String,
    gradient: List<Color>,
    onClick: () -> Unit
) {
    val scale = remember { Animatable(1f) }
    val scope = rememberCoroutineScope()
    val view = LocalView.current
    val colors = TwoBeTheme.colors

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.width(96.dp)
    ) {
        Box(
            modifier = Modifier
                .size(80.dp)
                .scale(scale.value)
                .shadow(
                    elevation = 8.dp,
                    shape = CircleShape,
                    ambientColor = gradient.last().copy(alpha = 0.25f),
                    spotColor = gradient.first().copy(alpha = 0.4f)
                )
                .clip(CircleShape)
                .background(Brush.linearGradient(gradient))
                .pointerInput(Unit) {
                    while (true) {
                        awaitPointerEventScope {
                            awaitFirstDown(requireUnconsumed = false)
                            scope.launch {
                                scale.animateTo(
                                    targetValue = 0.90f,
                                    animationSpec = spring(
                                        dampingRatio = Spring.DampingRatioMediumBouncy,
                                        stiffness = Spring.StiffnessMediumLow
                                    )
                                )
                            }
                            val up = waitForUpOrCancellation()
                            scope.launch {
                                scale.animateTo(
                                    targetValue = 1f,
                                    animationSpec = spring(
                                        dampingRatio = Spring.DampingRatioMediumBouncy,
                                        stiffness = Spring.StiffnessMediumLow
                                    )
                                )
                            }
                            if (up != null) {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onClick()
                            }
                        }
                    }
                },
            contentAlignment = Alignment.Center
        ) {
            Text(text = emoji, fontSize = 34.sp)
        }

        Text(
            text = label,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = colors.textPrimary,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 8.dp)
        )
    }
}

/**
 * Skeleton loading state with shimmering placeholders
 */
@Composable
fun HomeScreenSkeleton() {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(spacing.medium)
    ) {
        // Header Skeleton
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .shimmerBackground()
            )
            Box(
                modifier = Modifier
                    .size(width = 110.dp, height = 36.dp)
                    .clip(RoundedCornerShape(999.dp))
                    .shimmerBackground()
            )
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .shimmerBackground()
            )
        }

        Spacer(modifier = Modifier.height(spacing.medium))

        // Partner status skeleton
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(90.dp)
                .clip(RoundedCornerShape(16.dp))
                .shimmerBackground()
        )

        Spacer(modifier = Modifier.height(spacing.medium))

        // Daily prompt skeleton
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp)
                .clip(RoundedCornerShape(16.dp))
                .shimmerBackground()
        )

        Spacer(modifier = Modifier.height(spacing.large))

        // 3 Action circles skeleton
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround
        ) {
            repeat(3) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(CircleShape)
                        .shimmerBackground()
                )
            }
        }
    }
}

/**
 * Empty state: shown if user is not paired yet
 */
@Composable
fun HomeScreenEmpty(
    onPairClick: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(spacing.large),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(88.dp)
                .clip(CircleShape)
                .background(colors.primary.copy(alpha = 0.2f)),
            contentAlignment = Alignment.Center
        ) {
            LucideHeartIcon(tint = colors.accent, filled = true, size = 44.dp)
        }

        Spacer(modifier = Modifier.height(spacing.medium))

        Text(
            text = "No Partner Paired Yet",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = colors.textPrimary
        )

        Text(
            text = "2Be is a sanctuary for exactly two people. Invite your partner to start your private journey.",
            fontSize = 14.sp,
            color = colors.textSecondary,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = spacing.xxSmall, bottom = spacing.large)
        )

        TwoBeButton(
            text = "Invite Partner",
            onClick = onPairClick,
            variant = ButtonVariant.PRIMARY
        )
    }
}

/**
 * Error state with retry
 */
@Composable
fun HomeScreenError(
    onRetry: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(spacing.large),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "⚠️", fontSize = 48.sp)
        Text(
            text = "Couldn't load today's moments",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = colors.textPrimary,
            modifier = Modifier.padding(top = spacing.small)
        )
        Text(
            text = "Please check your connection and try again.",
            fontSize = 13.sp,
            color = colors.textSecondary,
            modifier = Modifier.padding(top = 4.dp, bottom = spacing.large)
        )
        TwoBeButton(
            text = "Retry",
            onClick = onRetry,
            variant = ButtonVariant.PRIMARY
        )
    }
}
