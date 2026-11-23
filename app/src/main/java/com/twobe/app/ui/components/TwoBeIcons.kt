package com.twobe.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PaintingStyle
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Lucide icon renderer adhering strictly to 24x24 canvas, 2px stroke width, round caps & joins.
 */
@Composable
fun LucideHomeIcon(
    modifier: Modifier = Modifier,
    tint: Color,
    filled: Boolean = false,
    size: Dp = 24.dp
) {
    Canvas(modifier = modifier.size(size)) {
        val strokeWidth = 2.dp.toPx()
        val w = this.size.width
        val h = this.size.height

        // House path (24x24 scale)
        val path = Path().apply {
            // Roof
            moveTo(w * 0.125f, h * 0.5f)
            lineTo(w * 0.5f, h * 0.125f)
            lineTo(w * 0.875f, h * 0.5f)
            // Right wall down
            lineTo(w * 0.875f, h * 0.875f)
            // Bottom floor to door
            lineTo(w * 0.625f, h * 0.875f)
            // Door
            lineTo(w * 0.625f, h * 0.58f)
            lineTo(w * 0.375f, h * 0.58f)
            lineTo(w * 0.375f, h * 0.875f)
            // Left wall
            lineTo(w * 0.125f, h * 0.875f)
            close()
        }

        if (filled) {
            drawPath(path = path, color = tint.copy(alpha = 0.25f), style = Fill)
        }
        drawPath(
            path = path,
            color = tint,
            style = Stroke(
                width = strokeWidth,
                cap = StrokeCap.Round,
                join = StrokeJoin.Round
            )
        )
    }
}

@Composable
fun LucideMessageIcon(
    modifier: Modifier = Modifier,
    tint: Color,
    filled: Boolean = false,
    size: Dp = 24.dp
) {
    Canvas(modifier = modifier.size(size)) {
        val strokeWidth = 2.dp.toPx()
        val w = this.size.width
        val h = this.size.height

        val path = Path().apply {
            moveTo(w * 0.85f, h * 0.65f)
            cubicTo(w * 0.85f, h * 0.76f, w * 0.74f, h * 0.85f, w * 0.60f, h * 0.85f)
            cubicTo(w * 0.53f, h * 0.85f, w * 0.46f, h * 0.83f, w * 0.40f, h * 0.79f)
            lineTo(w * 0.18f, h * 0.85f)
            lineTo(w * 0.24f, h * 0.67f)
            cubicTo(w * 0.18f, h * 0.60f, w * 0.15f, h * 0.52f, w * 0.15f, h * 0.44f)
            cubicTo(w * 0.15f, h * 0.28f, w * 0.35f, h * 0.15f, w * 0.55f, h * 0.15f)
            cubicTo(w * 0.72f, h * 0.15f, w * 0.85f, h * 0.28f, w * 0.85f, h * 0.44f)
            close()
        }

        if (filled) {
            drawPath(path = path, color = tint.copy(alpha = 0.25f), style = Fill)
        }
        drawPath(
            path = path,
            color = tint,
            style = Stroke(
                width = strokeWidth,
                cap = StrokeCap.Round,
                join = StrokeJoin.Round
            )
        )
    }
}

@Composable
fun LucideHeartIcon(
    modifier: Modifier = Modifier,
    tint: Color,
    filled: Boolean = false,
    size: Dp = 24.dp
) {
    Canvas(modifier = modifier.size(size)) {
        val strokeWidth = 2.dp.toPx()
        val w = this.size.width
        val h = this.size.height

        val path = Path().apply {
            moveTo(w * 0.5f, h * 0.85f)
            cubicTo(w * 0.2f, h * 0.68f, w * 0.1f, h * 0.48f, w * 0.1f, h * 0.34f)
            cubicTo(w * 0.1f, h * 0.18f, w * 0.26f, h * 0.12f, w * 0.38f, h * 0.12f)
            cubicTo(w * 0.47f, h * 0.12f, w * 0.50f, h * 0.18f, w * 0.5f, h * 0.22f)
            cubicTo(w * 0.50f, h * 0.18f, w * 0.53f, h * 0.12f, w * 0.62f, h * 0.12f)
            cubicTo(w * 0.74f, h * 0.12f, w * 0.9f, h * 0.18f, w * 0.9f, h * 0.34f)
            cubicTo(w * 0.9f, h * 0.48f, w * 0.8f, h * 0.68f, w * 0.5f, h * 0.85f)
            close()
        }

        if (filled) {
            drawPath(path = path, color = tint, style = Fill)
        } else {
            drawPath(
                path = path,
                color = tint,
                style = Stroke(
                    width = strokeWidth,
                    cap = StrokeCap.Round,
                    join = StrokeJoin.Round
                )
            )
        }
    }
}

@Composable
fun LucideUserIcon(
    modifier: Modifier = Modifier,
    tint: Color,
    filled: Boolean = false,
    size: Dp = 24.dp
) {
    Canvas(modifier = modifier.size(size)) {
        val strokeWidth = 2.dp.toPx()
        val w = this.size.width
        val h = this.size.height

        // Head
        val headRadius = w * 0.20f
        val headCenter = Offset(w * 0.5f, h * 0.32f)

        if (filled) {
            drawCircle(color = tint.copy(alpha = 0.25f), radius = headRadius, center = headCenter)
        }
        drawCircle(
            color = tint,
            radius = headRadius,
            center = headCenter,
            style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
        )

        // Body arc
        val bodyPath = Path().apply {
            moveTo(w * 0.15f, h * 0.85f)
            cubicTo(w * 0.15f, h * 0.65f, w * 0.32f, h * 0.60f, w * 0.5f, h * 0.60f)
            cubicTo(w * 0.68f, h * 0.60f, w * 0.85f, h * 0.65f, w * 0.85f, h * 0.85f)
        }

        drawPath(
            path = bodyPath,
            color = tint,
            style = Stroke(
                width = strokeWidth,
                cap = StrokeCap.Round,
                join = StrokeJoin.Round
            )
        )
    }
}

@Composable
fun LucideSettingsIcon(
    modifier: Modifier = Modifier,
    tint: Color,
    size: Dp = 24.dp
) {
    Canvas(modifier = modifier.size(size)) {
        val strokeWidth = 2.dp.toPx()
        val w = this.size.width
        val h = this.size.height

        // Inner circle
        drawCircle(
            color = tint,
            radius = w * 0.15f,
            center = Offset(w * 0.5f, h * 0.5f),
            style = Stroke(width = strokeWidth)
        )

        // Outer gear points
        val numTeeth = 6
        for (i in 0 until numTeeth) {
            val angle = (i * 360f / numTeeth) * (Math.PI / 180f)
            val rInner = w * 0.30f
            val rOuter = w * 0.44f
            val x1 = (w * 0.5f + rInner * Math.cos(angle)).toFloat()
            val y1 = (h * 0.5f + rInner * Math.sin(angle)).toFloat()
            val x2 = (w * 0.5f + rOuter * Math.cos(angle)).toFloat()
            val y2 = (h * 0.5f + rOuter * Math.sin(angle)).toFloat()

            drawLine(
                color = tint,
                start = Offset(x1, y1),
                end = Offset(x2, y2),
                strokeWidth = strokeWidth * 1.5f,
                cap = StrokeCap.Round
            )
        }
    }
}

@Composable
fun LucideFingerprintIcon(
    modifier: Modifier = Modifier,
    tint: Color,
    size: Dp = 24.dp
) {
    Canvas(modifier = modifier.size(size)) {
        val strokeWidth = 2.dp.toPx()
        val w = this.size.width
        val h = this.size.height

        // Concentric soft fingerprint loops
        drawArc(
            color = tint,
            startAngle = 180f,
            sweepAngle = 180f,
            useCenter = false,
            topLeft = Offset(w * 0.35f, h * 0.25f),
            size = androidx.compose.ui.geometry.Size(w * 0.3f, h * 0.4f),
            style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
        )
        drawArc(
            color = tint,
            startAngle = 180f,
            sweepAngle = 180f,
            useCenter = false,
            topLeft = Offset(w * 0.22f, h * 0.15f),
            size = androidx.compose.ui.geometry.Size(w * 0.56f, h * 0.65f),
            style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
        )
        drawLine(
            color = tint,
            start = Offset(w * 0.5f, h * 0.45f),
            end = Offset(w * 0.5f, h * 0.85f),
            strokeWidth = strokeWidth,
            cap = StrokeCap.Round
        )
    }
}
