package com.twobe.app.ui.screens

import android.view.HapticFeedbackConstants
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.AddDreamBottomSheet
import com.twobe.app.ui.components.CelebrationEffects
import com.twobe.app.ui.components.CompleteDreamDialog
import com.twobe.app.ui.components.DreamDetailEditDialog
import com.twobe.app.ui.components.TwoBeButton
import com.twobe.app.ui.components.TwoBeCard
import com.twobe.app.ui.theme.TwoBeTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BucketListSection(
    partnerName: String = "Sarah",
    userName: String = "Alex",
    userAvatarEmoji: String = "🐰",
    partnerAvatarEmoji: String = "🌸",
    onMemoryCreated: (MemoryItem) -> Unit = {}
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val context = LocalContext.current
    val view = LocalView.current
    val scope = rememberCoroutineScope()

    // Sample Bucket Items (aspirational couple dreams)
    val items = remember {
        mutableStateListOf(
            BucketItem(
                id = "1",
                text = "Watch the Northern Lights from a cozy glass igloo",
                authorName = partnerName,
                authorAvatarEmoji = partnerAvatarEmoji,
                isCompleted = false,
                dateAdded = "Nov 12",
                category = BucketCategory.TRAVEL,
                targetDate = "Winter 2027"
            ),
            BucketItem(
                id = "2",
                text = "Cook a 5-course homemade pasta dinner together from scratch",
                authorName = userName,
                authorAvatarEmoji = userAvatarEmoji,
                isCompleted = false,
                dateAdded = "Nov 8",
                category = BucketCategory.FOOD
            ),
            BucketItem(
                id = "3",
                text = "Take a sunrise hot air balloon flight over Cappadocia",
                authorName = partnerName,
                authorAvatarEmoji = partnerAvatarEmoji,
                isCompleted = false,
                dateAdded = "Oct 29",
                category = BucketCategory.ADVENTURE
            ),
            BucketItem(
                id = "4",
                text = "Dance together in the pouring rain with no umbrellas",
                authorName = userName,
                authorAvatarEmoji = userAvatarEmoji,
                isCompleted = true,
                dateAdded = "Sep 15",
                dateCompleted = "Nov 4",
                category = BucketCategory.ROMANCE
            ),
            BucketItem(
                id = "5",
                text = "Adopt our first rescue puppy together 🐶",
                authorName = partnerName,
                authorAvatarEmoji = partnerAvatarEmoji,
                isCompleted = true,
                dateAdded = "Aug 20",
                dateCompleted = "Oct 12",
                category = BucketCategory.OTHER
            )
        )
    }

    // Modal & Dialog states
    var showAddDreamSheet by remember { mutableStateOf(false) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    var completingItem by remember { mutableStateOf<BucketItem?>(null) }
    var selectedItemForDetail by remember { mutableStateOf<BucketItem?>(null) }
    var partnerNotificationBanner by remember { mutableStateOf<String?>(null) }
    var showAllCompletedCelebration by remember { mutableStateOf(false) }

    val completedCount = items.count { it.isCompleted }
    val totalCount = items.size
    val progressFraction = if (totalCount > 0) completedCount.toFloat() / totalCount else 0f

    val animatedProgress by animateFloatAsState(
        targetValue = progressFraction,
        animationSpec = spring(stiffness = Spring.StiffnessLow),
        label = "progressBar"
    )

    fun markItemCompleted(item: BucketItem, createMemory: Boolean) {
        val todayStr = SimpleDateFormat("MMM d", Locale.getDefault()).format(Date())
        item.isCompleted = true
        item.dateCompleted = todayStr

        // Optional Memory Creation
        if (createMemory) {
            val memory = MemoryItem(
                type = MemoryType.MILESTONE,
                title = "🎉 Completed: ${item.text}",
                caption = "A shared couple dream fulfilled together!",
                milestoneEmoji = item.category.emoji,
                dateText = SimpleDateFormat("MMM d, yyyy", Locale.getDefault()).format(Date()),
                timestampMillis = System.currentTimeMillis(),
                senderName = userName,
                senderAvatarEmoji = userAvatarEmoji,
                originalContext = "Bucket List Milestone"
            )
            onMemoryCreated(memory)
            Toast.makeText(context, "Memory preserved in Timeline! 📸", Toast.LENGTH_SHORT).show()
        }

        partnerNotificationBanner = "$userName completed '${item.text}'! 🎉"
        Toast.makeText(context, "Dream completed ✓", Toast.LENGTH_SHORT).show()

        scope.launch {
            delay(3500L)
            partnerNotificationBanner = null
        }

        // Check if all dreams are now completed
        if (items.isNotEmpty() && items.all { it.isCompleted }) {
            showAllCompletedCelebration = true
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = spacing.medium, vertical = spacing.small)
    ) {
        // Partner Notification Banner
        AnimatedVisibility(visible = partnerNotificationBanner != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = spacing.small)
                    .clip(RoundedCornerShape(12.dp))
                    .background(colors.accent)
                    .padding(horizontal = spacing.medium, vertical = 8.dp)
            ) {
                Text(
                    text = partnerNotificationBanner ?: "",
                    color = Color.White,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        // ==========================================
        // HEADER: "When We're Together" & Progress Bar
        // ==========================================
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
                    Column {
                        Text(
                            text = "When We're Together",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )

                        Text(
                            text = "$completedCount of $totalCount completed",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = colors.accent,
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }

                    // Button: "Add Dream" (top right)
                    TwoBeButton(
                        text = "+ Add Dream",
                        onClick = {
                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                            showAddDreamSheet = true
                        },
                        minHeight = 38.dp,
                        variant = ButtonVariant.PRIMARY
                    )
                }

                Spacer(modifier = Modifier.height(spacing.medium))

                // Progress Bar (Visual, fills as items completed)
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(10.dp)
                        .clip(RoundedCornerShape(999.dp))
                        .background(colors.surfaceVariant)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(animatedProgress)
                            .height(10.dp)
                            .clip(RoundedCornerShape(999.dp))
                            .background(
                                Brush.horizontalGradient(
                                    listOf(colors.primary, colors.accent)
                                )
                            )
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(spacing.medium))

        // ==========================================
        // LIST (Scrollable): Dreams vs Completed
        // ==========================================
        if (items.isEmpty()) {
            // EMPTY STATE
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(spacing.large),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(text = "🗺️", fontSize = 60.sp)
                Text(
                    text = "Start dreaming together!",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary,
                    modifier = Modifier.padding(top = 12.dp)
                )
                Text(
                    text = "Adventures to take, restaurants to try, and milestones to reach hand in hand.",
                    fontSize = 13.sp,
                    color = colors.textSecondary,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
                )
                TwoBeButton(
                    text = "Add your first dream",
                    onClick = { showAddDreamSheet = true },
                    variant = ButtonVariant.PRIMARY
                )
            }
        } else {
            val incompleteItems = items.filter { !it.isCompleted }
            val completedItems = items.filter { it.isCompleted }

            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Section 1: "Dreams" (Incomplete)
                if (incompleteItems.isNotEmpty()) {
                    item {
                        Text(
                            text = "DREAMS (${incompleteItems.size})",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.accent,
                            letterSpacing = 1.sp,
                            modifier = Modifier.padding(vertical = 4.dp, horizontal = 2.dp)
                        )
                    }

                    items(incompleteItems, key = { it.id }) { item ->
                        BucketCardItem(
                            item = item,
                            onToggleComplete = {
                                completingItem = item
                            },
                            onItemClick = {
                                selectedItemForDetail = item
                            }
                        )
                    }
                }

                // Section 2: "Completed"
                if (completedItems.isNotEmpty()) {
                    item {
                        Text(
                            text = "COMPLETED (${completedItems.size})",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.success,
                            letterSpacing = 1.sp,
                            modifier = Modifier.padding(top = 16.dp, bottom = 4.dp, start = 2.dp)
                        )
                    }

                    items(completedItems, key = { it.id }) { item ->
                        BucketCardItem(
                            item = item,
                            onToggleComplete = {
                                // Can uncomplete if needed
                                item.isCompleted = false
                                item.dateCompleted = null
                            },
                            onItemClick = {
                                selectedItemForDetail = item
                            }
                        )
                    }
                }
            }
        }
    }

    // Add Dream Modal Bottom Sheet
    if (showAddDreamSheet) {
        AddDreamBottomSheet(
            sheetState = sheetState,
            userName = userName,
            userAvatarEmoji = userAvatarEmoji,
            onAddDream = { newDream ->
                items.add(0, newDream)
                showAddDreamSheet = false
                partnerNotificationBanner = "$userName added '${newDream.text}' to the bucket list ✨"
                Toast.makeText(context, "Dream added ✓", Toast.LENGTH_SHORT).show()
                scope.launch {
                    delay(3500L)
                    partnerNotificationBanner = null
                }
            },
            onDismiss = { showAddDreamSheet = false }
        )
    }

    // Complete Dream Confirmation Dialog
    if (completingItem != null) {
        CompleteDreamDialog(
            item = completingItem!!,
            onConfirmWithMemory = { item ->
                markItemCompleted(item, createMemory = true)
                completingItem = null
            },
            onConfirmWithoutMemory = { item ->
                markItemCompleted(item, createMemory = false)
                completingItem = null
            },
            onDismiss = { completingItem = null }
        )
    }

    // Detail & Edit Dialog
    if (selectedItemForDetail != null) {
        DreamDetailEditDialog(
            item = selectedItemForDetail!!,
            currentUserName = userName,
            onUpdateText = { newText ->
                val index = items.indexOfFirst { it.id == selectedItemForDetail!!.id }
                if (index != -1) {
                    items[index] = items[index].copy(text = newText)
                }
                selectedItemForDetail = null
                Toast.makeText(context, "Dream updated ✓", Toast.LENGTH_SHORT).show()
            },
            onDelete = {
                items.remove(selectedItemForDetail!!)
                selectedItemForDetail = null
                Toast.makeText(context, "Dream removed.", Toast.LENGTH_SHORT).show()
            },
            onDismiss = { selectedItemForDetail = null }
        )
    }

    // All Dreams Completed Celebration Overlay
    if (showAllCompletedCelebration) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.85f))
                .clickable { showAllCompletedCelebration = false }
                .padding(spacing.large),
            contentAlignment = Alignment.Center
        ) {
            CelebrationEffects()

            TwoBeCard(
                modifier = Modifier
                    .fillMaxWidth(0.9f)
                    .clickable(enabled = false) {},
                elevation = 24.dp
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(12.dp)
                ) {
                    Text(text = "👑", fontSize = 56.sp)
                    Text(
                        text = "All dreams completed! 🎉",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                    Text(
                        text = "You two conquered every single dream together. Ready to write your next adventure chapter?",
                        fontSize = 13.sp,
                        color = colors.textSecondary,
                        textAlign = TextAlign.Center,
                        lineHeight = 19.sp,
                        modifier = Modifier.padding(top = 4.dp, bottom = 16.dp)
                    )
                    TwoBeButton(
                        text = "Keep Dreaming Together",
                        onClick = { showAllCompletedCelebration = false },
                        modifier = Modifier.fillMaxWidth(),
                        variant = ButtonVariant.PRIMARY
                    )
                }
            }
        }
    }
}

/**
 * Individual Bucket List Item Card
 */
@Composable
fun BucketCardItem(
    item: BucketItem,
    onToggleComplete: () -> Unit,
    onItemClick: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    TwoBeCard(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onItemClick() },
        elevation = 2.dp,
        backgroundColor = if (item.isCompleted) colors.surfaceVariant.copy(alpha = 0.5f) else colors.surface
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Checkbox on Left Side (Animated, 44dp touch target)
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .clickable {
                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                        onToggleComplete()
                    },
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(24.dp)
                        .clip(CircleShape)
                        .background(if (item.isCompleted) colors.success else Color.Transparent)
                        .border(
                            2.dp,
                            if (item.isCompleted) colors.success else colors.border,
                            CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    if (item.isCompleted) {
                        Text(text = "✓", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.width(spacing.xxSmall))

            // Item Content
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = item.text,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = if (item.isCompleted) colors.textSecondary else colors.textPrimary,
                    textDecoration = if (item.isCompleted) TextDecoration.LineThrough else TextDecoration.None,
                    lineHeight = 20.sp
                )

                // Subtitle metadata
                Text(
                    text = if (item.isCompleted) {
                        "Completed on ${item.dateCompleted}"
                    } else {
                        "Added by ${item.authorName} on ${item.dateAdded}"
                    },
                    fontSize = 11.sp,
                    color = if (item.isCompleted) colors.success else colors.textSecondary,
                    modifier = Modifier.padding(top = 2.dp)
                )
            }

            // Category badge
            Box(
                modifier = Modifier
                    .padding(start = spacing.xxSmall)
                    .clip(RoundedCornerShape(8.dp))
                    .background(colors.surfaceVariant)
                    .padding(horizontal = 6.dp, vertical = 3.dp)
            ) {
                Text(
                    text = item.category.emoji,
                    fontSize = 12.sp
                )
            }
        }
    }
}
