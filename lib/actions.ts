"use server"

import clientPromise from "./mongodb"
import { revalidatePath } from "next/cache"

export async function submitQuestionnaire(formData: FormData) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const collection = db.collection("responses")

    const userId = formData.get("userId") as string

    // חישוב סכומי נקודות לכל סט
    const set1Points = Number.parseInt(formData.get("set1_points") as string) || 0
    const set2Points = Number.parseInt(formData.get("set2_points") as string) || 0

    // בניית אובייקט התשובות
    const responseData = {
      userId,
      timestamp: new Date(),
      set1: {
        question1: {
          answer: formData.get("set1_question1"),
          points: Number.parseInt(formData.get("set1_question1_points") as string) || 0,
        },
        question2: {
          answer: formData.get("set1_question2"),
          points: Number.parseInt(formData.get("set1_question2_points") as string) || 0,
        },
        question3: {
          answer: formData.get("set1_question3"),
          points: Number.parseInt(formData.get("set1_question3_points") as string) || 0,
        },
        question4: formData.get("set1_question4"),
        totalPoints: set1Points,
      },
      set2: {
        question1: {
          answer: formData.get("set2_question1"),
          points: Number.parseInt(formData.get("set2_question1_points") as string) || 0,
        },
        question2: {
          answer: formData.get("set2_question2"),
          points: Number.parseInt(formData.get("set2_question2_points") as string) || 0,
        },
        question3: {
          answer: formData.get("set2_question3"),
          points: Number.parseInt(formData.get("set2_question3_points") as string) || 0,
        },
        question4: formData.get("set2_question4"),
        totalPoints: set2Points,
      },
      set3: {
        question1: formData.get("set3_question1"),
        question2: formData.get("set3_question2"),
        question3: formData.get("set3_question3"),
      },
    }

    // שמירה במסד הנתונים
    await collection.insertOne(responseData)

    revalidatePath("/")
    return { success: true, message: "התשובות נשמרו בהצלחה!" }
  } catch (error) {
    console.error("שגיאה בשמירת התשובות:", error)
    return { success: false, message: "אירעה שגיאה בשמירת התשובות. אנא נסה שוב." }
  }
}

