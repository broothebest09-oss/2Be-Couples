package com.twobe.app.ui.screens

import android.view.HapticFeedbackConstants
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateIntAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.AddMemoryDialog
import com.twobe.app.ui.components.ButtonVariant
import com.twobe.app.ui.components.LucideHeartIcon
import com.twobe.app.ui.components.MemoryDetailPagerDialog
import com.twobe.app.ui.components.MutualDeletionDialog
import com.twobe.app.ui.components.TwoBeButton
import com.twobe.app.ui.components.TwoBeCard
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import com.twobe.app.ui.theme.TwoBeTheme

@Composable
fun UsScreen(
    partnerName: String = "Sarah",
    userName: String = "Alex",
    userAvatarEmoji: String = "🐰",
    partnerAvatarEmoji: String = "🌸"
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val context = LocalContext.current
    val view = LocalView.current

    // Active Section Tab (Memories is default)
    var activeSection by remember { mutableStateOf(UsTabSection.MEMORIES) }

    // Filter and Sort dropdowns
    var dateFilter by remember { mutableStateOf(DateRangeFilter.ALL_TIME) }
    var sortOrder by remember { mutableStateOf(MemorySortOrder.NEWEST_FIRST) }
    var showDateFilterMenu by remember { mutableStateOf(false) }
    var showSortMenu by remember { mutableStateOf(false) }

    // Dialog & Viewer States
    var selectedMemoryIndex by remember { mutableStateOf<Int?>(null) }
    var showAddMemoryDialog by remember { mutableStateOf(false) }
    var memoryForDeletion by remember { mutableStateOf<MemoryItem?>(null) }

    // Couple Stats with animated numbers
    var stats by remember {
        mutableStateOf(CoupleStats(kissesCount = 184, hugsCount = 142, memoriesCount = 36, streakDays = 15, daysTogether = 342))
    }

    // Comprehensive list of memories illustrating all 5 memory types
    val memories = remember {
        mutableStateListOf(
            // 1. Photo memory
            MemoryItem(
                id = "1",
                type = MemoryType.PHOTO,
                caption = "Picnic under the cherry blossoms 🌸",
                dateText = "Nov 18",
                timestampMillis = 1700300000000L,
                senderName = partnerName,
                senderAvatarEmoji = partnerAvatarEmoji,
                originalContext = "Sunday Date in the Park"
            ),
            // 2. Video memory
            MemoryItem(
                id = "2",
                type = MemoryType.VIDEO,
                caption = "Laughing at the cute puppy we saw 🐶",
                videoDuration = "0:18",
                dateText = "Nov 15",
                timestampMillis = 1700100000000L,
                senderName = userName,
                senderAvatarEmoji = userAvatarEmoji,
                originalContext = "Walk downtown"
            ),
            // 3. Milestone memory
            MemoryItem(
                id = "3",
                type = MemoryType.MILESTONE,
                title = "💋 100th Kiss!",
                caption = "A sweet milestone of warmth and love.",
                milestoneEmoji = "💋",
                dateText = "Nov 10",
                timestampMillis = 1699600000000L,
                senderName = "2Be Milestone",
                senderAvatarEmoji = "✨",
                originalContext = "Automatic Couple Milestone"
            ),
            // 4. Text memory
            MemoryItem(
                id = "4",
                type = MemoryType.TEXT,
                caption = "You make the ordinary moments feel like magic. Thank you for being you.",
                dateText = "Nov 5",
                timestampMillis = 1699100000000L,
                senderName = partnerName,
                senderAvatarEmoji = partnerAvatarEmoji,
                originalContext = "Night chat whisper"
            ),
            // 5. Locked memory
            MemoryItem(
                id = "5",
                type = MemoryType.LOCKED,
                caption = "Our secret midnight beach swim 🌊",
                isLocked = true,
                unlockPin = "1234",
                dateText = "Oct 28",
                timestampMillis = 1698400000000L,
                senderName = userName,
                senderAvatarEmoji = userAvatarEmoji,
                originalContext = "Private Time Capsule"
            ),
            // Additional Photo memory
            MemoryItem(
                id = "6",
                type = MemoryType.PHOTO,
                caption = "First coffee date of November ☕",
                dateText = "Nov 1",
                timestampMillis = 1698800000000L,
                senderName = partnerName,
                senderAvatarEmoji = partnerAvatarEmoji,
                originalContext = "Autumn memories"
            )
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // ==========================================
            // HEADER & TOP TABS (Memories | Gratitude | Bucket List | Cycle)
            // ==========================================
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(colors.surface)
                    .padding(horizontal = spacing.medium, vertical = spacing.small)
            ) {
                // Section Tabs Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(999.dp))
                        .background(colors.surfaceVariant)
                        .padding(3.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    UsTabSection.values().forEach { tab ->
                        val isSelected = activeSection == tab
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(999.dp))
                                .background(if (isSelected) colors.primary else Color.Transparent)
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    activeSection = tab
                                }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = tab.title,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.White else colors.textSecondary
                            )
                        }
                    }
                }

                // If in Memories section, show Filter and Sort row
                if (activeSection == UsTabSection.MEMORIES) {
                    Spacer(modifier = Modifier.height(spacing.small))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Date Range Filter Dropdown
                        Box {
                            Row(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(colors.surfaceVariant)
                                    .clickable { showDateFilterMenu = true }
                                    .padding(horizontal = 10.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "📅 ${dateFilter.label}",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = colors.textPrimary
                                )
                                Text(text = " ▾", fontSize = 11.sp, color = colors.textSecondary)
                            }

                            DropdownMenu(
                                expanded = showDateFilterMenu,
                                onDismissRequest = { showDateFilterMenu = false }
                            ) {
                                DateRangeFilter.values().forEach { filter ->
                                    DropdownMenuItem(
                                        text = { Text(filter.label) },
                                        onClick = {
                                            dateFilter = filter
                                            showDateFilterMenu = false
                                        }
                                    )
                                }
                            }
                        }

                        // Sort Order Dropdown
                        Box {
                            Row(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(colors.surfaceVariant)
                                    .clickable { showSortMenu = true }
                                    .padding(horizontal = 10.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "⇅ ${sortOrder.label}",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = colors.textPrimary
                                )
                                Text(text = " ▾", fontSize = 11.sp, color = colors.textSecondary)
                            }

                            DropdownMenu(
                                expanded = showSortMenu,
                                onDismissRequest = { showSortMenu = false }
                            ) {
                                MemorySortOrder.values().forEach { order ->
                                    DropdownMenuItem(
                                        text = { Text(order.label) },
                                        onClick = {
                                            sortOrder = order
                                            showSortMenu = false
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // ==========================================
            // CONTENT: MEMORIES SECTION (Default)
            // ==========================================
            if (activeSection == UsTabSection.MEMORIES) {
                if (memories.isEmpty()) {
                    // EMPTY STATE
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth()
                            .padding(spacing.large),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(text = "📖", fontSize = 64.sp)
                        Text(
                            text = "Start creating memories together!",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary,
                            modifier = Modifier.padding(top = 12.dp)
                        )
                        Text(
                            text = "Save photos, milestones, and heartfelt whispers into your couple album.",
                            fontSize = 13.sp,
                            color = colors.textSecondary,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
                        )
                        TwoBeButton(
                            text = "Add your first memory",
                            onClick = { showAddMemoryDialog = true },
                            variant = ButtonVariant.PRIMARY
                        )
                    }
                } else {
                    // 2-Column Square Grid
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(2),
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth()
                            .padding(horizontal = spacing.medium, vertical = spacing.xSmall),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        itemsIndexed(memories, key = { _, m -> m.id }) { index, item ->
                            MemorySquareCard(
                                memory = item,
                                onClick = {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    selectedMemoryIndex = index
                                }
                            )
                        }
                    }
                }

                // ==========================================
                // STATS SECTION (Bottom of screen, Sticky)
                // ==========================================
                StickyCoupleStatsRow(stats = stats)
            } else if (activeSection == UsTabSection.GRATITUDE) {
                // ==========================================
                // CONTENT: GRATITUDE JAR SECTION
                // ==========================================
                Box(modifier = Modifier.weight(1f)) {
                    GratitudeJarSection(
                        partnerName = partnerName,
                        userName = userName,
                        userAvatarEmoji = userAvatarEmoji,
                        partnerAvatarEmoji = partnerAvatarEmoji,
                        onMilestoneReached = { newMilestone ->
                            memories.add(0, newMilestone)
                            stats = stats.copy(memoriesCount = stats.memoriesCount + 1)
                        }
                    )
                }
            } else if (activeSection == UsTabSection.BUCKET_LIST) {
                // ==========================================
                // CONTENT: BUCKET LIST SECTION ("When We're Together")
                // ==========================================
                Box(modifier = Modifier.weight(1f)) {
                    BucketListSection(
                        partnerName = partnerName,
                        userName = userName,
                        userAvatarEmoji = userAvatarEmoji,
                        partnerAvatarEmoji = partnerAvatarEmoji,
                        onMemoryCreated = { memory ->
                            memories.add(0, memory)
                            stats = stats.copy(memoriesCount = stats.memoriesCount + 1)
                        }
                    )
                }
            } else {
                // ==========================================
                // CONTENT: CYCLE TRACKER SECTION
                // ==========================================
                Box(modifier = Modifier.weight(1f)) {
                    CycleTrackerSection(
                        partnerName = partnerName,
                        userName = userName
                    )
                }
            }
        }

        // Floating Action Button (FAB) in bottom-right: Plus icon
        if (activeSection == UsTabSection.MEMORIES) {
            FloatingActionButton(
                onClick = {
                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                    showAddMemoryDialog = true
                },
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(end = 20.dp, bottom = 88.dp)
                    .size(56.dp),
                shape = CircleShape,
                containerColor = colors.accent,
                contentColor = Color.White
            ) {
                Text(text = "+", fontSize = 28.sp, fontWeight = FontWeight.Bold)
            }
        }

        // Full Screen Memory Viewer Modal with Swipe navigation
        if (selectedMemoryIndex != null) {
            MemoryDetailPagerDialog(
                memories = memories,
                initialIndex = selectedMemoryIndex!!,
                partnerName = partnerName,
                onDismiss = { selectedMemoryIndex = null },
                onRequestDelete = { memory ->
                    memoryForDeletion = memory
                }
            )
        }

        // Add Memory Dialog
        if (showAddMemoryDialog) {
            AddMemoryDialog(
                userAvatarEmoji = userAvatarEmoji,
                userName = userName,
                onMemoryCreated = { newMemory ->
                    memories.add(0, newMemory)
                    stats = stats.copy(memoriesCount = stats.memoriesCount + 1)
                    showAddMemoryDialog = false
                    Toast.makeText(context, "Memory added to album! ✨", Toast.LENGTH_SHORT).show()
                },
                onDismiss = { showAddMemoryDialog = false }
            )
        }

        // Mutual Deletion Dialog
        if (memoryForDeletion != null) {
            MutualDeletionDialog(
                memory = memoryForDeletion!!,
                partnerName = partnerName,
                onConfirmRequestDeletion = {
                    memoryForDeletion!!.isPendingDeletion = true
                    memoryForDeletion!!.deletionRequestedByMe = true
                    Toast.makeText(context, "Deletion requested. $partnerName will be notified to confirm.", Toast.LENGTH_LONG).show()
                    memoryForDeletion = null
                },
                onPartnerConfirmDelete = {
                    memories.remove(memoryForDeletion!!)
                    stats = stats.copy(memoriesCount = (stats.memoriesCount - 1).coerceAtLeast(0))
                    memoryForDeletion = null
                    selectedMemoryIndex = null
                    Toast.makeText(context, "Memory permanently removed by mutual consent.", Toast.LENGTH_SHORT).show()
                },
                onCancelDeletion = {
                    memoryForDeletion!!.isPendingDeletion = false
                    memoryForDeletion = null
                    Toast.makeText(context, "Deletion cancelled.", Toast.LENGTH_SHORT).show()
                },
                onDismiss = { memoryForDeletion = null }
            )
        }
    }
}

/**
 * 1:1 Aspect Ratio Square Memory Card
 */
@Composable
fun MemorySquareCard(
    memory: MemoryItem,
    onClick: () -> Unit
) {
    val colors = TwoBeTheme.colors

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(1f) // 1:1 Aspect Ratio
            .shadow(
                elevation = 4.dp,
                shape = RoundedCornerShape(16.dp),
                ambientColor = colors.accent.copy(alpha = 0.08f)
            )
            .clip(RoundedCornerShape(16.dp))
            .background(colors.surface)
            .border(1.dp, colors.border.copy(alpha = 0.6f), RoundedCornerShape(16.dp))
            .clickable { onClick() }
    ) {
        val isItemLocked = memory.isLocked || memory.type == MemoryType.LOCKED

        if (isItemLocked) {
            // Locked Memory (blurred with lock icon overlay, "Locked - requires PIN")
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(colors.surfaceVariant),
                contentAlignment = Alignment.Center
            ) {
                // Blurred background hint
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .blur(8.dp)
                        .background(colors.primary.copy(alpha = 0.25f))
                )

                // Overlay
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.5f))
                        .padding(8.dp),
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(text = "🔒", fontSize = 32.sp)
                    Text(
                        text = "Locked 🔒",
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                    Text(
                        text = "Locked - requires PIN",
                        color = Color.White.copy(alpha = 0.85f),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }
            }
        } else {
            when (memory.type) {
                // 1. Photo Memory
                MemoryType.PHOTO -> {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.linearGradient(
                                    listOf(colors.primary.copy(alpha = 0.3f), colors.surfaceVariant)
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "📸", fontSize = 42.sp)
                    }

                    // Bottom caption bar
                    Box(
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .fillMaxWidth()
                            .background(Color.Black.copy(alpha = 0.45f))
                            .padding(horizontal = 8.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = memory.caption ?: "Photo",
                            color = Color.White,
                            fontSize = 11.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }

            // 2. Video Memory
            MemoryType.VIDEO -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFF261D22)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "🎥", fontSize = 42.sp)

                    // Play icon overlay
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(Color.White.copy(alpha = 0.85f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "▶", fontSize = 16.sp, color = colors.accent)
                    }

                    // Duration pill
                    Box(
                        modifier = Modifier
                            .align(Alignment.BottomEnd)
                            .padding(8.dp)
                            .clip(RoundedCornerShape(4.dp))
                            .background(Color.Black.copy(alpha = 0.6f))
                            .padding(horizontal = 5.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = memory.videoDuration ?: "0:15",
                            color = Color.White,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // 3. Milestone Memory
            MemoryType.MILESTONE -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                listOf(colors.primary.copy(alpha = 0.2f), colors.surface)
                            )
                        )
                        .padding(12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(text = memory.milestoneEmoji ?: "💖", fontSize = 38.sp)
                    Text(
                        text = memory.title ?: "Milestone",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary,
                        textAlign = TextAlign.Center,
                        maxLines = 2,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                    Text(
                        text = memory.dateText,
                        fontSize = 10.sp,
                        color = colors.textSecondary,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }

            // 4. Text Memory (max 2 lines snippet, sender avatar, date)
            MemoryType.TEXT -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(colors.surface)
                        .padding(12.dp),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(colors.primary.copy(alpha = 0.3f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = memory.senderAvatarEmoji, fontSize = 14.sp)
                        }

                        Text(
                            text = memory.dateText,
                            fontSize = 10.sp,
                            color = colors.textSecondary
                        )
                    }

                    Text(
                        text = "“${memory.caption ?: ""}”",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = colors.textPrimary,
                        lineHeight = 16.sp,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )

                    Text(
                        text = "💬 Whisper note",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.accent
                    )
                }
            }

            // 5. Locked Memory (blurred with lock icon overlay, "Locked 🔒" text)
            MemoryType.LOCKED -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(colors.surfaceVariant),
                    contentAlignment = Alignment.Center
                ) {
                    // Blurred background hint
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .blur(8.dp)
                            .background(colors.primary.copy(alpha = 0.25f))
                    )

                    // Overlay
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color.Black.copy(alpha = 0.45f))
                            .padding(8.dp),
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(text = "🔒", fontSize = 32.sp)
                        Text(
                            text = "Locked 🔒",
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                        Text(
                            text = "Tap to unlock with PIN",
                            color = Color.White.copy(alpha = 0.75f),
                            fontSize = 9.sp
                        )
                    }
                }
            }
        }
    }

    // Pending Deletion Badge
    if (memory.isPendingDeletion) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .fillMaxWidth()
                    .background(Color(0xFFD64545))
                    .padding(vertical = 3.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Pending deletion",
                    color = Color.White,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

/**
 * Sticky Bottom Stats Section
 * Kisses, Hugs, Memories, Streak, Days together with animated numbers
 */
@Composable
fun StickyCoupleStatsRow(
    stats: CoupleStats
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing

    // Animated counters
    val animatedKisses by animateIntAsState(targetValue = stats.kissesCount, animationSpec = spring(stiffness = Spring.StiffnessLow), label = "kisses")
    val animatedHugs by animateIntAsState(targetValue = stats.hugsCount, animationSpec = spring(stiffness = Spring.StiffnessLow), label = "hugs")
    val animatedMemories by animateIntAsState(targetValue = stats.memoriesCount, animationSpec = spring(stiffness = Spring.StiffnessLow), label = "memories")
    val animatedStreak by animateIntAsState(targetValue = stats.streakDays, animationSpec = spring(stiffness = Spring.StiffnessLow), label = "streak")
    val animatedDaysTogether by animateIntAsState(targetValue = stats.daysTogether, animationSpec = spring(stiffness = Spring.StiffnessLow), label = "daysTogether")

    val statItems = listOf(
        Triple("💋", animatedKisses, "kisses"),
        Triple("🤗", animatedHugs, "hugs"),
        Triple("📸", animatedMemories, "memories"),
        Triple("🔥", animatedStreak, "day streak"),
        Triple("⏳", animatedDaysTogether, "days together")
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(
                elevation = 8.dp,
                shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp),
                ambientColor = colors.accent.copy(alpha = 0.08f)
            )
            .clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
            .background(colors.surface)
            .padding(vertical = 12.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = spacing.medium),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            statItems.forEach { (emoji, count, label) ->
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(colors.surfaceVariant)
                        .padding(horizontal = 14.dp, vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = emoji, fontSize = 18.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Column {
                            Text(
                                text = count.toString(),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.accent
                            )
                            Text(
                                text = label,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Medium,
                                color = colors.textSecondary
                            )
                        }
                    }
                }
            }
        }
    }
}
