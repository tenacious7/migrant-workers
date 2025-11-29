import { type NextRequest, NextResponse } from "next/server"

const languageMap: { [key: string]: string } = {
  auto: "auto-detect",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  or: "Odia",
  ml: "Malayalam",
  mr: "Marathi",
  gu: "Gujarati",
  bn: "Bengali",
  pa: "Punjabi",
  ur: "Urdu",
  en: "English",
}

export async function POST(request: NextRequest) {
  try {
    const { audio, sourceLanguage, targetLanguage } = await request.json()

    if (!audio) {
      return NextResponse.json({ error: "Audio data is required" }, { status: 400 })
    }

    const sourceLangName = languageMap[sourceLanguage] || sourceLanguage
    const targetLangName = languageMap[targetLanguage] || targetLanguage

    const apiKey = process.env.GOOGLE_GEMIN_API
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const combinedResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    sourceLanguage === "auto"
                      ? `Transcribe the audio and translate it to ${targetLangName}. Return ONLY valid JSON in this exact format: {"original": "transcribed text here", "translated": "translated text here"}`
                      : `Transcribe the audio that is spoken in ${sourceLangName} and translate it to ${targetLangName}. Return ONLY valid JSON in this exact format: {"original": "transcribed text here", "translated": "translated text here"}`,
                },
                {
                  inlineData: {
                    mimeType: "audio/webm",
                    data: audio,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          },
        }),
      },
    )

    if (!combinedResponse.ok) {
      const errorData = await combinedResponse.json()
      if (combinedResponse.status === 429) {
        return NextResponse.json({ error: "API rate limit exceeded. Please try again in a moment." }, { status: 429 })
      }
      throw new Error(`API error: ${errorData.error?.message || "Unknown error"}`)
    }

    const responseData = await combinedResponse.json()
    const resultText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || ""

    let result = { original: "", translated: "" }
    try {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Invalid response format")
      }
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError, "Response:", resultText)
      return NextResponse.json({ error: "Failed to parse translation response" }, { status: 500 })
    }

    if (!result.original || !result.translated) {
      throw new Error("Missing transcription or translation in response")
    }

    return NextResponse.json({
      original: result.original.trim(),
      translated: result.translated.trim(),
    })
  } catch (error) {
    console.error("[v0] Translation error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Translation failed" }, { status: 500 })
  }
}
