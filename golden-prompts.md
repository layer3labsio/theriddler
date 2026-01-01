# Golden Prompts: The Riddler Game

These prompts are designed to showcase the capabilities of "The Riddler" game integration ensuring the widget is invoked correctly and the user gets the best experience.

## 1. Direct Play Request
**User:** "Let's play a riddle game."
**Expected Behavior:** The model calls `the-riddler` with NO arguments.
**Why it's golden:** It's the simplest, most direct path to the core value proposition.

## 2. Specific Category Request
**User:** "I want to solve some math riddles."
**Expected Behavior:** The model calls `the-riddler` with `{ "riddle_category": "Math" }`.
**Why it's golden:** Tests the model's ability to map natural language intent ("math riddles") to the specific enum parameter `riddle_category`.

## 3. Language Preference
**User:** "Tienes algún acertijo en español?"
**Expected Behavior:** The model calls `the-riddler` with `{ "riddle_language": "Spanish" }`.
**Why it's golden:** Verifies the multi-language support and parameter extraction from a non-English query.

## 4. Difficulty Challenge
**User:** "Give me a really hard logic puzzle."
**Expected Behavior:** The model calls `the-riddler` with `{ "riddle_level": "Hard", "riddle_category": "Logic" }`.
**Why it's golden:** Tests handling of multiple parameters (Level + Category) simultaneously.

## 5. Contextual Follow-up
**User:** "I'm bored, do you have any games?"
**Expected Behavior:** The model suggests the Riddler game and proactively calls the tool e.g. `the-riddler` with default arguments.
**Why it's golden:** Shows the agent's ability to offer the tool as a solution to a vague user need.