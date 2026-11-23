package com.twobe.app.ui.theme

import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

val CardCornerRadius = 16.dp
val ButtonCornerRadius = 24.dp
val PillCornerRadius = 999.dp

val CardShape = RoundedCornerShape(CardCornerRadius)
val ButtonShape = RoundedCornerShape(ButtonCornerRadius)
val AvatarShape = CircleShape

val TwoBeShapes = Shapes(
    small = RoundedCornerShape(12.dp),
    medium = CardShape,
    large = ButtonShape,
    extraLarge = CircleShape
)
