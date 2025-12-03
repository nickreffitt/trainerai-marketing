# Functional Specification: AI-Powered Personal Trainer SaaS

## 1. Problem Statement

### Existing Market Landscape
Products like **Trainerize** and **Kahunas** have established the white-label personal trainer SaaS market, providing solid foundations for workout programming, client management, and basic progress tracking.

However, these platforms have critical gaps that limit their effectiveness:

### **Gap 1: No Goal-Oriented Long-Term Planning**
- **Current State**: Trainers create workout and nutrition plans week-by-week or month-by-month with no integrated strategy toward a specific, measurable outcome. Plans are generic templates, not personalized progressions.
- **Missing Capability**:
  - **Specific, measurable goals with deadlines**: "Increase back squat 1RM by 10kg in 6 weeks" or "Complete half Hyrox simulation in under 30 minutes by March 1st" or "Reduce zone 2 heart rate by 5% in 12 weeks"
  - **Integrated workout + nutrition + recovery planning**: AI-generated plans that align all three pillars toward the goal
  - **Periodization and progressive overload**: Structured phases (hypertrophy → strength → peaking) with planned progression
  - **Holistic approach**: Nutrition plan calibrated to fuel the specific goal (e.g., calorie surplus for strength, carb timing for endurance)
- **Impact**:
  - Clients don't see connection between today's workout and their 3-month goal → low motivation
  - PTs spend hours manually planning periodized programs for each client
  - No systematic progression → clients plateau or overtrain
  - Nutrition is treated separately from training, not as integrated fuel for goal achievement
  - **Example**: Client wants to add 10kg to back squat in 6 weeks. Trainer has to manually:
    - Design 6-week periodized squat program (volume phases, intensity phases, deload, peak)
    - Calculate nutrition needs (calorie surplus, protein targets, carb timing)
    - Plan recovery strategies (sleep targets, deload weeks)
    - Adjust weekly based on progress
    - **This takes 2-3 hours per client per goal** and requires deep exercise science knowledge

### **Gap 2: Static, Inflexible Plans**
- **Current State**: Workout plans are rigid - if a client goes to a different gym without a specific machine, or doesn't have equipment at home, they're stuck
- **Missing Capability**:
  - Intelligent exercise substitution based on available equipment
  - AI suggestions for alternative exercises targeting the same muscle groups/movement patterns
  - Contextual awareness (home gym vs. commercial gym vs. hotel gym vs. crowded gym)
- **Impact**: Clients skip workouts entirely or make poor substitutions that derail their progress. PTs field constant "what should I do instead?" messages.

### **Gap 3: No Real-Time AI Coaching Layer**
- **Current State**: All plan adjustments require manual PT intervention. If a client is injured, sleeping poorly, experiencing high stress, or struggling with motivation, they must wait hours or days for their trainer to respond and manually adjust the plan
- **Missing Capability**:
  - **AI coach that understands plain English**: Clients can write "I tweaked my shoulder today" or "I've been getting 4 hours of sleep this week" or "My knee hurts during lunges"
  - **Automatic plan adjustments**: AI modifies workouts based on client feedback (reduce volume, substitute exercises, modify intensity, suggest deload)
  - **Immediate encouragement and support**: Motivational coaching without waiting for PT response
  - **Intelligent data inference**: Extract injury status, sleep quality, stress levels, nutrition adherence from natural language and adjust the plan accordingly
  - **PT oversight**: Trainers review and approve AI changes, maintaining control while reducing repetitive work
- **Impact**:
  - Clients train through injuries, leading to longer recovery times
  - Clients quit when they hit obstacles and don't get timely support
  - PTs spend hours responding to routine questions ("can I do goblet squats instead of back squats?", "I'm tired today, should I still work out?")
  - No immediate feedback loop means clients lose motivation between weekly check-ins
  - PTs can't scale beyond 15-20 clients due to constant manual intervention needs

### The Opportunity

Build a **next-generation personal trainer platform** that provides:
1. **Goal-driven AI planning**: "I want to squat 110kg in 6 weeks" → AI generates integrated 6-week workout + nutrition + recovery plan with periodization, progressive overload, and milestone tracking
2. **Adaptive intelligence**: Real-time exercise substitutions, equipment-based alternatives, and dynamic plan modifications
3. **AI coaching layer**: Instant feedback, plan adjustments, and support based on client natural language updates, with PT oversight and final approval

This creates a scalable, intelligent system where:
- **Clients** get personalized plans that **actually work toward specific goals** with clear daily actions and milestone tracking
- **Clients** get adaptive coaching 24/7 with immediate responses to obstacles (equipment, injuries, recovery, motivation)
- **Trainers** save 10+ hours/week on manual plan creation and routine adjustments, enabling them to serve 3-5x more clients
- **Outcomes** improve through scientifically-structured progressions that adapt to real-world constraints and client feedback

---

## 2. Core User Roles

### Personal Trainers
- Set client goals and baselines
- Review and approve AI-generated plans before publication
- Oversee AI coaching adjustments (approve/modify/override)
- Provide strategic coaching and check-ins
- Monitor client progress and analytics
- Configure AI autonomy levels per client

### Clients
- Receive goal-based workout and nutrition plans
- Provide natural language updates (injuries, fatigue, equipment constraints)
- Get real-time AI feedback and plan adjustments
- Complete adaptive workouts with intelligent exercise substitutions
- Track nutrition and sync health data
- Communicate with trainer

### Admin (White-Label)
- Configure branding (logo, colors, domain)
- Manage trainer subscriptions and tiers
- Handle billing and client limits
- System configuration and support

---

## 3. Key Features

### 3.1 Intelligent Exercise Substitution ⭐ **Core Differentiator**

**Problem Solved**: Static plans fail when clients don't have access to prescribed equipment or gym is too crowded

**Functionality**:

**Equipment Profiles**:
- Client sets available equipment during onboarding: barbell, dumbbells, kettlebells, resistance bands, machines, bodyweight, etc.
- Equipment profile can be updated per session (e.g., "traveling this week" → hotel gym mode)

**Real-Time Substitutions**:
- Client opens workout: "Barbell back squat 4x6 @ 80kg"
- Client taps "I don't have this equipment" or "This equipment is busy"
- AI instantly suggests alternatives:
  - **Bulgarian split squats** (dumbbells) - "Unilateral quad and glute focus, similar loading pattern"
  - **Goblet squats** (kettlebell/dumbbell) - "Quad dominant, easier on lower back"
  - **Leg press** (machine) - "Same muscle groups, fixed movement pattern"
- Client selects alternative
- AI adjusts sets/reps/intensity to match training stimulus: "Leg press 4x8 @ RPE 7-8 (slightly higher reps to match quad stimulus)"

**Contextual Switching**:
- Client: "I'm traveling this week"
- AI: "Switching to bodyweight/hotel gym alternatives for this week's workouts"
- Automatically replaces all equipment-dependent exercises

**Muscle Group Targeting**:
- AI maintains training stimulus even with substitutions
- Preserves movement patterns (squat → squat variation, hinge → hinge variation)
- Balances bilateral vs. unilateral work

**Technical Approach**:
- Exercise database with rich metadata:
  - Primary/secondary muscle groups
  - Movement patterns (squat, hinge, push, pull, carry, etc.)
  - Equipment requirements
  - Difficulty progression levels
  - Biomechanical similarity scores
- Vector embeddings for semantic exercise matching
- Constraint satisfaction algorithm to maintain weekly volume and intensity targets

---

### 3.2 AI Coaching & Natural Language Processing ⭐ **Core Differentiator**

**Problem Solved**: Clients need immediate feedback and plan adjustments, but PTs can't respond 24/7 to routine questions

**Functionality**:

#### A. Natural Language Injury/Pain Updates

**Client Input**: *"I tweaked my lower back during deadlifts today, feeling tight"*

**AI Processing**:
- Extracts injury: Lower back strain
- Identifies affected exercises: Deadlifts, squats, bent-over rows, RDLs
- Determines action: Remove/modify spinal loading for 3-7 days

**AI Response**:
```
I've adjusted this week's plan to protect your lower back:
- Replaced deadlifts → leg press (quad focus)
- Replaced RDLs → hamstring curls (isolated, no spinal load)
- Reduced squat depth → box squats (controlled range)

How's your pain level 1-10? If it's above 5, let's remove squats too.
```

**PT Notification**: "Client X reported lower back tweak. AI modified 3 exercises. Review changes?"

---

#### B. Recovery & Fatigue Management

**Client Input**: *"I've been sleeping 4-5 hours this week, feeling exhausted"*

**AI Processing**:
- Extracts sleep data: 4-5 hours (below optimal 7-9)
- Infers recovery capacity: Low
- Action: Reduce training volume 20-30%, lower intensity, add rest day if needed

**AI Response**:
```
Poor sleep = poor recovery. I've lightened this week:
- Reduced volume by 30% (3 sets → 2 sets)
- Lowered intensity (RPE 8 → RPE 6-7)
- Added extra rest day Thursday

Your back squat goal needs recovery. Can you prioritize 7+ hours sleep tonight?
```

---

#### C. Motivational Support & Adherence

**Client Input**: *"I don't feel like working out today"*

**AI Processing**:
- Sentiment analysis: Low motivation
- Retrieves recent progress: +5kg squat in 3 weeks
- Action: Encourage + offer modified session

**AI Response**:
```
I get it. You're 3 weeks in and already up 5kg on your squat - that's solid progress.

Even a light session today keeps momentum. Want to do a 20-minute version?
- 2 exercises instead of 5
- 2 sets instead of 4
- Focus on technique

Or take the rest day and crush it tomorrow?
```

---

#### D. Data Extraction from Free Text

**Client Input**: *"Crushed my workout but only ate 1800 calories and 80g protein today"*

**AI Processing**:
- Extracts: Workout completed ✓, Calories: 1800, Protein: 80g
- Compares to plan: Target 2200 cal, 150g protein
- Flags: 400 cal short, 70g protein short

**AI Response**:
```
Great work on the workout! 💪

You're 400 cal and 70g protein short today. Quick fix before bed:
- Protein shake (30g protein) + 2 tbsp peanut butter = 500 cal, 40g protein

That gets you close to target. Protein is critical for your squat gains.
```

---

#### E. Equipment/Logistics Issues

**Client Input**: *"My gym doesn't have a leg press and all the squat racks are taken"*

**AI Processing**:
- Understands: Equipment constraint (leg press unavailable) + crowding issue
- Action: Suggest alternatives requiring less/different equipment

**AI Response**:
```
No problem. Here are alternatives that don't need a rack:

1. **Dumbbell Bulgarian split squats** - Best option, hits quads hard
2. **Walking lunges** (dumbbells) - Great for quads + glutes
3. **Goblet squats** (kettlebell) - Easier to find free weight

Which equipment do you have access to?
```

---

#### F. PT Oversight & Control

**AI Autonomy Levels** (set by PT per client):
1. **Full Auto**: AI makes adjustments, notifies PT after
2. **Review Required**: AI suggests changes, PT approves before client sees
3. **Suggestions Only**: AI provides options, client waits for PT decision

**PT Dashboard**:
- Feed of all AI interactions
- Pending approvals (for Review Required mode)
- Flagged conversations (injuries, significant plan changes, client frustration)
- Override controls (PT can modify or reject AI suggestions)

**Guardrails**:
- AI never ignores serious injuries (always flags to PT immediately)
- AI won't adjust goals without PT approval
- AI won't remove exercises entirely without offering alternatives
- AI escalates to PT if client reports severe pain, dizziness, chest pain, etc.

**Technical Approach**:
- Large Language Model (GPT-4) with domain-specific fine-tuning on PT-client conversations
- Named Entity Recognition (NER) for extracting:
  - Injuries and pain locations
  - Sleep duration and quality
  - Nutrition data (calories, macros)
  - Equipment availability
  - Sentiment and motivation state
- Rule-based safety system (hard-coded escalation triggers)
- Retrieval-augmented generation (RAG) for accessing client history, current plan, and progress data
- Structured output parsing to update plan database

---

### 3.3 Goal-Oriented Plan Generation (Feature Parity)

**Problem Solved**: Matches competitor capabilities for long-term goal planning

**Functionality**:

**Goal Types**:
- **Performance**: Achieve specific strength targets (e.g., +10kg back squat in 6 weeks, 100kg bench press)
- **Endurance**: Time/distance goals (e.g., sub-30 minute half Hyrox, run 5k under 25 min)
- **Health Metrics**: Physiological improvements (e.g., reduce zone 2 heart rate by 5%, lose 5kg body fat)

**Goal Attributes**:
- Target metric (specific, measurable)
- Current baseline (e.g., current 1RM squat: 100kg)
- Deadline (4-16 weeks)
- Measurement frequency (weekly check-ins, bi-weekly tests)

**AI Plan Generation**:

**Input**:
- Goal type and timeline
- Client baseline metrics
- Training history and experience level
- Injury history and limitations
- Available equipment
- Preferred training frequency (3-6 days/week)

**Output - Workout Plan**:
- Periodized program structured in 4-week mesocycles:
  - **Hypertrophy phase** (weeks 1-2): Higher volume, moderate intensity
  - **Strength phase** (weeks 3-4): Lower volume, higher intensity
  - **Peaking phase** (week 5): Reduced volume, max intensity
  - **Test/Deload** (week 6): Goal assessment or recovery
- Progressive overload strategy (weekly progression in weight/reps)
- Exercise selection based on goal specificity
- Deload weeks for recovery

**Output - Nutrition Plan**:
- Macro targets calibrated to goal:
  - Strength gain: Slight calorie surplus (+200-300 cal), 1.8-2.2g/kg protein
  - Endurance: Moderate carbs, balanced macros
  - Fat loss: Calorie deficit (-300-500 cal), high protein (2g/kg)
- Daily calorie targets
- Meal timing suggestions (pre/post-workout nutrition)
- Macro cycling (higher carbs on training days)

**Weekly Release Schedule**:
- Each week published **3 days before start** (e.g., Thursday for Monday start)
- Gives clients time for grocery shopping and meal prep
- Notification sent when new week is available

**Trainer Review Workflow**:
1. AI generates full plan
2. PT receives draft in review dashboard
3. PT edits:
   - Swap exercises
   - Adjust volume/intensity
   - Modify nutrition targets
   - Add notes/instructions
4. PT approves → plan published to client

**Technical Approach**:
- LLM (GPT-4) with structured prompts for:
  - Exercise science principles (progressive overload, periodization)
  - Nutrition protocols (calorie/macro calculations)
- Knowledge base of training templates for common goals
- Integration with exercise database for contextual exercise selection
- Feedback loop: Client progress data refines future plan suggestions

---

### 3.4 Health Data Integration

**Problem Solved**: Objective tracking of client effort and recovery beyond self-reporting

**Functionality**:

**Apple Health (iOS) Integration**:
- **HealthKit API** for automatic data sync:
  - Heart rate (resting, average, max, variability)
  - Active calories burned
  - Workouts (type, duration, calories)
  - Sleep (duration, quality stages)
  - Steps and distance
- Permissions requested during onboarding
- Real-time or daily batch sync

**Google Fit (Android) Integration**:
- **Fit REST API** for equivalent metrics
- Same data points as Apple Health
- OAuth authentication

**AI-Powered Insights**:
- Pattern detection:
  - *"Your resting heart rate has been elevated 10% this week - possible overtraining or illness. Consider a deload."*
  - *"Sleep averaged 5.5 hours this week vs. 7.5 last week - recovery is compromised."*
  - *"Active calories are 30% below target this week - missing workouts or low intensity?"*
- Automatic flags to PT when metrics fall outside normal ranges

**Dashboard Visualization**:
- Heart rate trends over time (zone 2 progression for endurance goals)
- Weekly active calorie burn vs. target
- Sleep quality correlation with workout performance
- Step count and NEAT (non-exercise activity thermogenesis)

**Privacy & Control**:
- Clients control which metrics to sync
- Data encrypted at rest and in transit
- HIPAA compliance considerations for health data

---

### 3.5 Progress Analytics

**Problem Solved**: Clear visibility into goal trajectory and adherence for both PT and client

**Functionality**:

**Goal Progress Dashboard**:
- **% to Goal**: Visual progress bar (e.g., "60% to +10kg squat goal")
- **Trajectory Prediction**: AI forecasts goal achievement based on current rate
  - *"On track to hit goal 1 week early"*
  - *"Trending 5% behind - may need 2 extra weeks"*
- **Milestone Tracking**: Weekly micro-goals (e.g., +2kg squat every 2 weeks)

**Performance Metrics**:
- **Strength**: 1RM estimates, total volume lifted per week, progressive overload graph
- **Endurance**: Time/distance improvements, heart rate at given pace, VO2 max estimates
- **Body Composition**: Weight trends, estimated body fat % (if tracked)

**Adherence Tracking**:
- **Workout Completion Rate**: % of planned sessions completed
- **Macro Compliance**: Daily/weekly average vs. target (calories, protein, carbs, fat)
- **Consistency Streaks**: Days in a row with workouts/nutrition compliance

**AI-Generated Insights** (for PT):
- *"Client X is 10% ahead of pace for squat goal - consider increasing load next week"*
- *"Client Y has missed 3 workouts this week - low adherence, possible motivation issue"*
- *"Client Z's protein intake is 40% below target - impacting recovery"*

**Comparative Analytics**:
- Client performance vs. initial baseline
- Client performance vs. similar goal profiles (anonymized benchmarks)

**Export & Reporting**:
- Weekly progress reports (PDF/email)
- Custom date range exports for PT review

---

### 3.6 Nutrition Tracking

**Problem Solved**: Close the loop on nutrition adherence, which is often the weakest link

**Functionality**:

**Daily Macro Logging**:
- Manual entry: Food name, portion, macros (calories, protein, carbs, fat)
- **AI-Assisted Entry**:
  - Text: *"2 eggs, whole wheat toast, avocado"* → AI estimates macros
  - Photo: Upload meal photo → AI identifies food and estimates macros (future enhancement)
- Quick-add common foods and saved meals
- Barcode scanner for packaged foods

**Meal Planning Suggestions**:
- AI suggests meals that fit remaining daily macros:
  - *"You need 600 cal, 40g protein for dinner. Try: grilled chicken breast (8oz), sweet potato, broccoli"*
- Recipe database with macro breakdowns
- Grocery list generation based on weekly meal plan

**Progress vs. Plan**:
- Daily macro targets with real-time progress bar
- Weekly compliance score: % of days hitting macro targets (±10% tolerance)
- Visual charts: Actual vs. target calories, protein, carbs, fat

**Integration with Workout Plan**:
- Higher carb targets on heavy training days
- Adjusted calories on rest days
- Pre/post-workout meal reminders

**AI Coaching for Nutrition**:
- Client: *"I'm always 50g protein short"*
- AI: *"Add a protein shake (30g) + Greek yogurt (20g) to breakfast. That closes the gap."*

---

### 3.7 Communication

**In-App Messaging**:
- Direct chat between trainer and client
- Message threading and notifications
- File attachments (form check videos, progress photos)

**AI Coach Messages**:
- All AI coaching interactions visible to PT
- Client can toggle "AI Coach" on/off
- PT can step into AI conversations and take over

**Plan Notes & Instructions**:
- PT adds context to workouts: *"Focus on tempo today - 3 sec eccentric on squats"*
- Exercise-specific cues: *"Keep chest up, drive through heels"*
- Weekly themes: *"Deload week - RPE should feel easy"*

**Notifications**:
- New plan published (3 days before week starts)
- PT messages
- AI coaching updates
- Missed workout reminders
- Macro target reminders

---

### 3.8 White-Label Features

**Custom Branding**:
- Upload logo (app icon, dashboard header)
- Color scheme (primary, secondary, accent colors)
- Custom domain (e.g., trainer.johnsmithfitness.com)
- Email templates with trainer branding

**Trainer Subscription Tiers**:
- **Starter**: 10 clients, basic AI features, $49/month
- **Pro**: 50 clients, full AI autonomy, analytics, $149/month
- **Elite**: Unlimited clients, white-label domain, priority support, $299/month

**Client Limits & Billing**:
- Overage charges: $5/client/month beyond tier limit
- Trainer sets client pricing (platform takes % commission or flat fee per client)

**Admin Dashboard**:
- Manage trainer accounts
- Billing and subscription management
- Feature flag controls (enable/disable AI coaching, exercise substitution per tier)
- Usage analytics (active clients, AI interaction volume, support tickets)

---

## 4. Technical Architecture

### 4.1 Platform Stack

**Mobile (Client App)**:
- **React Native**: Cross-platform iOS and Android
- **Expo**: Managed workflow for health API integration
- Offline-first architecture (queue workouts/meals, sync when online)

**Web (Trainer Portal)**:
- **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for analytics visualization

**Backend**:
- **Node.js** + **Express** OR **Python** + **FastAPI**
- RESTful API + **WebSockets** (real-time AI coaching)
- Microservices architecture:
  - Auth service
  - Plan generation service (AI)
  - AI coaching service (NLP)
  - Health data sync service
  - Notification service

**Database**:
- **PostgreSQL**: Relational data (users, goals, plans, workouts, nutrition logs)
- **Redis**: Caching, session management, real-time data
- **Vector Database** (Pinecone/Weaviate): Exercise embeddings for semantic search

**AI/ML**:
- **OpenAI GPT-4 API**: Plan generation, AI coaching, NLP
- **Fine-tuned models**: Domain-specific PT coaching language
- **LangChain**: Orchestration for RAG (retrieval-augmented generation)
- **Custom NER models**: Extract entities from client messages (injuries, nutrition data, equipment)

**File Storage**:
- **AWS S3** / **Google Cloud Storage**: Exercise videos, client progress photos, meal photos

**Infrastructure**:
- **AWS** / **Google Cloud Platform**
- **Docker** + **Kubernetes**: Container orchestration
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (errors), Datadog (performance)

---

### 4.2 Key Integrations

**Health & Fitness**:
- **Apple HealthKit SDK** (iOS)
- **Google Fit REST API** (Android)

**AI/ML**:
- **OpenAI API** (GPT-4 for coaching, embeddings for exercise matching)
- **Anthropic Claude** (alternative/fallback LLM)

**Payments**:
- **Stripe**: Trainer subscriptions, client billing
- **Webhook handling**: Subscription lifecycle management

**Communication**:
- **SendGrid**: Transactional emails (plan published, PT messages)
- **Twilio** (optional): SMS notifications for high-priority alerts
- **Push notifications**: Firebase Cloud Messaging (FCM)

**Analytics**:
- **Mixpanel** / **Amplitude**: User behavior tracking
- **Google Analytics**: Web portal traffic

---

### 4.3 Core Data Models

**Users**:
```
- id (UUID)
- role (trainer | client | admin)
- email, password_hash
- profile (name, photo, bio)
- white_label_config (logo, colors, domain)
- subscription_tier (trainer only)
- created_at, updated_at
```

**Goals**:
```
- id (UUID)
- client_id (FK)
- trainer_id (FK)
- type (performance | endurance | health)
- target_metric (e.g., "back squat 110kg")
- baseline_metric (e.g., "back squat 100kg")
- deadline (date)
- status (active | completed | abandoned)
- created_at
```

**Plans** (Mesocycles):
```
- id (UUID)
- goal_id (FK)
- start_date, end_date
- workout_plan (JSON: weekly structure, exercises, sets, reps, intensity)
- nutrition_plan (JSON: daily macros, meal suggestions)
- ai_generated (boolean)
- trainer_approved (boolean)
- published (boolean)
- created_at
```

**Workouts**:
```
- id (UUID)
- plan_id (FK)
- client_id (FK)
- scheduled_date
- exercises (JSON array: exercise_id, sets, reps, weight, RPE)
- completed (boolean)
- completion_date
- notes (client feedback)
```

**Exercises** (Database):
```
- id (UUID)
- name (e.g., "Barbell back squat")
- description
- muscle_groups (array: quads, glutes, hamstrings)
- movement_pattern (squat | hinge | push | pull | carry)
- equipment (array: barbell, squat rack)
- difficulty (1-10)
- video_url
- embedding (vector for semantic search)
```

**NutritionLogs**:
```
- id (UUID)
- client_id (FK)
- date
- meal_type (breakfast | lunch | dinner | snack)
- foods (JSON array: food_name, portion, calories, protein, carbs, fat)
- total_macros (calories, protein, carbs, fat)
- logged_at
```

**HealthMetrics**:
```
- id (UUID)
- client_id (FK)
- source (apple_health | google_fit | manual)
- metric_type (heart_rate | active_calories | sleep | steps)
- value (numeric)
- timestamp
- synced_at
```

**AIConversations**:
```
- id (UUID)
- client_id (FK)
- trainer_id (FK)
- message (text)
- sender (client | ai | trainer)
- extracted_data (JSON: injuries, sleep, nutrition, sentiment)
- plan_adjustment (JSON: modified exercises, volume changes)
- pt_review_status (pending | approved | modified | rejected)
- created_at
```

---

## 5. User Flows

### 5.1 Goal Setting → AI Plan Generation

**Actors**: Trainer, Client, AI System

**Flow**:
1. **Trainer creates goal** in client dashboard:
   - Select client: "John Smith"
   - Goal type: Performance (Strength)
   - Target: "Back squat 110kg (1RM)"
   - Baseline: "Current 1RM: 100kg"
   - Deadline: "6 weeks from today"
   - Training frequency: "4 days/week"
   - Available equipment: Barbell, dumbbells, machines
2. **Trainer clicks "Generate AI Plan"**
3. **AI generates plan** (30-60 seconds):
   - **Workout plan**:
     - Week 1-2: Hypertrophy (4x8-10 @ 70-75% 1RM, accessory work)
     - Week 3-4: Strength (4x4-6 @ 80-85% 1RM)
     - Week 5: Peaking (3x2-3 @ 90-95% 1RM)
     - Week 6: Test week (1RM attempt)
   - **Nutrition plan**:
     - Daily calories: 2400 (slight surplus)
     - Macros: 180g protein, 280g carbs, 70g fat
     - Higher carbs on squat days
4. **Trainer reviews plan**:
   - Sees full 6-week workout breakdown
   - Edits: Swaps leg press → Bulgarian split squats (prefers unilateral work)
   - Adjusts nutrition: Increases protein to 200g
   - Adds notes: "Focus on depth and bracing - no quarter squats!"
5. **Trainer approves** → Plan status = "Published"
6. **Client receives notification**: "Your 6-week squat program is ready!"
7. **Week 1 published immediately**, Weeks 2-6 scheduled for 3-day advance release

---

### 5.2 Client Adaptive Workout (Real-Time Substitution)

**Actors**: Client, AI System

**Flow**:
1. **Client opens Monday workout**:
   - Exercise 1: "Barbell back squat 4x6 @ 80kg"
   - Exercise 2: "Romanian deadlifts 3x10 @ 60kg"
   - Exercise 3: "Leg press 3x12 @ 150kg"
2. **Client arrives at gym**: All squat racks are taken, leg press has 20-minute wait
3. **Client taps "I don't have this equipment"** on Barbell back squat
4. **AI modal appears**:
   ```
   No problem! Here are alternatives that target the same muscles:

   1. ⭐ Dumbbell goblet squats (quads, glutes, easier to find space)
      → 4x8 @ 30kg dumbbell (higher reps, similar stimulus)

   2. Bulgarian split squats (unilateral, quads & glutes)
      → 4x6 per leg @ 20kg dumbbells

   3. Hack squat machine (if available)
      → 4x6 @ 100kg

   Why? Maintains quad/glute volume and intensity for your squat goal.
   ```
5. **Client selects**: "Dumbbell goblet squats"
6. **Workout updates**:
   - Exercise 1: ~~Barbell back squat 4x6 @ 80kg~~ → **Dumbbell goblet squat 4x8 @ 30kg**
7. **Client taps "I don't have this equipment"** on Leg press
8. **AI suggests**:
   ```
   Since you're already doing goblet squats, let's add posterior chain work:

   1. ⭐ Walking lunges (dumbbells) - quad focus + glutes
      → 3x12 per leg @ 15kg dumbbells

   2. Step-ups (dumbbell) - similar quad stimulus
      → 3x12 per leg @ 20kg dumbbells
   ```
9. **Client completes modified workout**
10. **PT receives summary**: "John modified 2 exercises today due to equipment constraints. AI suggestions maintained quad/glute volume."

---

### 5.3 AI Coaching Interaction (Injury Management)

**Actors**: Client, AI System, Trainer

**Flow**:
1. **Client writes in AI chat** (Wednesday, mid-workout):
   - *"I felt a sharp pain in my lower back during the second set of deadlifts. Stopped immediately. It's a 6/10 pain when I bend forward."*
2. **AI processes** (2-3 seconds):
   - Extracts: Injury = Lower back, Pain level = 6/10, Exercise = Deadlifts, Status = Acute
   - Identifies affected exercises in current plan: Deadlifts, RDLs, bent-over rows, squats (questionable)
   - Flags: **High priority** (acute injury, moderate pain)
3. **AI responds immediately**:
   ```
   I'm sorry you're hurt. Let's protect your back while it heals.

   I've adjusted this week's plan:
   ✅ Removed: Deadlifts, RDLs, bent-over rows
   ✅ Added safe alternatives:
      - Leg press (quads, no spinal load)
      - Hamstring curls (hamstrings, lying position)
      - Chest-supported rows (back, no lower back strain)

   For squats on Friday:
   - Box squats only (controlled depth, less back stress)
   - Reduce weight to 60% of planned

   ⚠️ If pain increases or doesn't improve in 3 days, see a physio.

   Your trainer has been notified. How does your back feel now (1-10)?
   ```
4. **Client replies**: *"Still about a 6. Should I finish today's workout?"*
5. **AI**:
   ```
   Yes, but skip any exercises that hurt. Today's remaining exercises:
   ✅ Safe: Leg press, hamstring curls, calf raises
   ❌ Skip: Anything that loads your spine

   Ice your back for 15 min after workout. Keep moving gently (walking is good).
   ```
6. **Trainer receives notification** (real-time):
   ```
   🚨 INJURY ALERT: John Smith - Lower back pain (6/10)

   AI Actions:
   - Removed deadlifts, RDLs, rows this week
   - Added leg press, hamstring curls, chest-supported rows
   - Modified squats → box squats @ 60% weight

   [View conversation] [Approve changes] [Modify plan] [Message client]
   ```
7. **Trainer reviews** (within 2 hours):
   - Approves AI changes
   - Adds personal message: *"Hey John, saw you tweaked your back. AI adjustments look good. Let me know how you feel Friday before squats. Might need to skip them entirely. Rest up!"*
8. **Client sees trainer message** + AI plan is now locked in
9. **Friday**: Client reports back feeling better, completes box squats at reduced weight
10. **Following week**: AI gradually reintroduces deadlifts at lower intensity if client reports no pain

---

### 5.4 AI Coaching Interaction (Fatigue & Recovery)

**Actors**: Client, AI System

**Flow**:
1. **Client writes** (Thursday morning):
   - *"I've been getting 4-5 hours of sleep this week because of work stress. I'm exhausted and today's workout looks brutal."*
2. **AI processes**:
   - Extracts: Sleep = 4-5 hours (poor), Sentiment = Negative (exhausted, stressed), Context = Work stress
   - Checks plan: Thursday = High volume leg day (squats, RDLs, lunges, leg press)
   - Action: Reduce volume/intensity due to low recovery capacity
3. **AI responds**:
   ```
   Sleep is crucial for your squat goal - recovery = growth. I've adjusted today:

   Original plan: 5 exercises, 16 total sets
   Modified plan: 3 exercises, 9 sets

   ✅ Keeping:
   - Back squats 3x5 @ 75kg (down from 4x6 @ 80kg)
   - RDLs 3x8 @ 50kg (down from 4x10 @ 60kg)
   - Calf raises 3x15

   ❌ Cutting:
   - Lunges (too fatiguing)
   - Leg press (redundant with squats)

   This keeps you moving without digging a deeper recovery hole.

   Can you aim for 7+ hours sleep tonight? Even one good night helps.
   ```
4. **Client**: *"Yeah that sounds way better. I'll try to sleep more this weekend."*
5. **AI**:
   ```
   Perfect. Listen to your body - training hard on low sleep backfires.

   Tips for tonight:
   - No caffeine after 2pm
   - Dim lights 1 hour before bed
   - 10 min breathing: 4 sec inhale, 6 sec exhale

   Let me know how you sleep this weekend. We can adjust next week if needed.
   ```
6. **Client completes modified workout**, reports feeling better
7. **AI tracks**: Sleep issue logged, volume reduced 45% this week
8. **Next week**: AI checks in: *"How was your sleep this week? Back to normal?"* before reverting to full volume

---

### 5.5 Natural Language Nutrition Logging

**Actors**: Client, AI System

**Flow**:
1. **Client writes** (after lunch):
   - *"Just ate a chicken burrito bowl with rice, black beans, cheese, and guac"*
2. **AI processes**:
   - Identifies foods: Chicken breast, rice, black beans, cheese, guacamole
   - Estimates portions (based on typical burrito bowl): 6oz chicken, 1 cup rice, 0.5 cup beans, 1oz cheese, 2oz guac
   - Calculates macros:
     - Chicken: 250 cal, 50g protein, 0g carbs, 5g fat
     - Rice: 200 cal, 0g protein, 45g carbs, 0g fat
     - Black beans: 110 cal, 7g protein, 20g carbs, 0g fat
     - Cheese: 110 cal, 7g protein, 1g carbs, 9g fat
     - Guacamole: 90 cal, 1g protein, 5g carbs, 8g fat
   - **Total**: 760 cal, 65g protein, 71g carbs, 22g fat
3. **AI responds**:
   ```
   Logged!

   Burrito bowl breakdown:
   - 760 calories
   - 65g protein ✅
   - 71g carbs
   - 22g fat

   Remaining today (target: 2400 cal, 200g protein):
   - 1640 calories
   - 135g protein ⚠️ (need protein-heavy meals)
   - 209g carbs
   - 48g fat

   Dinner suggestion to hit protein:
   - 8oz salmon (400 cal, 50g protein)
   - Sweet potato (180 cal, 4g protein, 40g carbs)
   - Veggies (50 cal)

   That leaves you 1 snack to hit target. Sound good?
   ```
4. **Client**: *"Portions were smaller - probably 4oz chicken and half the rice"*
5. **AI recalculates**:
   ```
   Updated!

   New totals:
   - 560 calories (down from 760)
   - 42g protein (down from 65g)
   - 48g carbs (down from 71g)

   You need even more protein now - 158g remaining.

   Add a protein shake (30g) between now and dinner?
   ```
6. **Nutrition log updated** with final macros
7. **Daily summary** (end of day): Client hit 95% of calorie target, 92% of protein target

---

## 6. MVP Scope (Phase 1)

**Timeline**: 4-6 months

**Core Features**:
- ✅ User accounts (trainer, client roles)
- ✅ Goal creation (Performance/Strength goals only for MVP)
- ✅ AI-generated workout plans (periodized, 4-6 week programs)
- ✅ Manual nutrition plan creation (trainer sets macro targets, no AI meal generation yet)
- ✅ **Intelligent exercise substitution** (equipment-based)
- ✅ **AI coaching for basic scenarios**:
  - Injury/pain management
  - Fatigue/sleep issues
  - Equipment constraints
  - Motivational support
- ✅ Natural language processing (extract injuries, sleep, equipment)
- ✅ PT oversight dashboard (approve AI changes)
- ✅ Apple Health integration (iOS only for MVP)
- ✅ Manual nutrition logging (text entry, no photo/barcode scanning)
- ✅ Basic progress dashboard (goal %, workout completion, macro adherence)
- ✅ In-app messaging (trainer ↔ client)
- ✅ Mobile app (React Native - iOS only for MVP)
- ✅ Web portal (React - trainer admin)

**Explicitly Out of Scope (Phase 2+)**:
- ❌ Android app / Google Fit integration
- ❌ AI-generated nutrition plans (meal suggestions, recipes)
- ❌ Photo-based nutrition logging
- ❌ Multiple simultaneous goals per client
- ❌ Video exercise library
- ❌ Advanced analytics (predictive modeling)
- ❌ White-label custom domains (basic branding only)
- ❌ Marketplace for plan templates

**Success Criteria for MVP**:
- 10 beta trainers onboarded
- 100+ total clients across beta trainers
- 70%+ client workout completion rate
- 50%+ AI adjustment approval rate (PT accepts AI suggestions)
- 80%+ client satisfaction (post-workout NPS survey)

---

## 7. Future Enhancements (Phase 2+)

### Phase 2: Platform Expansion (Months 7-9)
- **Android app** + Google Fit integration
- **AI nutrition plan generation**: Full meal plans, recipes, grocery lists
- **Photo-based nutrition logging**: AI food recognition
- **Advanced AI coaching**:
  - Multi-turn conversations (client asks follow-up questions)
  - Proactive check-ins (AI messages client if they miss 2 workouts)
- **Video exercise library**: 200+ exercises with proper form demos
- **White-label domains**: trainer.customdomain.com

### Phase 3: Intelligence & Scale (Months 10-12)
- **Multiple goals per client**: Track strength + endurance + body comp simultaneously
- **Predictive analytics**:
  - Goal achievement probability based on adherence
  - Injury risk prediction (volume + fatigue + sleep data)
- **Habit tracking**: Sleep, hydration, stress, menstrual cycle (for female clients)
- **Form analysis** (computer vision): Upload video, AI checks squat depth, bar path, etc.
- **Trainer marketplace**: Share/sell plan templates to other trainers

### Phase 4: Advanced Features (Year 2+)
- **Wearable integrations**: Whoop, Oura Ring, Garmin (more granular recovery data)
- **Supplement recommendations**: Based on goals and nutrition gaps
- **Client community**: Group challenges, leaderboards
- **Telehealth integration**: Connect with physios, nutritionists
- **API access**: Third-party integrations for existing trainer tools

---

## 8. Success Metrics

### Product Metrics
- **Goal Achievement Rate**: % of clients hitting their goals within deadline (target: 70%+)
- **Plan Adherence**:
  - Workout completion rate (target: 75%+)
  - Macro compliance rate (target: 60%+)
- **AI Effectiveness**:
  - AI adjustment approval rate by PTs (target: 70%+)
  - Client satisfaction with AI coaching (NPS, target: 50+)
  - Time saved per trainer per week (target: 5+ hours)

### Business Metrics
- **Trainer Retention**: % of trainers active after 3 months, 6 months, 12 months (target: 80%/70%/60%)
- **Client Retention**: % of clients active after 3 months (target: 70%+)
- **Average Clients per Trainer**: Growth over time (target: 25+ by month 6)
- **Revenue per Trainer**: Monthly recurring revenue (target: $200+/trainer/month)
- **NPS (Net Promoter Score)**:
  - Trainer NPS (target: 60+)
  - Client NPS (target: 50+)

### Engagement Metrics
- **Daily Active Users (DAU)**: % of clients opening app daily (target: 60%+)
- **AI Interaction Volume**: Messages per client per week (target: 5+)
- **Health Data Sync Rate**: % of clients with active health data sync (target: 80%+)
- **Time to First Plan**: Days from signup to first published plan (target: <3 days)

---

## 9. Competitive Differentiation Summary

| Feature | Trainerize | Kahunas | **Our Platform** |
|---------|-----------|---------|------------------|
| **Goal-oriented AI planning (workout + nutrition + recovery)** | ❌ | ❌ | ✅ **Core Differentiator** |
| **Periodized programs with progressive overload** | ⚠️ (manual only) | ⚠️ (manual only) | ✅ **AI-generated** |
| **Integrated nutrition planning toward goal** | ❌ (separate from workouts) | ❌ (separate from workouts) | ✅ **Core Differentiator** |
| **Intelligent exercise substitution** | ❌ | ❌ | ✅ **Core Differentiator** |
| **AI coaching with NLP** | ❌ | ❌ | ✅ **Core Differentiator** |
| **Real-time plan adjustments** | ❌ | ❌ | ✅ **Core Differentiator** |
| **PT oversight of AI** | N/A | N/A | ✅ (approval workflow) |
| **Health data integration** | ✅ | ✅ | ✅ (feature parity) |
| **Nutrition tracking** | ✅ | ✅ | ✅ (+ AI-assisted logging) |
| **White-label branding** | ✅ | ✅ | ✅ (Phase 1: basic, Phase 2: custom domains) |
| **Mobile app** | ✅ | ✅ | ✅ (iOS Phase 1, Android Phase 2) |
| **In-app messaging** | ✅ | ✅ | ✅ (+ AI coach layer) |

**Key Insight**: Our platform is the **first personal trainer SaaS that combines goal-driven AI planning with embedded AI coaching**. It automatically generates periodized, integrated workout + nutrition plans toward specific goals (e.g., "+10kg back squat in 6 weeks"), then adapts those plans in real-time based on client obstacles (equipment, injuries, fatigue, motivation). This enables trainers to:
- **Save 10+ hours/week** on manual plan creation and routine adjustments
- **Deliver superior outcomes** through scientifically-structured progressions
- **Scale 3-5x their client base** without sacrificing personalization or quality

---

## 10. Open Questions & Risks

### Open Questions
1. **AI Autonomy Balance**: What's the right default autonomy level? Should AI auto-adjust or always require PT approval?
2. **Exercise Database**: Build proprietary or license existing (e.g., ExRx, Jefit)? Size needed for MVP?
3. **Pricing Model**: Commission per client or flat subscription fee for trainers?
4. **LLM Costs**: GPT-4 API costs at scale - need to estimate $ per client per month
5. **HIPAA Compliance**: Do health metrics (heart rate, sleep) require HIPAA compliance? Impact on architecture.
6. **Form Check**: Is video form analysis Phase 3 or Phase 4? Depends on CV model readiness.

### Risks & Mitigation
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **AI makes unsafe recommendations** | High (injury, legal liability) | Medium | Multi-layer guardrails: rule-based safety checks, PT approval workflow, insurance/legal disclaimers |
| **LLM hallucinations** | Medium (wrong exercise suggestions, bad nutrition advice) | Medium | Fine-tune on curated PT dataset, RAG for factual grounding, PT review required for critical changes |
| **Low PT adoption** (don't trust AI) | High (product failure) | Medium | Transparent AI (show reasoning), PT control settings, beta program with early adopter PTs |
| **High AI costs** (GPT-4 pricing) | Medium (margin compression) | High | Optimize prompts, cache responses, consider fine-tuned smaller models (GPT-3.5), price tiers based on AI usage |
| **Apple/Google API changes** | Medium (health data sync breaks) | Low | Monitoring + alerts, fallback to manual entry, diversify data sources (wearables) |
| **Competition copies features** | Low (market dilution) | High | Move fast, build moat with data (better AI over time), strong trainer relationships |

---

## Appendix A: Example AI Prompts (Technical)

### Exercise Substitution Prompt
```
You are an expert strength coach. A client cannot perform the prescribed exercise due to equipment constraints.

**Prescribed Exercise**: {exercise_name}
**Muscle Groups**: {muscle_groups}
**Movement Pattern**: {movement_pattern}
**Equipment Required**: {equipment_required}
**Sets x Reps**: {sets} x {reps}
**Intensity**: {intensity} (RPE or % 1RM)

**Client's Available Equipment**: {available_equipment}
**Client's Training Goal**: {goal_type} - {goal_description}

Suggest 3 alternative exercises that:
1. Target the same muscle groups
2. Match the movement pattern (or close variation)
3. Use only available equipment
4. Maintain similar training stimulus (volume, intensity)

For each suggestion, provide:
- Exercise name
- Adjusted sets/reps (if needed to match stimulus)
- Brief rationale (why this maintains the training effect)

Output format: JSON
{
  "suggestions": [
    {
      "exercise": "Exercise name",
      "sets_reps": "3x10",
      "rationale": "Brief explanation"
    }
  ]
}
```

### AI Coaching: Injury Detection Prompt
```
You are an empathetic AI coach for a personal training app. A client has sent you a message about their workout or how they're feeling.

**Client Message**: "{client_message}"
**Current Workout Plan**: {workout_plan_summary}
**Client's Goal**: {goal_description}
**Recent Health Data**: Sleep: {sleep_hrs} hrs/night avg, Resting HR: {rhr} bpm

**Your Task**:
1. Extract key information:
   - Is there an injury or pain mentioned? (body part, severity 1-10)
   - Is there fatigue or sleep deprivation?
   - Is there equipment unavailable?
   - What is the client's emotional state? (motivated, frustrated, exhausted)

2. Determine appropriate action:
   - Modify upcoming workouts (remove/substitute exercises)
   - Adjust volume or intensity
   - Provide encouragement and support
   - Escalate to trainer if serious (severe pain >7/10, chest pain, dizziness)

3. Respond to the client:
   - Empathetic acknowledgment
   - Specific plan adjustments (if needed)
   - Actionable advice
   - Follow-up question (assess severity or track progress)

**Safety Rules**:
- NEVER ignore pain >7/10 or acute injuries
- ALWAYS flag serious symptoms to the trainer immediately
- Do NOT provide medical diagnoses
- When in doubt, reduce intensity and notify trainer

Output format: JSON
{
  "extracted_data": {
    "injury": {"body_part": "lower back", "severity": 6},
    "sleep": 5,
    "sentiment": "frustrated",
    "equipment_issue": null
  },
  "action": {
    "modify_exercises": ["deadlift", "bent-over row"],
    "volume_adjustment": -30,
    "escalate_to_trainer": false
  },
  "response_to_client": "Your empathetic, actionable response here...",
  "follow_up_question": "How does your back feel now on a scale of 1-10?"
}
```

---

**End of Functional Specification**
