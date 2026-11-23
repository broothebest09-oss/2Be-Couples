package com.twobe.app.ui.screens

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.*
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing

@Composable
fun AvatarScreen(
    partnerName: String = "Sarah",
    userName: String = "Alex",
    modifier: Modifier = Modifier
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    // Avatar configs
    var myConfig by remember {
        mutableStateOf(
            AvatarConfig(
                skinToneId = "skin_fair",
                bodyType = BodyType.AVERAGE,
                hairStyleId = "hair_bob",
                hairColorId = "color_espresso",
                eyeColorId = "color_brown",
                expression = FacialExpression.HAPPY,
                shirtId = "shirt_knit",
                pantsId = "pants_jeans",
                shoesId = "shoes_sneakers",
                hatId = "hat_catears",
                glassesId = "glasses_none",
                jewelryId = "jewelry_heart"
            )
        )
    }

    val partnerConfig by remember {
        mutableStateOf(
            AvatarConfig(
                skinToneId = "skin_peach",
                bodyType = BodyType.SLIM,
                hairStyleId = "hair_long_curls",
                hairColorId = "color_rose",
                eyeColorId = "eye_blue",
                expression = FacialExpression.HAPPY,
                shirtId = "shirt_hoodie",
                pantsId = "pants_skirt",
                shoesId = "shoes_canvas",
                hatId = "hat_none",
                glassesId = "glasses_round",
                jewelryId = "jewelry_pearl"
            )
        )
    }

    // State Holders
    var myState by remember { mutableStateOf(AvatarState.HAPPY) }
    var partnerState by remember { mutableStateOf(AvatarState.ONLINE) }

    // Nicknames
    var myNicknameForThem by remember { mutableStateOf("My Sunshine ☀️") }
    val theirNicknameForMe by remember { mutableStateOf("Bunny 🐰") }

    // Dialog flags
    var showCustomizeModal by remember { mutableStateOf(false) }
    var showEditNicknameDialog by remember { mutableStateOf(false) }
    var toastMessage by remember { mutableStateOf<String?>(null) }

    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = spacing.medium)
                .padding(top = spacing.small, bottom = 80.dp),
            verticalArrangement = Arrangement.spacedBy(spacing.medium)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Living Avatars",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    Text(
                        text = "Your expressive 3D couple world",
                        fontSize = 12.sp,
                        color = colors.textSecondary
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(999.dp))
                        .background(colors.surfaceVariant)
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = "✨ Real-Time Sync",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.accent
                    )
                }
            }

            // ==========================================
            // REGION 1: YOUR AVATAR (Top Half)
            // ==========================================
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(spacing.medium),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "YOU",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.accent,
                            letterSpacing = 1.sp
                        )

                        // Button: "Customize"
                        OutlinedButton(
                            onClick = {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                showCustomizeModal = true
                            },
                            shape = RoundedCornerShape(20.dp),
                            contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = "Customize 🎨",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.primary
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(spacing.small))

                    // Large 3D Avatar Preview (200px, centered)
                    LivingAvatar3DView(
                        config = myConfig,
                        state = myState,
                        size = 200.dp,
                        showStateBadge = true
                    )

                    Spacer(modifier = Modifier.height(spacing.small))

                    // Below Avatar: Display name + Nickname partner gave you
                    Text(
                        text = userName,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )

                    Text(
                        text = "Called \"$theirNicknameForMe\" by $partnerName",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = colors.primary
                    )

                    Spacer(modifier = Modifier.height(spacing.small))

                    // Quick Mood & State Switcher for You
                    Text(
                        text = "Set your current state:",
                        fontSize = 11.sp,
                        color = colors.textSecondary
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        AvatarState.values().forEach { stateOpt ->
                            val isSelected = myState == stateOpt
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .height(44.dp) // min touch target
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isSelected) colors.primary else colors.surface)
                                    .clickable {
                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                        myState = stateOpt
                                        toastMessage = "Your avatar is now ${stateOpt.title}!"
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(text = stateOpt.emoji, fontSize = 13.sp)
                                    Text(
                                        text = stateOpt.title.take(6),
                                        fontSize = 9.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                        color = if (isSelected) Color.White else colors.textPrimary
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // ==========================================
            // REGION 2: PARTNER'S AVATAR (Bottom Half)
            // ==========================================
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(spacing.medium),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "PARTNER (VIEW ONLY)",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textSecondary,
                            letterSpacing = 1.sp
                        )

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(colors.surface)
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "🔒 Partner Controlled",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = colors.textSecondary
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(spacing.small))

                    // Large 3D Avatar Preview (200px, centered)
                    LivingAvatar3DView(
                        config = partnerConfig,
                        state = partnerState,
                        size = 200.dp,
                        showStateBadge = true
                    )

                    Spacer(modifier = Modifier.height(spacing.small))

                    // Below Avatar: Partner name + Nickname you gave them
                    Text(
                        text = partnerName,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )

                    Text(
                        text = "You call her \"$myNicknameForThem\"",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = colors.accent
                    )

                    Spacer(modifier = Modifier.height(spacing.small))

                    // Interactive State Preview for Partner
                    Text(
                        text = "Simulate partner's current state:",
                        fontSize = 11.sp,
                        color = colors.textSecondary
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        AvatarState.values().forEach { stateOpt ->
                            val isSelected = partnerState == stateOpt
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .height(44.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isSelected) colors.accent else colors.surface)
                                    .clickable {
                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                        partnerState = stateOpt
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(text = stateOpt.emoji, fontSize = 13.sp)
                                    Text(
                                        text = stateOpt.title.take(6),
                                        fontSize = 9.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                        color = if (isSelected) Color.White else colors.textPrimary
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // ==========================================
            // REGION 3: NICKNAMES SECTION
            // ==========================================
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                        showEditNicknameDialog = true
                    },
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
            ) {
                Column(
                    modifier = Modifier.padding(spacing.medium),
                    verticalArrangement = Arrangement.spacedBy(spacing.small)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Couple Nicknames 💌",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )

                        Text(
                            text = "Tap to edit ✏️",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = colors.primary
                        )
                    }

                    // 1. Your nickname for them (editable)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(colors.surface)
                            .padding(horizontal = 14.dp, vertical = 10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Your nickname for $partnerName:",
                                fontSize = 11.sp,
                                color = colors.textSecondary
                            )
                            Text(
                                text = myNicknameForThem,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary
                            )
                        }

                        Text(
                            text = "Editable ✎",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = colors.accent
                        )
                    }

                    // 2. Their nickname for you (view only)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(colors.surface)
                            .padding(horizontal = 14.dp, vertical = 10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Their nickname for you:",
                                fontSize = 11.sp,
                                color = colors.textSecondary
                            )
                            Text(
                                text = theirNicknameForMe,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary
                            )
                        }

                        Text(
                            text = "View only 🔒",
                            fontSize = 11.sp,
                            color = colors.textSecondary
                        )
                    }
                }
            }
        }

        // Toast feedback overlay
        toastMessage?.let { msg ->
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 24.dp, start = 16.dp, end = 16.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(colors.accent)
                    .clickable { toastMessage = null }
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(text = "✨", fontSize = 14.sp)
                    Text(text = msg, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = Color.White)
                }
            }
        }

        // Customization Fullscreen Modal
        if (showCustomizeModal) {
            AvatarCustomizeModal(
                initialConfig = myConfig,
                onDismiss = { showCustomizeModal = false },
                onSaveConfig = { updatedConfig ->
                    myConfig = updatedConfig
                    showCustomizeModal = false
                    toastMessage = "Avatar customizations saved! ✨"
                }
            )
        }

        // Edit Nickname Dialog
        if (showEditNicknameDialog) {
            EditNicknameDialog(
                partnerName = partnerName,
                currentNickname = myNicknameForThem,
                onDismiss = { showEditNicknameDialog = false },
                onSaveNickname = { newNickname ->
                    myNicknameForThem = newNickname
                    showEditNicknameDialog = false
                    toastMessage = "Nickname for $partnerName updated to \"$newNickname\" 💖"
                }
            )
        }
    }
}
