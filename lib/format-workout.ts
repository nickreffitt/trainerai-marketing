import { Exercise, Workout } from "@/types/workout";
import { LibraryExercise } from "@/hooks/use-exercise-library";
import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

/**
 * Format a raw workout text (from Notes app or other sources) into structured workout data
 * using an LLM via OpenRouter.
 *
 * @param rawText - The unstructured workout text from the coach
 * @param exerciseLibrary - Reference exercise library for name matching
 * @param apiKey - OpenRouter API key (get one at https://openrouter.ai/keys)
 * @returns Parsed and structured workout data
 */
export async function formatWorkoutWithLLM(
  rawText: string,
  exerciseLibrary: LibraryExercise[],
  apiKey: string
): Promise<Omit<Workout, 'date'>> {
  const systemPrompt = buildSystemPrompt(exerciseLibrary);
  const userPrompt = buildUserPrompt(rawText);

  const openrouter = createOpenRouter({
    apiKey: apiKey,
  });

  try {
    // Using Google's Gemini Flash 1.5 8B - fast, cheap, and high quality
    // Cost: ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens
    //
    // FREE Alternative models available on OpenRouter:
    // - "meta-llama/llama-3.3-70b-instruct" - Meta's powerful 70B model
    // - "qwen/qwen-2.5-72b-instruct" - Alibaba's excellent 72B model
    // - "google/gemini-2.0-flash-exp:free" - Google's experimental free tier
    //
    // To change the model, simply replace the model string below.
    // See all available models at: https://openrouter.ai/models
    const { text } = await generateText({
      model: openrouter("tngtech/deepseek-r1t2-chimera:free"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    });

    // Extract JSON from the response (handle markdown code blocks)
    let jsonText = text.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\s*/g, "").replace(/\s*```$/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\s*/g, "").replace(/\s*```$/g, "");
    }

    const parsed = JSON.parse(jsonText);

    // Validate and return
    return validateWorkoutData(parsed);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenRouter API error: ${error.message}`);
    }
    throw new Error("Failed to format workout with LLM");
  }
}

function buildSystemPrompt(exerciseLibrary: LibraryExercise[]): string {
  // Create a simplified exercise reference list
  // Defensive check - ensure it's an array
  const library = Array.isArray(exerciseLibrary) ? exerciseLibrary : [];

  const exerciseNames = library
    .map((ex) => {
      const aliases = ex.aliases?.length ? ` (aliases: ${ex.aliases.join(", ")})` : "";
      return `- ${ex.name}${aliases}`;
    })
    .slice(0, 200) // Limit to avoid token overflow
    .join("\n");

  return `You are a fitness workout parser. Your job is to convert unstructured workout text (from Notes app, text messages, etc.) into structured JSON format.

## TypeScript Type Definitions

\`\`\`typescript
interface SetData {
  reps: number;
  weight: number;
}

interface Segment {
  name: string;
  durationMinutes: number;
  zone?: string;
  videoId: string;
}

interface EmomInterval {
  name: string;
  reps?: string;
  weight?: string;
  notes?: string;
  videoId: string;
}

interface AmrapExercise {
  name: string;
  reps: string;
  weight?: string;
  notes?: string;
  videoId: string;
}

interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'for-time' | 'emom' | 'amrap';
  sets: number;
  reps: string;
  weight?: string;
  notes?: string;
  restSeconds: number;
  equipment: string[];
  muscleGroups: string[];
  videoId: string;
  segments?: Segment[];
  emomIntervalSeconds?: number;
  emomTotalMinutes?: number;
  emomIntervals?: EmomInterval[];
  amrapDurationMinutes?: number;
  amrapExercises?: AmrapExercise[];
}

interface Workout {
  name: string;
  goal: string;
  coachNotes: string;
  estimatedTime: string;
  exercises: Exercise[];
}
\`\`\`

## Exercise Library Reference (partial list)
${exerciseNames}

## Instructions

1. **Exercise Name Matching**: Try to match exercise names from the input to the exercise library. If no exact match, use the closest common name.
2. **Exercise Type**:
   - Use 'strength' for weight training exercises (bench press, squats, curls, etc.)
   - Use 'for-time' for continuous cardio work (running, rowing, biking)
   - Use 'emom' for EMOM/interval-based work (Every Minute On the Minute, E2MOM, etc.)
   - Use 'amrap' for AMRAP workouts (As Many Rounds As Possible in a set time)
3. **videoId**: Leave as empty string "" - will be populated later
4. **Generate unique IDs**: Use sequential numbers "1", "2", "3", etc.
5. **Extract metadata**: Parse sets, reps, weight, rest times from the text
6. **Infer equipment**: Based on exercise names, infer required equipment
7. **Infer muscle groups**: Based on exercise names, infer targeted muscle groups
8. **Default rest times**: Use 120-180s for compound lifts, 60-90s for isolation exercises, 0s for cardio
9. **Parse 'for-time' segments**: If an exercise is cardio/timed work, structure it with segments
10. **Estimate time**: Calculate total workout time based on sets, rest, and cardio duration

## Few-Shot Examples

### Example 1: Strength Training
**Input:**
\`\`\`
Upper Body Day
Bench Press 4x6-8 @ 80kg, rest 3min
Incline DB Press 3x10 @ 30kg each, 2min rest
Cable Flyes 3x12-15, stack 7
\`\`\`

**Output:**
\`\`\`json
{
  "name": "Upper Body Day",
  "goal": "Upper body strength training",
  "coachNotes": "Focus on controlled movements and proper form",
  "estimatedTime": "45-55 minutes",
  "exercises": [
    {
      "id": "1",
      "name": "Barbell Bench Press",
      "type": "strength",
      "sets": 4,
      "reps": "6-8",
      "weight": "80kg",
      "notes": "",
      "restSeconds": 180,
      "equipment": ["Barbell", "Bench", "Rack"],
      "muscleGroups": ["Chest", "Triceps", "Shoulders"],
      "videoId": ""
    },
    {
      "id": "2",
      "name": "Incline Dumbbell Press",
      "type": "strength",
      "sets": 3,
      "reps": "10",
      "weight": "30kg ea.",
      "notes": "",
      "restSeconds": 120,
      "equipment": ["Dumbbells", "Adjustable Bench"],
      "muscleGroups": ["Upper Chest", "Shoulders"],
      "videoId": ""
    },
    {
      "id": "3",
      "name": "Cable Flyes",
      "type": "strength",
      "sets": 3,
      "reps": "12-15",
      "weight": "Stack 7",
      "notes": "",
      "restSeconds": 90,
      "equipment": ["Cable Machine"],
      "muscleGroups": ["Chest"],
      "videoId": ""
    }
  ]
}
\`\`\`

### Example 2: Cardio/For-Time
**Input:**
\`\`\`
Mixed Cardio 55min
20min ski erg Z2
10min bike Z2
20min row Z2
5min bike cooldown
\`\`\`

**Output:**
\`\`\`json
{
  "name": "Mixed Cardio Session",
  "goal": "Cardiovascular endurance",
  "coachNotes": "Maintain steady Zone 2 pace throughout",
  "estimatedTime": "55 minutes",
  "exercises": [
    {
      "id": "1",
      "name": "Mixed Cardio Group",
      "type": "for-time",
      "sets": 0,
      "reps": "",
      "notes": "Maintain steady Zone 2 pace",
      "restSeconds": 0,
      "equipment": ["Ski Erg", "C2 Bike", "Rower"],
      "muscleGroups": ["Full Body", "Cardio"],
      "videoId": "",
      "segments": [
        {
          "name": "Ski Erg",
          "durationMinutes": 20,
          "zone": "Zone 2",
          "videoId": ""
        },
        {
          "name": "C2 Bike",
          "durationMinutes": 10,
          "zone": "Zone 2",
          "videoId": ""
        },
        {
          "name": "Row",
          "durationMinutes": 20,
          "zone": "Zone 2",
          "videoId": ""
        },
        {
          "name": "C2 Bike",
          "durationMinutes": 5,
          "zone": "Cooldown",
          "videoId": ""
        }
      ]
    }
  ]
}
\`\`\`

### Example 3: EMOM (Every Minute On the Minute)
**Input:**
\`\`\`
E2MOM Sled Work - 10 minutes
Minute 1: Sled Push 40m @ 90kg
Minute 2: Sled Pull 40m @ 70kg
\`\`\`

**Output:**
\`\`\`json
{
  "name": "E2MOM Sled Work",
  "goal": "Lower body power and conditioning",
  "coachNotes": "Push hard on the sled movements, maintain consistent intensity",
  "estimatedTime": "10 minutes",
  "exercises": [
    {
      "id": "1",
      "name": "E2MOM Sled Work",
      "type": "emom",
      "sets": 0,
      "reps": "",
      "notes": "Alternate between movements every 2 minutes",
      "restSeconds": 0,
      "equipment": ["Sled", "Weight Plates"],
      "muscleGroups": ["Legs", "Full Body", "Cardio"],
      "videoId": "",
      "emomIntervalSeconds": 120,
      "emomTotalMinutes": 10,
      "emomIntervals": [
        {
          "name": "Sled Push",
          "reps": "40m",
          "weight": "90kg",
          "notes": "Low position, drive through legs",
          "videoId": ""
        },
        {
          "name": "Sled Pull",
          "reps": "40m",
          "weight": "70kg",
          "notes": "Lean back, use full body",
          "videoId": ""
        }
      ]
    }
  ]
}
\`\`\`

### Example 4: AMRAP (As Many Rounds As Possible)
**Input:**
\`\`\`
15 min AMRAP
10 pull-ups
15 KB swings @ 24kg
20 box jumps 24"
\`\`\`

**Output:**
\`\`\`json
{
  "name": "15 Minute AMRAP",
  "goal": "Full body conditioning and endurance",
  "coachNotes": "Move at a steady pace, don't burn out early",
  "estimatedTime": "15 minutes",
  "exercises": [
    {
      "id": "1",
      "name": "15 Minute AMRAP",
      "type": "amrap",
      "sets": 0,
      "reps": "",
      "notes": "Complete as many rounds as possible",
      "restSeconds": 0,
      "equipment": ["Pull-up Bar", "Kettlebell", "Box"],
      "muscleGroups": ["Full Body", "Cardio"],
      "videoId": "",
      "amrapDurationMinutes": 15,
      "amrapExercises": [
        {
          "name": "Pull-ups",
          "reps": "10",
          "notes": "Scale to assisted if needed",
          "videoId": ""
        },
        {
          "name": "Kettlebell Swings",
          "reps": "15",
          "weight": "24kg",
          "notes": "Hip hinge, explosive",
          "videoId": ""
        },
        {
          "name": "Box Jumps",
          "reps": "20",
          "weight": "24\\"",
          "notes": "Step down, don't jump down",
          "videoId": ""
        }
      ]
    }
  ]
}
\`\`\`

## Response Format
Return ONLY valid JSON matching the Workout interface (without the 'date' field). No markdown, no explanation.`;
}

function buildUserPrompt(rawText: string): string {
  return `Parse this workout into structured JSON format:\n\n${rawText}`;
}

function validateWorkoutData(data: any): Omit<Workout, 'date'> {
  // Basic validation
  if (!data.name || typeof data.name !== 'string') {
    throw new Error("Invalid workout: missing or invalid 'name'");
  }

  if (!data.exercises || !Array.isArray(data.exercises)) {
    throw new Error("Invalid workout: missing or invalid 'exercises' array");
  }

  // Validate each exercise
  data.exercises.forEach((ex: any, index: number) => {
    if (!ex.name || !ex.type) {
      throw new Error(`Invalid exercise at index ${index}: missing name or type`);
    }
    if (ex.type !== 'strength' && ex.type !== 'for-time' && ex.type !== 'emom' && ex.type !== 'amrap') {
      throw new Error(`Invalid exercise type at index ${index}: must be 'strength', 'for-time', 'emom', or 'amrap'`);
    }
  });

  // Ensure default values
  return {
    name: data.name,
    goal: data.goal || "",
    coachNotes: data.coachNotes || "",
    estimatedTime: data.estimatedTime || "Unknown",
    exercises: data.exercises.map((ex: any) => ({
      ...ex,
      completed: false,
      equipment: ex.equipment || [],
      muscleGroups: ex.muscleGroups || [],
      videoId: ex.videoId || "",
    })),
  };
}
