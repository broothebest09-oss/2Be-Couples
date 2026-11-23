package com.twobe.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.twobe.app.ui.theme.CardShape
import com.twobe.app.ui.theme.TwoBeTheme

/**
 * Romantic elevated card with 16dp rounded corners and soft ambient shadows.
 */
@Composable
fun TwoBeCard(
    modifier: Modifier = Modifier,
    shape: Shape = CardShape,
    elevation: Dp = 4.dp,
    backgroundColor: Color = TwoBeTheme.colors.surface,
    borderColor: Color = TwoBeTheme.colors.border.copy(alpha = 0.5f),
    content: @Composable BoxScope.() -> Unit
) {
    val colors = TwoBeTheme.colors
    Box(
        modifier = modifier
            .shadow(
                elevation = elevation,
                shape = shape,
                ambientColor = colors.accent.copy(alpha = 0.08f),
                spotColor = colors.primary.copy(alpha = 0.15f)
            )
            .clip(shape)
            .background(backgroundColor)
            .border(width = 1.dp, color = borderColor, shape = shape)
            .padding(TwoBeTheme.spacing.small),
        content = content
    )
}
