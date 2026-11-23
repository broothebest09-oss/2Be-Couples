package com.twobe.app.ui.onboarding.screens

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.data.PRESET_AVATARS
import com.twobe.app.ui.components.ButtonVariant
import com.twobe.app.ui.components.TwoBeButton
import com.twobe.app.ui.components.TwoBeCard
import com.twobe.app.ui.theme.TwoBeTheme

@Composable
fun CreateProfileScreen(
    initialDisplayName: String = "",
    initialPartnerNickname: String = "",
    initialAvatarId: String = "1",
    onContinue: (name: String, partnerNickname: String, avatarId: String) -> Unit,
    onBack: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    var displayName by remember { mutableStateOf(initialDisplayName) }
    var partnerNickname by remember { mutableStateOf(initialPartnerNickname) }
    var selectedAvatarId by remember { mutableStateOf(initialAvatarId) }
    var nameError by remember { mutableStateOf<String?>(null) }

    fun validateAndContinue() {
        val trimmed = displayName.trim()
        if (trimmed.length < 2 || trimmed.length > 20) {
            nameError = "Display name must be between 2 and 20 characters"
            return
        }
        nameError = null
        onContinue(trimmed, partnerNickname.trim(), selectedAvatarId)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
            .verticalScroll(rememberScrollState())
            .padding(spacing.large)
    ) {
        // Back Button
        Box(
            modifier = Modifier
                .size(spacing.minTouchTarget)
                .clip(CircleShape)
                .clickable {
                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                    onBack()
                },
            contentAlignment = Alignment.Center
        ) {
            Text(text = "←", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = colors.textPrimary)
        }

        Spacer(modifier = Modifier.height(spacing.medium))

        Text(
            text = "Create your profile",
            fontSize = 26.sp,
            fontWeight = FontWeight.Bold,
            color = colors.textPrimary
        )

        Text(
            text = "Choose your avatar and how your partner will see you in 2Be.",
            fontSize = 14.sp,
            color = colors.textSecondary,
            modifier = Modifier.padding(top = spacing.xxSmall, bottom = spacing.medium)
        )

        // Avatar Picker Grid (8 preset cute avatars)
        TwoBeCard(modifier = Modifier.fillMaxWidth()) {
            Column {
                Text(
                    text = "CHOOSE YOUR AVATAR",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.accent,
                    letterSpacing = 1.sp
                )

                Spacer(modifier = Modifier.height(spacing.small))

                // 4x2 grid of avatars
                Column(verticalArrangement = Arrangement.spacedBy(spacing.small)) {
                    PRESET_AVATARS.chunked(4).forEach { rowAvatars ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceAround
                        ) {
                            rowAvatars.forEach { avatar ->
                                val isSelected = avatar.id == selectedAvatarId
                                Box(
                                    modifier = Modifier
                                        .size(62.dp)
                                        .shadow(
                                            elevation = if (isSelected) 6.dp else 1.dp,
                                            shape = CircleShape,
                                            spotColor = colors.primary
                                        )
                                        .clip(CircleShape)
                                        .background(
                                            if (isSelected) colors.primary.copy(alpha = 0.35f)
                                            else colors.surfaceVariant
                                        )
                                        .border(
                                            width = if (isSelected) 2.5.dp else 1.dp,
                                            color = if (isSelected) colors.accent else colors.border,
                                            shape = CircleShape
                                        )
                                        .clickable {
                                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                            selectedAvatarId = avatar.id
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(text = avatar.emoji, fontSize = 28.sp)

                                    if (isSelected) {
                                        Box(
                                            modifier = Modifier
                                                .align(Alignment.BottomEnd)
                                                .size(20.dp)
                                                .clip(CircleShape)
                                                .background(colors.accent),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = "✓",
                                                color = Color.White,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold
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

        Spacer(modifier = Modifier.height(spacing.medium))

        // Name Fields
        TwoBeCard(modifier = Modifier.fillMaxWidth()) {
            Column {
                Text(
                    text = "Display Name (Required)",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )

                OutlinedTextField(
                    value = displayName,
                    onValueChange = {
                        displayName = it
                        nameError = null
                    },
                    placeholder = { Text("e.g. Alex, Honey, Chris") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = spacing.xxSmall),
                    shape = RoundedCornerShape(12.dp),
                    isError = nameError != null,
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = colors.primary,
                        unfocusedBorderColor = colors.border
                    )
                )

                if (nameError != null) {
                    Text(
                        text = nameError!!,
                        fontSize = 12.sp,
                        color = colors.error,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }

                Spacer(modifier = Modifier.height(spacing.medium))

                Text(
                    text = "Nickname for Partner (Optional)",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )

                OutlinedTextField(
                    value = partnerNickname,
                    onValueChange = { partnerNickname = it },
                    placeholder = { Text("e.g. My Love, Sweetheart") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = spacing.xxSmall),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = colors.primary,
                        unfocusedBorderColor = colors.border
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(spacing.large))

        TwoBeButton(
            text = "Continue",
            onClick = { validateAndContinue() },
            modifier = Modifier.fillMaxWidth(),
            variant = ButtonVariant.PRIMARY
        )
    }
}
