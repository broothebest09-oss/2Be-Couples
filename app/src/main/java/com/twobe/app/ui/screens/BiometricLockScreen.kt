package com.twobe.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.ButtonVariant
import com.twobe.app.ui.components.LucideFingerprintIcon
import com.twobe.app.ui.components.TwoBeButton
import com.twobe.app.ui.components.TwoBeCard
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import com.twobe.app.ui.theme.TwoBeTheme

@Composable
fun BiometricLockScreen(
    onUnlock: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        colors.gradientStart,
                        colors.background,
                        colors.gradientEnd
                    )
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(spacing.large)
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .shadow(
                        elevation = 12.dp,
                        shape = CircleShape,
                        ambientColor = DeepBerry.copy(alpha = 0.2f),
                        spotColor = SoftRose.copy(alpha = 0.4f)
                    )
                    .clip(CircleShape)
                    .background(colors.primary.copy(alpha = 0.25f)),
                contentAlignment = Alignment.Center
            ) {
                LucideFingerprintIcon(
                    tint = colors.accent,
                    size = 44.dp
                )
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            Text(
                text = "2Be is Locked",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = colors.textPrimary
            )

            Text(
                text = "Biometric privacy protection active",
                fontSize = 14.sp,
                color = colors.textSecondary,
                modifier = Modifier.padding(top = 4.dp, bottom = spacing.large)
            )

            TwoBeButton(
                text = "Unlock with Biometrics",
                onClick = onUnlock,
                variant = ButtonVariant.PRIMARY,
                modifier = Modifier.fillMaxWidth(0.8f)
            )
        }
    }
}
