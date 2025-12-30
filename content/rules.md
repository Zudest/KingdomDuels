+++
#menus = 'main'
#weight = 20
title = 'Rules'
readingTime = false
+++

> *Kingdom Duels aims to provide a similar experience to the Duelist Kingdom arc of the Yugioh anime. It follows the regular Yu-Gi-Oh! rules but with some differences. Players can agree to modify the rules (or even the cards) as much as they want (just like the writers did in the show!) Have fun!*

## 📄 Getting Started

### 📝 About

Kingdom Duels is a turn-based competitive card game that is normally played by 2 players. The main way to win at this game is to reduce your opponent's Life Points (LP) to 0.


### 🗺️ The Game Board

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="/img/promotion/RulesField.jpg" link="/img/promotion/RulesField.jpg" alt="?" width="720" >}}
</div>

This game is played on a board that is divided into several card zones. It has a **Frontrow** (five card zones where you play your monsters) and a **Backrow** (five card zones where you play spell and traps). These two concepts (Frontrow and Backrow) together establish *"your Field"*.

The other four zones of the board are outside of *your Field* and serve different purposes: the **Rule Zone** is where you play rule cards; the **Graveyard** is where you discard cards after use; the **Main Deck Zone** is where you have your deck of cards; and the **Extra Deck Zone** is where you may have a secondary deck of cards.

Your opponent has the exact same board setup as you, with their own Frontrow, Backrow, etc.

### 🧭 Setup

- Each player begins the Duel with **2000 Life Points** (LP).
- Each player needs a **Main Deck** with exactly 30 cards and an **Extra Deck** with up to 20 cards.
- Before the duel starts a **Setup Phase** occurs:
    - **(1)**: Each player place their shuffled Main Deck and Extra Deck in their corresponding zones.
    - **(2)**: Each player can activate **Setup Rule** card(s) that they may have in their Extra Deck. 
        - To activate them the player moves the Setup Rule from their Extra Deck into their Rule Zone (for example a Duelist Setup may enable some specific cards to add to their hand, or a Field Setup may define specific Terrains that benefit their strategy).
    - **(3)**: The starting Terrains are placed in each side of the field, defined by a TERRAINS effect.
        - If a player didn't activated a TERRAINS effect they must use 5 "Land" Terrains.
    - **(4)**: Players then decide who goes first (by coin toss, rock-paper-scissors, etc.)
    - **(5)**: They draw their initial **5 cards**.
        - At this point, if a player used a STRATEGY effect, they may swap up to 2 cards from their starting hand with card(s) in that STRATEGY, and then shuffle their deck.
    - **(6)**: The duel begins.

### ⚙️ Turn Structure

![](/img/promotion/RulesPhases.jpg)

*Draw Phase → Standby Phase → Main Phase 1 → Battle Phase → Main Phase 2 → End Phase*

#### ✋ Draw Clarifications

- During its Draw Phase, a player draws 1 card from their deck (even in the first turn). 
- There is no hand size limit, a player can have any number of cards in their hand.
- If you add cards from (or to) your Deck (outside of drawing them from the top) you must shuffle the Deck afterwards unless otherwise stated.
- If a player can't draw cards from its Deck then that player loses the duel by deckout.

#### 📌 Main Phase Clarifications

- Monsters in this game must be "summoned" to the field in a "Monster Zone".
- During your turn you can perform **one** Normal Summon and any number of Special Summons (which are enabled through card effects).
- You can Normal Summon in **face-up ATK** or **face-up DEF** Position Normal monsters from your Main Deck of **any** Level without tributing.
- Monsters can be in ATK Position (upright) or in DEF Position (sideways). The other card types (Spell, Traps and Rules) are always in upright position.
- You **can't Set monsters face-down** in this game. Instead you can **Hide** a monster (or **Summon in Hidden position**) in face-down ATK or face-down DEF position but only if there is an effect that allows you to do so. Monsters with the **FLIP** keyword can be summoned in Hidden DEF position in any terrain that they can be summoned on.
- **Monsters Hidden in DEF** Position work exactly like face-down DEF position in the official rules. **Monsters Hidden in ATK** Position are revealed during combat, but can be hidden once again after battle calculations if they are still on the field.

#### ⚔️ Battle Clarifications

- You **can't** attack your opponent's LP directly.
- Only **one monster** can declare an attack on each Battle Phase.
- Only ATK Position monsters can attack. The difference between ATK values is inflicted to the LP of the monster with the lowest amount of ATK as "**Battle Damage**". DEF Position monsters protect your LP from attacks.
- Attacks can be **redirected** from one target to another. If an attack is redirected then it is now treated as an opponent attack, even during your own Battle Phase, but its source is still considered to be the original monster.


### 🗒️ Components of a Card

![](/img/promotion/RulesCardComponents.jpg)

**Grade Symbol**: The grade or "main icon" of a card in the top right corner provides specific information about how that card is played. It varies from card type and card subtype:
- **Levels**: Numbers from 1 to 12 on top of an orange and yellow star-pattern icon.
- **Glyphs**: Brown and white icons with unique symbols for Normal, Equip, Continuous and Setup.
- **Charges**: Numbers on top of a dark purple icon, exclusive to Symbol Rule Cards.

**Types**: Is a categorization of specific words that a card may have, separated by a vertical bar. They don't provide effects on their own but are used for multiple cards and effects.

**Attribute Symbol**: Can be one of the six attributes (DARK, LIGHT, FIRE, WATER, EARTH, WIND) from the original game (minus DIVINE). All cards have an attribute including spell and traps.

**Effect Box**: The effect box details what the card actually does. Some cards have a dark arrow icon (►) which is used to split the condition required to activate it and the actual effect. An empty square icon (□) is used to make a list of options that a player may choose for the effect.

**ATK/DEF**: Monsters have these values on top of each other marked with small icons of a sword (for ATK) and a shield (for DEF).

**Field Power Bonus**: This is a numeric value with the plus sign near the ATK/DEF that indicates how much ATK/DEF the monster gets when is receiving a field power bonus.


---

## ⛰️ Terrain Markers

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="/img/promotion/RulesFieldTerrain.jpg" link="/img/promotion/RulesFieldTerrain.jpg" caption="Example of a field with 5 Forest Terrains and two monsters Hidden (face-down), one in ATK and one in DEF." alt="?" width="720" >}}
</div>

On top of each Monster Zone in the Frontrow there will be a **"Terrain Marker"** (also called **Terrains**) that may give different effects to the monster card placed on top of it. They are game components that recreate the diverse terrain effects of the anime, are not considered cards and are associated to the Monster Zone directly beneath them.

- If a Terrain Marker is **replaced** by a new one then the old one must be set aside of the game board in no specified zone.
- If a monster is somehow summoned in the backrow, it is considered to be in the same Terrain as the corresponding frontrow Monster Zone in the same column.

The **TERRAINS** effect type within **Field Setup Rule** cards define the starting Terrains that will be placed on each side of the field. If you don't activate a TERRAINS effect during the setup of the game you are playing on the default rules and you must fill your Frontrow with 5 "Land" Terrains.

### 🏞️ Field Power Bonus

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/T/03.jpg" alt="?" caption="In this example: 'Beast', 'Insect' and 'Plant monster types gain the Field Power Bonus." width="500" >}}
</div>

**"Field Power Bonus"** is a term that is used when a monster is receiving an additional ATK and DEF increase thanks to the Terrain it's located on. The ATK and DEF gained through this effect corresponds to 30% of each monster's original ATK/DEF and is printed on every monster card.

Each Terrain Marker states which type and/or attribute gains the Field Power Bonus, represented at the right side of the Attribute symbol.

---

## 🎴 The Cards

Broadly speaking there are four main types of cards in this game you have to be mindful of, which are: **Rules**, **Monsters**, **Spells**, **Traps**.

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/071.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/023.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/107.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/062.jpg" alt="" width="170" >}}
</div>

---

### 📜 Rule Cards

**Rule Cards** (light green frame) are placed in the Extra Deck and can only be played into the Rule Zone. If they leave the Rule Zone they go back to the Extra Deck. 

Rule Cards have effects or mechanics that are added on to the current game **ruleset** for as long as that Rule Card is active on the Rule Zone. These effects do not stack (meaning that multiple copies of the same card share a single effect for all of them, even for opposing players). Active Rule Cards are not in the _field_ and as such they cannot be negated easily. There is no limit to the amount of cards that can be played in your Rule Zone. 

Rule Cards may be one of the following types: **Normal**, **Setup** or **Symbol**.

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/071.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/109.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/KOD/156.jpg" alt="" width="170" >}}
</div>

> → **📜 Normal Rule Cards**

They simply say "Rule" in their Type and have the special **EVENT** effect type, which describes a condition. This mean that the Rule Card can be activated (Quick Effect) from your Extra Deck into the Rule Zone at any point as long as that condition is true. If the condition is no longer valid, the Rule Card returns to the Extra Deck.

> → **🗺️ Setup Rule Cards**

These are cards that can only be activated during the Setup Phase before the start of the duel. They may have one of the following card types:

- **Duelist**: Cards that represent a Duelist from the anime you are playing as. They have a **STRATEGY** special effect type which has a list of cards that ignore the Restricted List during Deckbuilding and allow you to manipulate your hand during the Setup Phase: after drawing your starting hand you may choose to replace up to 2 of those cards with any card listed within the **STRATEGY**, revealing it. You can only activate one **STRATEGY** effect per duel.

- **Field**: Cards that represent the scenario of the duel. They define the 5 starting Terrains for each player with the **TERRAINS** special effect type, marking their positions from left to right on the players' field. They may indicate if they are for the Red or Blue side of the field. You can only activate one **TERRAINS** effect per duel.

- **Challenge**: Cards that change the entire game in a big way or create additional restrictions on deckbuilding or when playing.

> → **🌠 Symbol Rule Cards**

They represent objects or powers from the anime that can interfere in the duel in weird ways, breaking the fourth wall. They have a light-yellow frame and are **optional** to the duel (all players must agree if they want to play with them or not, they can also agree to let observers of the duel use their Symbol cards to influence the duel).

- Symbol cards have individual effects (which are Quick Effects unless otherwise stated) that require consuming a certain amount of "**Charges**" from the card itself to activate them. The Charges of the card are represented in its Grade symbol and must be tracked when they are consumed.
- You can only have one Symbol in the Rule Zone at a time, and you have to play them there as a Slow Effect during your Main Phase. If your Symbol has 0 Charges you can return it to the Rule Zone. 
- A player can only activate one of their Symbol effects **per round**. 

---

### 🐉 Monster Cards

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/017.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/048.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/TEG/079.jpg" alt="" width="170" >}}
</div>

**Normal Monster** cards (yellow frame) are placed in the Main Deck (and have effects despite being called "normal" monsters, unlike the original yugioh card game).

**Extra Deck Monsters** (rituals, fusions, alters, integrations and tokens) have special mechanics and summoning conditions that you must fulfill to play them from the Extra Deck onto your field.

Cards used for an Extra Deck monster summon are considered "**Materials**" of that card type (for example Fusion Materials or Ritual Materials).

---

### 🌀 Fusion Monster Cards

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/KOD/057.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/KOD/071.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/TEG/106.jpg" alt="" width="170" >}}
</div>

**Fusion Monsters** (purple frame) represent a combination of two or more specific monsters into one single being. 

- To summon a Fusion Monster you need to have the required monsters in your hand and/or field and then use a card named "Fusion". After the Fusion Monster is summoned, you attach the corresponding Fusion Materials to it. 

- Fusion monsters are treated as having the same name as all their Fusion Materials for card effects.

- If a Fusion Material somehow enters the field as a monster while its corresponding Fusion Monster is still on the field then this new monster can't declare an attack on the first turn it's summoned.

---

### 🕯️ Ritual Monster Cards

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/KOD/105.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/LEN/187.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/TEG/093.jpg" alt="" width="170" >}}
</div>

**Ritual Monsters** (blue frame) represent sealed monsters being summoned to the battlefield by sacrificing cards in a ritual ceremony. 

- To summon a Ritual Monster you need to fulfil the requirements of a specific "Ritual" Spell Card listed in its summoning conditions, which usually involves tributing the corresponding Ritual Material(s) to the graveyard. 

- The "Ritual" Spell Card usually remains on the field face-up until the requirements are fulfiled or the card is destroyed. It's controller can also send the spell card to the Graveyard at will during its Main Phase. If you fulfil a "Ritual" Spell Card that you control but not own, you must Ritual Summon the corresponding monster from the Extra Deck of the proper owner of that spell card instead of yours (if possible).

- A monster equipped to another monster is still treated as a monster on the field and therefore can be used to fulfil a Ritual Summon. This is not the case with attached monsters (unless otherwise stated).

---

### 🧬 Alter Monster Cards

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/087.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/KOD/136.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/MLY/010.jpg" alt="" width="170" >}}
</div>

**Alter Monsters** (red frame) represent monsters that went through a transformation of some kind without merging with other monsters.

- To summon an Alter Monster you need to play a card that lets you Alter Summon a specific Type of monsters (a Type unique to Alter cards) while controlling a specific monster on the field listed in the conditions of the Alter Monster. After the Alter Monster is summoned, you attach the corresponding Alter Material to it.

- In some cases an Alter Summon may require a certain amount of "Summoning Counters" placed on top of the specific Alter Material as part of its summoning condition. These counters are usually placed due to card effects, and are removed once the Alter Summon is completed or the Material is removed from the field.

- An Alter Monster is summoned on the same zone its corresponding Alter Material was, and any Equip card active on that monster is re-equipped to the new card instead (if the new target is still valid). Any attack or effect targeting the material monster now targets the new monster (if valid).

---

### 🤝🏻 Integration Monster Cards

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/125.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/129.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/133.jpg" alt="" width="170" >}}
</div>

**Integration Monsters** (brown frame) represent cards that merge with the soul of the duelist that represents you as a player.

- To summon an Integration Monster you need to have played a specific Duelist Setup Rule card at the beginning of the game (marked in the summoning condition with curly brackets) and Erode from your hand or field the other Material(s) listed on the card.

- Integration monsters are treated as having the same name as their Integration Materials for card effects.

- If you want to summon in Hidden ATK or Hidden DEF Position an Integration Summon you are not forced to reveal the eroded material card right away, but when you erode it you must set it clearly apart from other cards, and once your monster is revealed or the duel ends you must reveal that the eroded card was the proper material, otherwise you lose the duel instead.

---

### 🀄 Token Monster Cards

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/101.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/TEG/011.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/TEG/149.jpg" alt="" width="170" >}}
</div>

**Token Monsters** (grey frame) represent artificial constructs or ephemeral monsters that are being maintained on the battlefield through magic.

- To summon a Token Monster you need a card in play that specifically lets you to do so.

- Tokens can only exist in the Field (except being attached) or in the Extra Deck. If they are to be sent to a different game area or Eroded they return to the Extra Deck instead. Since Tokens cannot be attached to other cards, they cannot be used for summoning methods that attach their materials. 

- Even though they come from the Extra Deck, when they are in the field they are considered Normal Monsters and not Extra Deck Monsters unless otherwise stated.

---

### 🔮 Spell and Trap Cards

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/107.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/020.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/062.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/102.jpg" alt="" width="170" >}}
</div>

**Spell Cards** (green frame) and **Trap Cards** (pink frame) are placed in the Main Deck. They have Attributes like Monster Cards, and may be one of the following types: **Normal**, **Equip**, **Continuous**. They are all activated as Quick Effects unless they have the **Slow** type.

Spell Cards can be activated from the hand or from the field (if they were Set face down) while Trap Cards must be Set face down in the backrow first for a turn before being able to be activated.

Trap Cards have a "**Trigger**" condition which indicates that the card effect is automatically activated when that trigger is met (the player has no control over this activation). If the card says that the Trigger is "None" then you can activate the card at will as long as you are able to.

If the player **does not** activate a trap card when its Trigger is met then the player gets an Idle Warning. If there are multiple of your traps on the field whose conditions are met at the same time: you can choose how many of them to activate (min. 1) without getting an Idle Warning.

**Continuous** Spell and Trap cards remain on the field until either another card or their own condition (if they have any) remove them from play. **Continuous Trap Cards with "Triggers"** can be flipped face-up at any time their effect speed allows it, but the effect only activates when the Trigger is met.

---

### 🌈 Combination Cards

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/086.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/SOE/066.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/KOD/125.jpg" alt="" width="170" >}}
</div>

There are a few Main Deck cards that have a **combination of two colors** in their frame. These cards are considered as having both their card types at the same time (and can be affected by cards targeting either of those types). 

They are **Spell Monsters**, **Trap Monsters** and **Spell Traps**. You can usually choose to play them as one card type or the other. Each card specifies how to play them with a "Play" condition on its text.

---

### 📿 Divine Cards

<div style="display: flex; justify-content: left; gap: 5px;">
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/TEG/001.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/TEG/002.jpg" alt="" width="170" >}}
{{< imagetext src="https://zudest.github.io/KingdomDuelsDeckbuilder/cards/TEG/003.jpg" alt="" width="170" >}}
</div>

**Divine** is a special Type of cards. Each Divine card is color-coded individually, meaning that it can have the frame color of its card type (main deck monster, fusion monster, spell, etc.) or a different color entirely. Divine cards have a special mechanic unique to them called "Hierarchy":

**Hierarchy** is a scale that goes from 1 to 7. It is represented visually on the card with a single digit in a different font on the rightmost part of the Type line. Cards may refer to this number as the Divine card's "Hierarchy" for card effects. Usually, cards of higher Hierarchy are deemed to be "stronger" than ones in a lower Hierarchy.

---

## 🤺 The Duel

### 📃 Terminology

**Effect Speed** is defined as **Slow Speed** and **Quick Speed** (analog to Spell Speed 1 and 2 respectively, there is no Spell Speed 3). Quick Speed can respond to Slow or Quick effects, but Slow Speed can't be used to respond to other effects.

**Blue and Red**: Every duel has two opposing sides: Blue and Red. Players must choose which color they belong to at the beginning of the duel in the Setup Phase. Some cards reference Blue/Red Side, in which case they refer to the side controlled by the player(s) of that color. This is applicable to multiplayer rules too.

**Tilemap**: Some cards can create a "Tilemap" which means that, using the artwork of that card as a reference, they create a grid of Tiles (squares) and Obstructions (black lines) for monsters and other cards to be played in. There can only be one Tilemap in the duel at a time.
A monster must be on a specific Terrain to be inside the Tilemap. Monsters inside a Tilemap can only move and attack within Tiles of that Tilemap. If a monster inside a Tilemap were to move or be moved by a card effect to a different Terrain it now moves to a different Tile instead.
- **Tiles**: Within a Tilemap, a Tile is a square in where a monster can be played in. 
    - A monster can only occupy one Tile at a time. 
    - A monster can move or be moved to another adjacent Tile horizontally or vertically (not in diagonal) if an effect allows it and the path between those tiles is not obstructed. 
    - A monster can only attack other monsters that are within one unobstructed Tile from it. 
    - A Tilemap can have Tiles of different colors with different effects, but unless otherwise stated all Tiles are White Tiles. 
    - Red Tiles and Blue Tiles (also known as Player-colored Tiles) are controlled by the respective player(s) of that color. 
- **Obstructions**: Within a Tilemap, an Obstruction is a line that separate one tile from another and prevents a monster to move through it or attack through it, unless otherwise stated. The outer limit of the Tilemap (the white space without tiles) is considered an obstruction that cannot be removed through any means.

**Subduel**: Some cards can declare or interact with a "Subduel" which acts as a completely separate time-gated game created by an effect. It's a game within the game. When a subduel is in place, the players must play and finish that subduel with different cards before returning to the main duel. The result of a Subduel has no meaning or effect on its own on the main duel, unless an effect says so.

**Piercing Damage**: If a monster attacks with an ATK that is higher than the DEF of a monster in DEF Position, the attacking player inflict the difference as Battle Damage.

**Destruction Damage**: If a monster is destroyed by a card effect that says "apply Destruction Damage", then the controller of that monster receives damage equal to half of its ATK (this is called ‘Destruction Damage’ and is considered Effect Damage). You can't inflict more than 1000 LP of destruction damage per turn.

**Erode**: If a card is eroded it means that it is completely removed from play to a non-specified area (its not considered to be on the field, deck, graveyard, hand or zone).

**Permanently**: If a card says to do something permanently it means that that action is done for the remainder of the duel, regardless if the card leaves the field or not. Players must track permanent effects at all times.

**Unstoppable**: used in conjunction with Slow or Quick speed, if an effect is Unstoppable it means it cannot be responded by another card, and it cannot be negated.

**Battle Swap**: change the battle position of a monster.

**Battle Lock**: set the battle position of a monster for a number of turns (if no turn is specified then it's permanent as long as this effect is active). Its controller cannot change its battle position normally.

**Upkeep**: its a maintenance cost to keep the card on the field. Is something that the controller of the card must do or pay in their own Standby Phase, otherwise they must move the card to the graveyard.

---

### 📝 Effect Types

**EQUIP**: An equip effect is active when this card is equipping another target (usually placed in the backrow unless otherwise stated).

**ATTACH**: An attach effects is active as long as the card is attached to another card (which means that is placed beneath it in the same zone of the field).

**DETACH**: This effect is activated if you manually detach (send to the graveyard) this card while attached to another card (this is a Quick Effect unless otherwise stated).

**FLIP**: The effect is activated when this card is flipped face-up (either by battle, by an effect or by manually flipping the card face-up).

**COIN**: Toss a coin and call it. [O] means you were right on your call while [X] means you were wrong. The card itself specifies if the effect activates when you were right or wrong.

**DICE**: Roll a six-sided die, if the result matches what is between brackets you must activate that part of the effect. For example [1] means the result is exactly 1, or [2|3] means the result is either 2 or 3.

**STRIKE**: A monster in ATK Position with STRIKE is able to attack a Terrain Marker instead of a monster. The card may add a specific restriction to what kind of Terrain you can activate STRIKE on. You can only activate a STRIKE once per turn during your Main Phase 1 and you skip the Battle Phase that turn. This is still treated as an "attack" in game mechanics but it doesn't actually battle or destroy any monster currently in the attacked terrain unless otherwise stated.

**EVENT**: _See the Normal Rule Card section of this rulebook._

**STRATEGY**: _See the Setup Rule Card section of this rulebook._

**TERRAINS**: _See the Setup Rule Card section of this rulebook._

**CHANT**: An effect that is activated when you declare that you are about to summon a certain card, and happens before you summon it. If you want more immersion you are allowed (and encouraged) to actually say out loud the "summoning chant" specified in the artwork of the card, although it's not mandatory.

---

### ☕ Clarifications

Some **syntax** clarifications (portraying text of the cards within brackets):
- { only on a "Rulebook" monster } This means a monster that has the word Rulebook in its name.
- { only on "Rulebook" } This means a monster exactly called Rulebook.
- { only on a Rulebook monster } This would mean that Rulebook is a Monster Type.

Effects **cannot miss their timing**. Every "Once per Turn" is a **hard once per turn**. Every optional effect that needs to be activated by the player is also a hard once per turn. Every "Once per duel" is a **hard once per duel**.

To **tribute** a monster is to send it to the graveyard to fulfil a cost or effect, there are no Tribute Summons in this game.

**Surrender Card** is an informal term used for forfeiting. Placing your hand on top of the deck means you surrender the duel.

Cards can be **face-down** on the field when they are **Set** (spells and traps) or **Hidden** (monsters). When you flip a monster face-up you can flip it in either ATK or DEF position. If it's flipped by your opponent it is flipped in the same position it was, unless otherwise stated.

When a card is destroyed its effects are also negated as part of this destruction. Cards and Effects can still be negated normally without the need to destroy them.

During regular combat if the attacked monster changed somehow (it went into hiding, changed control, moved, fused, etc.) a **replay** occurs (meaning the attacking player must choose an attack target again after that first attack was declared).

If you **take control** of a card you must place it on your side of the field unless otherwise stated. If it was a monster you also take control of all the equipped cards to it but they remain on their current zones. To **swap control** refers that a specific player takes control of the card.

If a monster card states that it can **move** or be moved to another Terrain it always refer to an unoccupied Terrain from the controller of the card unless otherwise stated.

Any **italic text** in a card has no effect in gameplay and is only there as flavor text or for clarity reasons.

There are certain cards that can **equip** things other than monsters like "**Equip the Deck**" or "**Equip the Graveyard**". In this case the equipping card remains on its zone and is considered to be equipping/targeting that game zone in its entirety.

Additional notes for **Equipping** and **Attaching**:
- Equipped cards must be placed on the Backrow, while Attached cards must be placed beneath their targeted card. 
- To Equip a card you need an effect that allows you to do so or to have that card be of the Equip Type (Equip Spell or Equip Trap).
- To Attach a card you need an effect that allows you to do so.
- If a card leaves the field, all other cards equipped to it are destroyed (unless otherwise stated), and all cards attached to it are sent to the Graveyard (unless otherwise stated).
- If you attach a card, you also attach any card already attached to that card.

Additional notes for **Hidden** monsters:
- Hidden monsters receive Field Power Bonus normally like face-up monsters.
- You can't equip or attach cards to a monster that is already Hidden. Cards that were already equipped or attached to a Hidden monster stay face-up on the field though.
- Hiding a face-up monster is not considered a summon but a game mechanic.
- Playing a Hidden monster from your hand is considered a summon unless otherwise stated.

---

### ✨ Type Details

> ✨ **Main Card Types**

Represents the four different groups of cards in this game. Every card must have at least one: 
- **Monster, Spell, Trap, Rule**.

> ✨ **Advanced Card Types**

They are used as a prefix to the Main Card Types and fundamentally change the mechanics of how that card is played or interacts. They are detailed in different areas of this rulebook, and are: 
- **Fusion, Ritual, Alter, Integration, Equip, Continuous, Slow, Setup, Symbol, Divine**.

> ✨ **Secondary Card Types**

These types don't have gameplay changes or special rulings on their own, but are used for other cards and rules to achieve different effects or results. They are listed here:

- **(Primary Monster Types)**: Refer to what the monster actually is.
    - **Angel**: (Equivalent to "Fairy") Angels, fairies, sprites, holy beings.
    - **Aquatic**: (Equivalent to "Fish", "Sea Serpent" and partially to "Aqua"). All kinds of water monsters or creatures whose natural habitat is water, without being themselves some sort of embodiment of water itself.
    - **Avian**: (Equivalent to "Winged Beast"). Related in some ways to birds either by being a sub-type of birds or having some bird-like feature, specially wings.
    - **Beast**: Terrestrial beasts of all kinds.
    - **Cosmic**: Related to space and the unknown, including alien-like entities, machines designed for space or otherworldly creatures.
    - **Demon**: (Equivalent to "Fiend"). All types of demons and demon-like creatures. 
    - **Dinosaur**: Big and smol dinos.
    - **Dragon**: (Equivalent to "Dragon" and "Wyrm") A mix of Eastern and Western conceptions of dragons.
    - **Elemental**: (Equivalent to "Rock", "Pyro", "Aqua", "Thunder"). Elementals are concepts made into living forms, be it generic like water, lightning, fire or earth or more specific ones or abstract ones. They are usually referenced with the Attribute.
    - **Esper**: (Equivalent partially to "Psychic"). Paranormal abilities for humanoid monsters sometimes mixed with electronics and some degree of technology, including cybernetic enhanced creatures.
    - **Frost**: Cold-based creatures of all types, related to ice and frost.
    - **Illusion**: Creatures related to mirages, dreams and apparitions.
    - **Insect**: Insects of all sizes. This categorization also includes arachnids, scorpions and other arthropods.
    - **Machine**: Broad type that refers to mechanical constructs, machines and technology in general.
    - **Plant**: Nature based plant-like creatures, be it small ones or overgrown ones.
    - **Reptillian**: Reptiles or reptile-like creatures.
    - **Spellcaster**: Individuals who naturally wield the power of magic, for example magicians, sorcerers and wizards. 
    - **Support**: Individuals that aren't tailored for direct combat but assist allies in different ways. Also living weapons, contraptions or objects like that.
    - **Undead**: (Equivalent to "Zombie"). Group of beings that includes mummies, zombies, skeletons, ghosts, vampires, apparitions, etc.
    - **Warrior**: Super broad type that refers to humanoid fighters and combatants in general.

- **(Secondary Monster Types)**: Refer to what the monster can do (theme-wise) or is affected by.
    - **Absorption**: Is able to absorb into itself other creatures or souls.
    - **Blessed**: Is being favored by a god-like entity.
    - **Burrowing**: Is able to dig and go beneath the ground with ease.
    - **Dampened**: Is currently soaked in water.
    - **Fireblast**: Is able to attack with a large display of fire.
    - **Flying**: Is able to properly fly (not only float or barely move in the air).
    - **Hypnotized**: Is under mind-control.
    - **Infested**: Is affected by something harmful like a parasite.
    - **Music**: Is a user of music powers or is related to music.
    - **Petrified**: Has been turned to stone.
    - **Poisoned**: Is affected by poison or venom.
    - **Protector**: Is able or dedicated to protect others.
    - **Regeneration**: Is able to regenerate wounds or even reverse its own death.
    - **Sealed**: Is sealed through magic or other means.
    - **Slumbering**: Is sleeping or in a deep slumber.
    - **Thunderblast**: Is able to attack with powerful electricity.
    - **Union**: Is made of combined monsters or able to naturally merge with other creatures of the same type.

- **(Alter Monster Types)**: A specific group of types that is exclusive to Alter Monsters.
    - **Ascended**: A monster that embraces the holy power to its fullest and is transformed by it.
    - **Bestial**: A monster that has been turned into a beast or beast-like creature.
    - **Eldritch**: A monster transformed in a living horror through unnatural powers beyond human comprehension.
    - **Fallen**: A monster that has fallen to the allure of dark powers and is transformed by them.
    - **Knighted**: A non-warrior monster now turned into a knight.
    - **Metalized**: A monster covered in an alloy that turns them into a metallic/technological version of itself.
    - **Swarm**: A group or copies/clones of a single monster, represented as multiple monsters on the very same card.
    - **Timeshifted**: An older or younger version of a particular monster, in a different point in time.
    - **Toon**: A "cartoonified" version of a regular monster.
    - **Zombie**: A reanimated non-undead monster that comes back to life as a zombie.

- **(Divine Monster Types / Pantheons)**: A categorization of Divine Monster cards that are related to each other because they belong to the same pantheon of gods: 
    - **Egyptian God**, **Greek God**, **Palace God**, **Storm Guardian**, **Wicked God**.

- **(Hierarchy Value)**: A single number in a unique font at the end of the type line that represents the scale of divinity that Divine card have (from 1 to 7).

- **(Rule Card Types)**: 
    - **Challenge**: A rule representing additional restrictions to the duel itself.
    - **Duelist**: A rule representing the Duelist (player), for example a character from the anime.
    - **Field**: A rule representing a portion or the totality of the field where a duel take place, describing the terrains in scene.
    - **Millennium Items**: A Symbol Rule card featuring one of the seven millennium items.

---

## 🗃️ Other Rules

### 💤 Idleness Rule

During your End Phase, if all the following conditions are true then you get one **"Idle Warning"**:

- Your opponent has at least 1 monster on their side of the field.
- You didn't had at least 1 monster on your side of the field this entire turn.
- There wasn't an effect preventing or negating your summons this turn.

If you already had an **"Idle Warning"** prior to this turn then you lose the Duel by game mechanics instead.

---

### 🤝 Multiplayer Rules

A **Team Duel** is what happens when more than two opposing players take part in a duel. There are three types: Tag Duels, Boss Duels and Battle Royale Duels.

The main difference between regular duels and Team Duels is that a **Rotation** of turn order must be defined during the Setup Phase, based on the type of team duel used and the number of players. As a general rule, the Rotation order always iterates between teams first, and then further than teams it iterates between each player of the team.

Only the last player in the Rotation is allowed to declare an attack in the first round of a Team Duel.

Unless otherwise stated the life points and gameplay zones (field, graveyard, hand, main deck, extra deck, rule zone) belong to each player and behave like in a regular duel.

**🤝🏾 Tag Duels** are 2v2 duels of teams fighting each other:
- The Rotation is: TeamAPlayer1 → TeamBPlayer1 → TeamAPlayer2 → TeamBPlayer2.
- If one player is defeated the whole team is defeated.
- Players in a team have a shared field of 10 Frontrow and 10 Backrow.
- Even in the shared field each player controls their corresponding zones and cards.
- Teammates can reveal some secret information between them in the shared areas (face-down cards) but not in the private areas (like hand and extra deck cards).
- Your teammate can allow you to use their cards during your turn for summoning conditions, but not for attacks, battle position changes or movement.

**🐲 Boss Duels** are a "one vs many" duel, where the "many" join forces into a team:
- The Rotation is: SoloPlayer → TeamPlayer1 → SoloPlayer → TeamPlayer2...
- The team players share LP and the board (field, graveyard and rule zone) but each still has their own Deck and Extra Deck. 
- The team players collectively control the zones and cards in that side of the field, except the cards in the Rule Zone that are still individually controlled.
- The team players must also agree to play a single TERRAINS effect, not one for each player.

**⚔️ Battle Royale Duels** are free-for-all duels of 3+ participants without specific allies, everyone is technically considered an opponent here:
- The Rotation is: Player1 → Player2 → Player3...
- If a player is defeated: the rotation adjusts removing that player. Cards owned by that player that are controlled by other players stay in the field.
- Once per round, a player can redirect an attack that targets a monster controlled by another player to a monster they control (that is able to move), and if it does, the attacking monster cannot be destroyed by that battle and the controller of that attacking monster takes no damage from that battle.
- A player can allow you to use their cards during your turn for summoning conditions, but not for attacks, battle position changes or movement.
- A player can join a Battle Royale at any point by taking damage equal to half of its starting LP, and inserting themselves as next in the rotation.
- After at least one player is defeated, at any point the remaining players can unanimously declare that the duel is over (and they are considered the winners) if they dont want to keep dueling eachother.

---

### 🔧 Deckbuilding Rules

These are the general rules for building your deck to play:
- A **Main Deck** with exactly **30** cards (containing Spell cards, Trap cards and Normal Monster cards).
- An **Extra Deck** with up to **20** cards (containing Rule cards and Extra Deck Monster cards).
- Your Main Deck must be **Singleton**, meaning that you can only have 1 copy of each card in your Main Deck. But as an exception you can have **up to 1 card with up to 3 copies** and **up to 1 other card with up to 2 copies** in your Main Deck.
- You must follow the **[Restricted List](/restricted-list/)**, as there are certain cards that have additional restrictions to be included in a deck.

As an additional note, take into account that the Duelist Setup Rule cards allow you to have in your decks any card listed in its "STRATEGY", ignoring the Restricted List limitations in deckbuilding. And if you want, you can add one or more Challenge Setup Rule cards to spice up a bit your deckbuilding skills (this is entirely optional).

*Note: Additional deckbuilding limitations may be needed depending on the match-up or the players. Kingdom Duels is by nature an unbalance game so feel free to adjust the banlist/restrictions if you feel like it in the interest of a more fair gameplay experience.*

---

## TL;DR

Regular Yugioh but...
- 2000 LP. Starting hand of 5, draw 1 each turn (even in the first turn).
- The Board has 5 monster zones and 5 spell/trap zones. No link/pendulum/field zones.
- Rule Cards exist (which are Extra Deck cards that change how the game is played).
- Setup Rule cards must be played in the Setup Phase: Your Field Setup define your terrains. You can change up to 2 cards from your starting hand with cards from your Duelist Setup "strategy".
- Terrain Markers exist (they go between the monster zones and the cards). They can give effects and "Field Power Bonus" to monsters on them.
- You can summon normal monsters of any Level without a tribute.
- You can play monsters in face-up DEF. 
- You can't Set monsters (you "Hide" them instead, but you can only Hide monsters in face-down ATK or face-down DEF if an effect lets you).
- No direct attacks. Can only attack once per battle phase. Attacks can be redirected.
- Instead of banish there is "erode" which is a more permanent removal.
- If you are repeatedly idle by not playing monsters you'll lose.
- Normal Spells are usually quick speed (Equip and Continuous are usually slow speed).
- Traps are (mostly) triggered automatically.
- Extra Deck monsters include: Fusions, Rituals, Alters, Integrations, Tokens. 
- There are Spell-Trap-Monster combinations and even Divine cards.

---
