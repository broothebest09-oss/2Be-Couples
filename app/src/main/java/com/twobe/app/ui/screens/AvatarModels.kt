package com.twobe.app.ui.screens

import androidx.compose.ui.graphics.Color

enum class AvatarState(
    val title: String,
    val emoji: String,
    val badgeText: String,
    val description: String
) {
    ONLINE("Online", "🟢", "Online", "Standing normally with subtle breathing"),
    TYPING("Typing...", "💬", "Typing...", "Holding phone and typing to you"),
    SLEEPING("Sleeping", "💤", "Sleeping 💤", "Dreaming peacefully with floating Zzz"),
    OFFLINE("Offline", "⚪", "Offline", "Resting in power-saving mode"),
    HAPPY("Happy", "✨", "Happy ✨", "Radiant smile with sparkling aura"),
    SAD("Sad", "🌧️", "Needs Love 🌧️", "Frowning softly under gentle rain")
}

data class SkinToneOption(
    val id: String,
    val name: String,
    val color: Color
)

enum class BodyType(val label: String, val emoji: String) {
    SLIM("Slim", "🧍"),
    AVERAGE("Average", "🧍‍♀️"),
    ATHLETIC("Athletic", "💪")
}

data class HairStyleOption(
    val id: String,
    val name: String,
    val emoji: String
)

data class ColorOption(
    val id: String,
    val name: String,
    val color: Color
)

enum class FacialExpression(val label: String, val emoji: String) {
    HAPPY("Happy", "😊"),
    NEUTRAL("Neutral", "🙂"),
    SAD("Sad", "🥺"),
    SURPRISED("Surprised", "😮")
}

data class ClothingItem(
    val id: String,
    val name: String,
    val emoji: String,
    val primaryColor: Color
)

data class AccessoryItem(
    val id: String,
    val name: String,
    val emoji: String
)

data class AvatarConfig(
    val skinToneId: String = "skin_fair",
    val bodyType: BodyType = BodyType.AVERAGE,
    val hairStyleId: String = "hair_bob",
    val hairColorId: String = "color_espresso",
    val eyeColorId: String = "color_brown",
    val expression: FacialExpression = FacialExpression.HAPPY,
    val shirtId: String = "shirt_knit",
    val pantsId: String = "pants_jeans",
    val shoesId: String = "shoes_sneakers",
    val hatId: String = "hat_none",
    val glassesId: String = "glasses_none",
    val jewelryId: String = "jewelry_heart"
)

object AvatarDesignCatalog {
    val skinTones = listOf(
        SkinToneOption("skin_fair", "Fair Porcelain", Color(0xFFFFDFC4)),
        SkinToneOption("skin_peach", "Warm Peach", Color(0xFFF0C8A0)),
        SkinToneOption("skin_olive", "Sunlit Olive", Color(0xFFD4A373)),
        SkinToneOption("skin_caramel", "Warm Caramel", Color(0xFFB07D62)),
        SkinToneOption("skin_chestnut", "Rich Chestnut", Color(0xFF8C533C)),
        SkinToneOption("skin_deep", "Deep Espresso", Color(0xFF4A2810))
    )

    val hairStyles = listOf(
        HairStyleOption("hair_short_wave", "Short Waves", "💇"),
        HairStyleOption("hair_long_curls", "Long Curls", "👩‍🦱"),
        HairStyleOption("hair_ponytail", "High Ponytail", "👱‍♀️"),
        HairStyleOption("hair_bob", "Cute French Bob", "👩"),
        HairStyleOption("hair_messy_shag", "Messy Shag", "🧑"),
        HairStyleOption("hair_buzz", "Clean Fade", "👨‍🦲"),
        HairStyleOption("hair_space_buns", "Space Buns", "👧"),
        HairStyleOption("hair_sleek", "Sleek Straight", "👩‍🦰")
    )

    val hairColors = listOf(
        ColorOption("color_espresso", "Espresso", Color(0xFF2C1D11)),
        ColorOption("color_blonde", "Golden Honey", Color(0xFFE8C172)),
        ColorOption("color_rose", "Pastel Rose", Color(0xFFE8A5B9)),
        ColorOption("color_black", "Midnight Black", Color(0xFF141416)),
        ColorOption("color_auburn", "Auburn Ginger", Color(0xFF9E472A)),
        ColorOption("color_lavender", "Soft Lavender", Color(0xFFB5A6D6))
    )

    val eyeColors = listOf(
        ColorOption("eye_brown", "Deep Amber", Color(0xFF5A3825)),
        ColorOption("eye_blue", "Ocean Blue", Color(0xFF3B82F6)),
        ColorOption("eye_green", "Forest Green", Color(0xFF10B981)),
        ColorOption("eye_hazel", "Warm Hazel", Color(0xFF8B6B48)),
        ColorOption("eye_amber", "Golden Topaz", Color(0xFFD97706)),
        ColorOption("eye_violet", "Mystic Violet", Color(0xFF8B5CF6))
    )

    val shirts = listOf(
        ClothingItem("shirt_knit", "Cozy Knit Sweater", "🧶", Color(0xFFF3C5D0)),
        ClothingItem("shirt_hoodie", "Pastel Oversized Hoodie", "🧥", Color(0xFFD8B4E2)),
        ClothingItem("shirt_blouse", "Romantic Silk Blouse", "👚", Color(0xFFFFF0F5)),
        ClothingItem("shirt_striped", "Parisian Striped Tee", "👕", Color(0xFF334155)),
        ClothingItem("shirt_denim", "Vintage Denim Jacket", "🧥", Color(0xFF4A7B9D)),
        ClothingItem("shirt_pajama", "Satin Lounge Top", "🥼", Color(0xFFFFE4E1)),
        ClothingItem("shirt_graphic", "Heart Graphic Tee", "👕", Color(0xFF9B4D6F)),
        ClothingItem("shirt_turtleneck", "Chic Black Turtleneck", "🥼", Color(0xFF1E293B)),
        ClothingItem("shirt_buttondown", "Crisp Oxford Shirt", "👔", Color(0xFFE2E8F0)),
        ClothingItem("shirt_croptop", "Sweet Floral Crop Top", "👚", Color(0xFFFFD1DC))
    )

    val pants = listOf(
        ClothingItem("pants_jeans", "High-Rise Jeans", "👖", Color(0xFF3B82F6)),
        ClothingItem("pants_sweatpants", "Cloud Fleece Joggers", "🩳", Color(0xFFE2E8F0)),
        ClothingItem("pants_skirt", "Pleated Rose Skirt", "👗", Color(0xFFE8A5B9)),
        ClothingItem("pants_linen", "Cream Linen Trousers", "👖", Color(0xFFFFF4E6)),
        ClothingItem("pants_cargo", "Utility Khaki Cargos", "👖", Color(0xFF78716C)),
        ClothingItem("pants_fluffy", "Fluffy Pajama Shorts", "🩳", Color(0xFFFFE4E6)),
        ClothingItem("pants_denimshorts", "Classic Cutoffs", "🩳", Color(0xFF60A5FA)),
        ClothingItem("pants_chinos", "Relaxed Chinos", "👖", Color(0xFF94A3B8))
    )

    val shoes = listOf(
        ClothingItem("shoes_sneakers", "Chunky Retro Sneakers", "👟", Color(0xFFFFFFFF)),
        ClothingItem("shoes_canvas", "Low-Top Canvas", "👟", Color(0xFF9B4D6F)),
        ClothingItem("shoes_slippers", "Fuzzy Bunny Slippers", "🥿", Color(0xFFFFC0CB)),
        ClothingItem("shoes_loafers", "Classic Leather Loafers", "👞", Color(0xFF473322)),
        ClothingItem("shoes_boots", "Cozy Ankle Boots", "🥾", Color(0xFF8B5E3C)),
        ClothingItem("shoes_sandals", "Comfort Cloud Slides", "🩴", Color(0xFFFEE2E2))
    )

    val hats = listOf(
        AccessoryItem("hat_none", "No Headwear", "🚫"),
        AccessoryItem("hat_beanie", "Soft Knit Beanie", "🧶"),
        AccessoryItem("hat_bucket", "Pastel Bucket Hat", "👒"),
        AccessoryItem("hat_beret", "French Wool Beret", "🎨"),
        AccessoryItem("hat_catears", "Cute Cat Ear Headband", "🐱"),
        AccessoryItem("hat_cap", "Dad Baseball Cap", "🧢")
    )

    val glasses = listOf(
        AccessoryItem("glasses_none", "No Glasses", "🚫"),
        AccessoryItem("glasses_round", "Round Wireframes", "👓"),
        AccessoryItem("glasses_cateye", "Cat-Eye Frames", "👓"),
        AccessoryItem("glasses_sunglasses", "Retro Sunglasses", "🕶️")
    )

    val jewelry = listOf(
        AccessoryItem("jewelry_none", "No Jewelry", "🚫"),
        AccessoryItem("jewelry_heart", "Sweet Heart Pendant", "💖"),
        AccessoryItem("jewelry_pearl", "Classic Pearl Choker", "🦪"),
        AccessoryItem("jewelry_hoops", "Minimal Gold Hoops", "💍"),
        AccessoryItem("jewelry_stars", "Starlight Earrings", "⭐")
    )
}
