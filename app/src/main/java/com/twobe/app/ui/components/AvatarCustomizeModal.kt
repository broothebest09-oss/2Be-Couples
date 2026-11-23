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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.twobe.app.ui.screens.*
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing

enum class CustomizeTab(val title: String, val emoji: String) {
    BODY("Body", "🧍"),
    FACE("Face", "✨"),
    CLOTHES("Clothes", "👚"),
    ACCESSORIES("Accessories", "👒")
}

@Composable
fun AvatarCustomizeModal(
    initialConfig: AvatarConfig,
    onDismiss: () -> Unit,
    onSaveConfig: (AvatarConfig) -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    // Live mutable copy of configuration
    var liveConfig by remember { mutableStateOf(initialConfig) }
    var activeTab by remember { mutableStateOf(CustomizeTab.BODY) }

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
                // ==========================================
                // TOP BAR: Cancel, Title, Save Button
                // ==========================================
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = spacing.medium, vertical = spacing.small),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(
                        onClick = onDismiss,
                        modifier = Modifier.height(44.dp)
                    ) {
                        Text(
                            text = "Cancel",
                            fontSize = 14.sp,
                            color = colors.textSecondary
                        )
                    }

                    Text(
                        text = "Customize Avatar",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )

                    Button(
                        onClick = {
                            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                            onSaveConfig(liveConfig)
                        },
                        shape = RoundedCornerShape(24.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = colors.accent),
                        modifier = Modifier.height(40.dp)
                    ) {
                        Text(
                            text = "Save",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }

                // ==========================================
                // TOP HALF: LIVE 3D PREVIEW (200px)
                // ==========================================
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(220.dp)
                        .background(colors.surfaceVariant.copy(alpha = 0.5f)),
                    contentAlignment = Alignment.Center
                ) {
                    LivingAvatar3DView(
                        config = liveConfig,
                        state = AvatarState.HAPPY,
                        size = 200.dp,
                        showStateBadge = false
                    )
                }

                // ==========================================
                // MIDDLE: CATEGORY TABS (Body, Face, Clothes, Accessories)
                // ==========================================
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = spacing.medium, vertical = spacing.small)
                        .clip(RoundedCornerShape(999.dp))
                        .background(colors.surfaceVariant)
                        .padding(3.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    CustomizeTab.values().forEach { tab ->
                        val isSelected = activeTab == tab
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(38.dp)
                                .clip(RoundedCornerShape(999.dp))
                                .background(if (isSelected) colors.primary else Color.Transparent)
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    activeTab = tab
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Text(text = tab.emoji, fontSize = 13.sp)
                                Text(
                                    text = tab.title,
                                    fontSize = 12.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                    color = if (isSelected) Color.White else colors.textSecondary
                                )
                            }
                        }
                    }
                }

                Divider(color = colors.surfaceVariant, thickness = 1.dp)

                // ==========================================
                // BOTTOM HALF: CUSTOMIZATION OPTIONS
                // ==========================================
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .padding(horizontal = spacing.medium)
                ) {
                    when (activeTab) {
                        // 1. BODY TAB
                        CustomizeTab.BODY -> {
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .verticalScroll(rememberScrollState())
                                    .padding(vertical = spacing.medium),
                                verticalArrangement = Arrangement.spacedBy(spacing.medium)
                            ) {
                                // Skin Tone Picker (6 options)
                                Text(
                                    text = "Skin Tone",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    AvatarDesignCatalog.skinTones.forEach { tone ->
                                        val isSelected = liveConfig.skinToneId == tone.id
                                        Box(
                                            modifier = Modifier
                                                .size(46.dp)
                                                .clip(CircleShape)
                                                .background(tone.color)
                                                .border(
                                                    width = if (isSelected) 3.dp else 1.dp,
                                                    color = if (isSelected) colors.accent else Color.White.copy(alpha = 0.6f),
                                                    shape = CircleShape
                                                )
                                                .clickable {
                                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                    liveConfig = liveConfig.copy(skinToneId = tone.id)
                                                },
                                            contentAlignment = Alignment.Center
                                        ) {
                                            if (isSelected) {
                                                Text(
                                                    text = "✓",
                                                    fontSize = 16.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = if (tone.id == "skin_fair" || tone.id == "skin_peach") Color.Black else Color.White
                                                )
                                            }
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(spacing.small))

                                // Body Type (Slim / Average / Athletic)
                                Text(
                                    text = "Body Type",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    BodyType.values().forEach { bType ->
                                        val isSelected = liveConfig.bodyType == bType
                                        Box(
                                            modifier = Modifier
                                                .weight(1f)
                                                .height(54.dp)
                                                .clip(RoundedCornerShape(14.dp))
                                                .background(if (isSelected) colors.primary.copy(alpha = 0.15f) else colors.surfaceVariant)
                                                .border(
                                                    width = if (isSelected) 2.dp else 0.5.dp,
                                                    color = if (isSelected) colors.primary else Color.Transparent,
                                                    shape = RoundedCornerShape(14.dp)
                                                )
                                                .clickable {
                                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                    liveConfig = liveConfig.copy(bodyType = bType)
                                                },
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                                Text(text = bType.emoji, fontSize = 18.sp)
                                                Text(
                                                    text = bType.label,
                                                    fontSize = 11.sp,
                                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                                    color = if (isSelected) colors.primary else colors.textPrimary
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // 2. FACE TAB
                        CustomizeTab.FACE -> {
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .verticalScroll(rememberScrollState())
                                    .padding(vertical = spacing.medium),
                                verticalArrangement = Arrangement.spacedBy(spacing.medium)
                            ) {
                                // Hair Style (8 options)
                                Text(
                                    text = "Hair Style (8 options)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    AvatarDesignCatalog.hairStyles.take(4).forEach { hStyle ->
                                        HairStyleChip(
                                            hStyle = hStyle,
                                            isSelected = liveConfig.hairStyleId == hStyle.id,
                                            onClick = {
                                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                liveConfig = liveConfig.copy(hairStyleId = hStyle.id)
                                            },
                                            modifier = Modifier.weight(1f)
                                        )
                                    }
                                }
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    AvatarDesignCatalog.hairStyles.drop(4).forEach { hStyle ->
                                        HairStyleChip(
                                            hStyle = hStyle,
                                            isSelected = liveConfig.hairStyleId == hStyle.id,
                                            onClick = {
                                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                liveConfig = liveConfig.copy(hairStyleId = hStyle.id)
                                            },
                                            modifier = Modifier.weight(1f)
                                        )
                                    }
                                }

                                // Hair Color (6 options)
                                Text(
                                    text = "Hair Color (6 options)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    AvatarDesignCatalog.hairColors.forEach { hColor ->
                                        val isSelected = liveConfig.hairColorId == hColor.id
                                        Box(
                                            modifier = Modifier
                                                .size(44.dp)
                                                .clip(CircleShape)
                                                .background(hColor.color)
                                                .border(
                                                    width = if (isSelected) 3.dp else 1.dp,
                                                    color = if (isSelected) colors.accent else Color.White,
                                                    shape = CircleShape
                                                )
                                                .clickable {
                                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                    liveConfig = liveConfig.copy(hairColorId = hColor.id)
                                                },
                                            contentAlignment = Alignment.Center
                                        ) {
                                            if (isSelected) {
                                                Text(text = "✓", fontSize = 14.sp, color = Color.White, fontWeight = FontWeight.Bold)
                                            }
                                        }
                                    }
                                }

                                // Eye Color (6 options)
                                Text(
                                    text = "Eye Color (6 options)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    AvatarDesignCatalog.eyeColors.forEach { eColor ->
                                        val isSelected = liveConfig.eyeColorId == eColor.id
                                        Box(
                                            modifier = Modifier
                                                .size(44.dp)
                                                .clip(CircleShape)
                                                .background(eColor.color)
                                                .border(
                                                    width = if (isSelected) 3.dp else 1.dp,
                                                    color = if (isSelected) colors.accent else Color.White,
                                                    shape = CircleShape
                                                )
                                                .clickable {
                                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                    liveConfig = liveConfig.copy(eyeColorId = eColor.id)
                                                },
                                            contentAlignment = Alignment.Center
                                        ) {
                                            if (isSelected) {
                                                Text(text = "✓", fontSize = 14.sp, color = Color.White, fontWeight = FontWeight.Bold)
                                            }
                                        }
                                    }
                                }

                                // Expression (happy / neutral / sad / surprised)
                                Text(
                                    text = "Expression (4 options)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    FacialExpression.values().forEach { expr ->
                                        val isSelected = liveConfig.expression == expr
                                        Box(
                                            modifier = Modifier
                                                .weight(1f)
                                                .height(52.dp)
                                                .clip(RoundedCornerShape(14.dp))
                                                .background(if (isSelected) colors.primary.copy(alpha = 0.15f) else colors.surfaceVariant)
                                                .border(
                                                    width = if (isSelected) 2.dp else 0.5.dp,
                                                    color = if (isSelected) colors.primary else Color.Transparent,
                                                    shape = RoundedCornerShape(14.dp)
                                                )
                                                .clickable {
                                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                    liveConfig = liveConfig.copy(expression = expr)
                                                },
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                                Text(text = expr.emoji, fontSize = 18.sp)
                                                Text(
                                                    text = expr.label,
                                                    fontSize = 10.sp,
                                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                                    color = if (isSelected) colors.primary else colors.textPrimary
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // 3. CLOTHES TAB
                        CustomizeTab.CLOTHES -> {
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .verticalScroll(rememberScrollState())
                                    .padding(vertical = spacing.medium),
                                verticalArrangement = Arrangement.spacedBy(spacing.medium)
                            ) {
                                // Shirts (10 options)
                                Text(
                                    text = "Shirts & Tops (10 options)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                LazyVerticalGrid(
                                    columns = GridCells.Fixed(2),
                                    modifier = Modifier.height(180.dp),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(AvatarDesignCatalog.shirts) { item ->
                                        ClothingOptionCard(
                                            item = item,
                                            isSelected = liveConfig.shirtId == item.id,
                                            onClick = {
                                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                liveConfig = liveConfig.copy(shirtId = item.id)
                                            }
                                        )
                                    }
                                }

                                // Pants (8 options)
                                Text(
                                    text = "Pants & Bottoms (8 options)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                LazyVerticalGrid(
                                    columns = GridCells.Fixed(2),
                                    modifier = Modifier.height(150.dp),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(AvatarDesignCatalog.pants) { item ->
                                        ClothingOptionCard(
                                            item = item,
                                            isSelected = liveConfig.pantsId == item.id,
                                            onClick = {
                                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                liveConfig = liveConfig.copy(pantsId = item.id)
                                            }
                                        )
                                    }
                                }

                                // Shoes (6 options)
                                Text(
                                    text = "Shoes (6 options)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                LazyVerticalGrid(
                                    columns = GridCells.Fixed(2),
                                    modifier = Modifier.height(120.dp),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(AvatarDesignCatalog.shoes) { item ->
                                        ClothingOptionCard(
                                            item = item,
                                            isSelected = liveConfig.shoesId == item.id,
                                            onClick = {
                                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                liveConfig = liveConfig.copy(shoesId = item.id)
                                            }
                                        )
                                    }
                                }
                            }
                        }

                        // 4. ACCESSORIES TAB
                        CustomizeTab.ACCESSORIES -> {
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .verticalScroll(rememberScrollState())
                                    .padding(vertical = spacing.medium),
                                verticalArrangement = Arrangement.spacedBy(spacing.medium)
                            ) {
                                // Hats (6 options)
                                Text(
                                    text = "Hats & Headwear (6 options)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                LazyVerticalGrid(
                                    columns = GridCells.Fixed(2),
                                    modifier = Modifier.height(130.dp),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(AvatarDesignCatalog.hats) { item ->
                                        AccessoryCard(
                                            item = item,
                                            isSelected = liveConfig.hatId == item.id,
                                            onClick = {
                                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                liveConfig = liveConfig.copy(hatId = item.id)
                                            }
                                        )
                                    }
                                }

                                // Glasses (4 options)
                                Text(
                                    text = "Glasses & Eyewear (4 options)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                LazyVerticalGrid(
                                    columns = GridCells.Fixed(2),
                                    modifier = Modifier.height(90.dp),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(AvatarDesignCatalog.glasses) { item ->
                                        AccessoryCard(
                                            item = item,
                                            isSelected = liveConfig.glassesId == item.id,
                                            onClick = {
                                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                liveConfig = liveConfig.copy(glassesId = item.id)
                                            }
                                        )
                                    }
                                }

                                // Jewelry (5 options)
                                Text(
                                    text = "Jewelry (5 options)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                LazyVerticalGrid(
                                    columns = GridCells.Fixed(2),
                                    modifier = Modifier.height(110.dp),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(AvatarDesignCatalog.jewelry) { item ->
                                        AccessoryCard(
                                            item = item,
                                            isSelected = liveConfig.jewelryId == item.id,
                                            onClick = {
                                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                liveConfig = liveConfig.copy(jewelryId = item.id)
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun HairStyleChip(
    hStyle: HairStyleOption,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalTwoBeColors.current
    Box(
        modifier = modifier
            .height(56.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(if (isSelected) colors.primary.copy(alpha = 0.18f) else colors.surfaceVariant)
            .border(
                width = if (isSelected) 2.dp else 0.5.dp,
                color = if (isSelected) colors.primary else Color.Transparent,
                shape = RoundedCornerShape(12.dp)
            )
            .clickable(onClick = onClick)
            .padding(4.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = hStyle.emoji, fontSize = 18.sp)
            Text(
                text = hStyle.name,
                fontSize = 9.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                color = colors.textPrimary,
                maxLines = 1,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
private fun ClothingOptionCard(
    item: ClothingItem,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val colors = LocalTwoBeColors.current
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(50.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(if (isSelected) colors.primary.copy(alpha = 0.15f) else colors.surfaceVariant)
            .border(
                width = if (isSelected) 1.5.dp else 0.5.dp,
                color = if (isSelected) colors.primary else Color.Transparent,
                shape = RoundedCornerShape(12.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp, vertical = 6.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(text = item.emoji, fontSize = 20.sp)
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = item.name,
                    fontSize = 11.sp,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                    color = colors.textPrimary,
                    maxLines = 1
                )
            }
            if (isSelected) {
                Text(text = "✓", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = colors.primary)
            }
        }
    }
}

@Composable
private fun AccessoryCard(
    item: AccessoryItem,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val colors = LocalTwoBeColors.current
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(48.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(if (isSelected) colors.primary.copy(alpha = 0.15f) else colors.surfaceVariant)
            .border(
                width = if (isSelected) 1.5.dp else 0.5.dp,
                color = if (isSelected) colors.primary else Color.Transparent,
                shape = RoundedCornerShape(12.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp, vertical = 6.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(text = item.emoji, fontSize = 18.sp)
            Text(
                text = item.name,
                fontSize = 11.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = colors.textPrimary,
                maxLines = 1,
                modifier = Modifier.weight(1f)
            )
            if (isSelected) {
                Text(text = "✓", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = colors.primary)
            }
        }
    }
}
