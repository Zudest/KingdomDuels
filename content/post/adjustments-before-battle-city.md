+++
date = '2025-06-15T14:22:00-03:00'
title = 'Some changes coming before Battle City'
categories = ['Updates']
image = "/img/post/post0030.jpg"
+++

Hello Duelists, we have a large update today. After completing all the sets related to the Museum Arc it was clear that some things were working and some things were not. We are making some structural and quality-of-life changes to the game based on what we've learned. The goal with these changes is to keep improving the rulebook and new-player-onboarding, eliminating inconsistencies, and building a solid structure for future cards.

_Note: If you've already printed cards, don't worry! the large majority of these changes are related to Rule Cards and rulings in general that exist outside of the cards themselves. 90% of the cards won't be impacted at all by this other than the id-number changing._

---

## Size and Frequency of Set Releases

Before the Museum Arc we established a 70-card set limit to better accomodate Tabletop Simulator releases. This didn't yield great results, so we're reverting to a structure closer to what we had before. Releasing 7 sets per arc also came with its own problems, mainly in: properly slotting story duels and character cards, a feeling of too-much-filler per set, lack of impact and wasting too much time dealing with Tabletop Simulator instead of using that time to create more cards.

The reality is that card development needs to speed up: it took me about 7-months to release sets #8 to #14, which is way too slow. **We are now aiming to have 2 sets per arc instead of 7, removing the card limit for each set.**

Fewer releases per year gives both players and myself some breathing room. It also allows for larger-scale design projects without constantly needing to patch older sets due to new mechanics. The goal is of-course to reduce the 7-months-per-arc with this, because otherwise we are looking at almost 2 years to complete the Duel Monster adaptation, and that to me feels too much.

This approach is closer to traditional game releases, which feature much larger sets (eg. for draft formats). Each set here will probably contain roughly 150–250 cards, themed around the arc's story, but not necessarily locked to exactly half of the arc's chapters.

Main issue with this change would be the lack of the monthly card previews, but i hope to keep 'em rolling ocassionally (even if their are more "work in progress" than nowadays) and introduce other ways for you guys to feel involved in the project as we go.

In conclusion: 2 sets per Arc instead of 7 (to be implemented with the first Battle City set, and applied retroactively).

---

## Rulebook Changes

- **Hierarchy**: After some dicussion, the natural protection rule is being removed from divine cards to go in-line with the changes we made to types/traits last year. The Hierarchy only serves now as a value that can be referenced by card effects.

- The **Hierarchy Scale** is also being adjusted from a 1–10 range to a 1–7 range. Cards will be adjusted accordingly.

- **Tokens** now belong to the Extra Deck and should be considered during deckbuilding. Not a lot changes here other than them having a proper place.

- New terminology "**Combination Cards**": a rulebook term that unifies Spell Traps, Spell Monsters and Trap Monsters. This is only for clarity and has no effect on gameplay or card text.

- **Emblem** cards were removed, as they served no purpose really. 

- **Card Type Clarifications**: In the rulebook we are adjusting the card types to be more consistent and avoid confusion: 
    - **Main** Card Type (one of the four main types of cards in the game, each card has to have at least one of these: Rule, Spell, Trap, Monster).
    - **Advanced** Card Type (used as a prefix with the main type, they introduce new mechanics and special interactions, they are: Fusion, Ritual, Equip, Continuous, Setup, Divine, etc.)
    - **Secondary** Card Type (they do nothing on their own but can be used for other card effects, they include all the monster types (beast, spellcaster, poisoned, toon, etc.), hierarchy value, divine pantheon, rule types, etc.)

- **Text Effect Clarity**: Some quality of life changes like normalizing italics as flavor text for effect names, changing the charge cost of symbols or replacing the words with underscore with all caps words which are called "effect types", etc.

- **Spell & Trap Speed Changes**: While most Continuous and Equip cards are Slow Effects (like it says in the rules) this is not universal. Persist cards are usually Quick, and Normal spells are also sometimes Slow. This ends up being confusing. We are now introducing the "**Slow**" card type, which directly states the speed of the card's activation as Slow Speed. This change removes redundant text in the effect box and reduces confusion about which cards can be played quickly and which cannot. The new rule basically says: All Spell and Trap cards are Quick Speed unless they are marked as "Slow."

- **Persist & Continuous**: With the addition of the Slow card type, card speed is now more clearly defined and therefore we are **removing the "Persist" type**, integrating it into Continuous Spell/Trap cards. The "Continuous" condition will now be explicitly written in the textbox ("Persists until..."). If nothing is stated, the card remains on the field indefinitely. This unification makes our card types more consistent and easier to explain to new players.

- **Singleton**: Now that we have more cards, we are finally fulfiling on this promise and are changing the deckbuilding rules to become "singleton". This means a player can only have **1 copy of each card in the Main Deck**. That said, the rules also allow players to have 1 card with up to 3 copies and 1 card with up to 2 copies. This, combined with the "Surplus" section of the Restricted List, should make deckbuilding more in line with the original vision of the game: losing deck consistency for variety, while keeping some strong core cards consistent.

---

## Rule Card Changes

One of the main culprits of the amount of set filler that we saw was the overabundance of Rule Cards. Specifically the amount of similar-looking Duelist Setup Rule cards that dilute the whole set with uninteresting cards that end up being skipped over when looking at a new set. For this reason we made some big changes to the whole structure of Rule Cards to present them in a better way for all players:

### Normal Rule Cards

For normal Rule Cards we replaced the two concepts of "KEYWORD" and "RELIANCE" with a single concept "**EVENT**". Now, Normal Rule Cards will all work the same way: "if the EVENT condition is true you can activate this card to the Rule Zone, if it stops being true then this card returns to the Extra Deck". 

Some examples of Event conditions could now be: "there is a ??? monster on the field" (which replaces the KEYWORD mechanic), or "you control ??? card" (replacing the RELIANCE mechanic), or even "you played ??? card" (for the RELIANCE mechanic that works in activation only).

This will make the whole concept more clear and connected without having to re-check what the heck are the RELIANCE/KEYWORD or how they work.

### Setup Rule Cards

Setup Rule now all work the same way: **they can only be activated in the Setup Phase**. That's it, that's the main thing they do. Further clasifications like Duelist, Field or Challenge have their own explanations below but are more tied to the card effect itself and not directly to the type. This way we avoid confusion and Setup specific sub-rules to keep track of during the game. 

### Challenge Setup Rule Cards

Game Setup Rules have been combined into **Challenge Setup Rules**. They no longer have a limitation of playing only one of them per game. They still change how the game is played in a big way, and many of them will have a requirement to be accepted by all players in order to be played, but it is not a mandatory clause in the card type anymore which was limiting design-space.

### Field Setup Rule Cards

For clarity-sake we are changing the underlined "Terrain:" word with "**TERRAINS**:" to keep it consistent with other effect types. A player can only activate one "TERRAINS" effect in the Setup Phase.

We are also removing the Matched Field mechanic (and duplicate cards that used them), replacing it with specific Field cards that allow a player to choose either Red or Blue side. This way a player could still pick a Matched Field (like the duel arenas in the anime) and maybe have their opponent pick the other side, without requiring both players to have the same card.


### Duelist Setup Rule Cards

After extensive review we've concluded that Duelist Setups are **flawed** as a concept. They feel irrelevant to the actual gameplay, despite attempts to add more functionality to them over time (which resulted in a different problem of them trying to do too many things at once):

- (1): They try to reference the anime duels, listing every card each character played. This leads to a large number of them per set. As the game expands, the main cast will accumulate more and more of these cards (most of which will end up being very similar). Visually, the artwork also becomes repetitive due to the recurring use of the same character image.
- (2): They aim to ignore the Restricted List, but we don't have a ton of control over which card is included because they are linked to the anime duel, making it impossible to edit or update later if needed unless we change the duel.
- (3): They aim to manipulate the starting hand, but with so many Duelist Setups available per player, there's no clear logic on which one to include in a deck. Some setups will always be better than others simply for listing more useful cards.

The main problem is that they lack a clear purpose. If you want to make a Yugi deck... which Duelist Setup do you pick? Does it even matter? Do you have to check what he played in each duel and see if any of it is useful for your starting hand? If we feel like this with ~20 Yugi cards, what will happen when we have ~60 of them?

So, from now on, **Duelist Setups will no longer reference individual anime duels**. Instead, they'll focus solely on their two functional roles: Restricted List Protection and Starting Hand Manipulation.

The underlined "Cardlist" concept is replaced with **STRATEGY**, which will still include a list of cards, but curated by us and centered around a specific strategy for each duelist. A player can only activate one "STRATEGY" effect in the Setup Phase.

Also, each Duelist Setup will now feature unique artwork to make them easier to identify, maintaining the visual idea of different outfits or themes we've used so far. Ideally, a new Duelist Setup should only be created when a duelist refines or adopts a different strategy, not for every single duel (since duelists don't usually change their decks between duels). For example, for Pegasus, we could have something like "STRATEGY (_Toon Mayhem_):..." and another card with "STRATEGY (_Illusionism_):..."

With these changes, we aim to reduce the number of Duelist Setups significantly, keeping only those that offer meaningful and interesting options for players. 


### Symbol Rule Cards

Previously we talked about removing Emblems from the game. In truth what we are doing is **combining Emblems into Symbols**. They will remain as an entirely optional card sub-type to use, but they now will have the light-yellow frame of the Emblems so it will be easier to distinguish them from the regular Rule cards in the Extra Deck.

Their mechanics will remain the same, but we will be aiming to design them to be more experimental, with effects that go beyond the regular game. Expect some 4th-wall breaking and effects more similar to Un-sets from MTG with these type of cards.


---

## Expansion Sets (Community Cards)

We'll soon be kicking off the process to create the **first Expansion Set**: a chance for the community to design cards to be included in the game! I'll be preparing the plan for this in the coming weeks.

---

## TL;DR:

- 2 sets per story arc instead of 7, with no limit on amount of cards per set. Less frequent set releases but more impactful.
- Hierarchy has no natural protection anymore, the scale is changed to 1-7.
- Tokens go to the Extra Deck now.
- Card types reorganized, some were removed and some were added. For example the "Slow" type was added for spell and traps to make it easier to see when a card is Slow Speed or not. 
- "Persist" cards are transformed into "Continuous" cards which can now have the Persist clarification in the textbox.
- Singleton rule for deckbuilding (with some exceptions).
- Normal Rule cards have EVENT replacing both KEYWORD and RELIANCE.
- Setup Rules simplified. Game Setup are combined into Challenge Setup Rules. Matched Fields removed. TERRAINS as an effect can be picked by the other player (replacing Matched fields). Duelist Setups will be revamped, focusing on STRATEGY effects instead of anime duels tracking.
- Symbol Rules are now light-yellow and have been combined with Emblems, focusing on weird and optional gameplay.
- We will start working on community sets soon.
