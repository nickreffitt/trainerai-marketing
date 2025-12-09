import { NextRequest, NextResponse } from "next/server";
import { formatWorkoutWithLLM } from "@/lib/format-workout";
import { LibraryExercise } from "@/hooks/use-exercise-library";

export async function POST(request: NextRequest) {
  try {
    const { rawText, exerciseLibrary } = await request.json();

    if (!rawText) {
      return NextResponse.json(
        { error: "Missing rawText" },
        { status: 400 }
      );
    }

    // Validate exerciseLibrary is an array
    if (!exerciseLibrary || !Array.isArray(exerciseLibrary)) {
      console.error("Invalid exerciseLibrary:", typeof exerciseLibrary, exerciseLibrary);
      return NextResponse.json(
        { error: "Invalid exerciseLibrary - must be an array" },
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    const formattedWorkout = await formatWorkoutWithLLM(
      rawText,
      exerciseLibrary as LibraryExercise[],
      apiKey
    );

    return NextResponse.json(formattedWorkout);
  } catch (error) {
    console.error("Error formatting workout:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to format workout" },
      { status: 500 }
    );
  }
}
