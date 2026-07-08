"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Check Clerk subscription plan
  const clerk = await import("@clerk/nextjs/server");
  const clerkUser = await clerk.currentUser();
  const isPremium = clerkUser?.publicMetadata?.plan === "premium";

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  if (!isPremium) {
    const letterCount = await db.coverLetter.count({
      where: { userId: user.id },
    });
    if (letterCount >= 2) {
      throw new Error("Free tier limit reached: You can generate up to 2 cover letters on the Free plan. Please upgrade to Premium for unlimited cover letters.");
    }
  }

  // Fetch the candidate's active Resume
  const resume = await db.resume.findUnique({
    where: { userId: user.id },
  });

  const templateStyle = data.template || "Formal";

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.
    
    Writing Template Style: ${templateStyle}
    Tone Guidance:
    - "Modern": Direct, punchy, forward-looking, and conversational but professional.
    - "Creative": Engaging storytelling hook, highly enthusiastic, and unique narrative.
    - "Formal": Traditional business letter structure, highly polite, classic corporate style.
    - "Tech-focused": Emphasize engineering impact, quantitative metrics, systems building, and relevant tech keywords.
    
    About the candidate (based on their Resume):
    ${resume ? `Resume Content (Markdown):\n${resume.content}` : `
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    `}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Align closely with the specified "${templateStyle}" writing template style.
    2. Highlight relevant skills and experience from the resume/background.
    3. Show understanding of the company's needs.
    4. Keep it concise (max 400 words).
    5. Use proper business letter formatting in markdown.
    6. Include specific examples of achievements.
    
    Format the cover letter in markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    revalidatePath("/ai-cover-letter");
    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const result = await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/ai-cover-letter");
  return result;
}

// Save cover letter manual changes
export async function updateCoverLetter(id, content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const result = await db.coverLetter.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      content,
    },
  });

  revalidatePath(`/ai-cover-letter/${id}`);
  return result;
}

// AI Improvements and Grammar corrections
export async function improveCoverLetterAI({ content, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let prompt = "";
  if (type === "grammar") {
    prompt = `
      As a professional editor, review the following cover letter. Correct any spelling, grammar, punctuation, or typographical errors. 
      Keep the formatting, structure, and general meaning identical. Only correct objective grammar and spelling issues.
      
      Cover Letter Content:
      ${content}
      
      Format the corrected cover letter in markdown. Do not include any explanations, side comments, or notes.
    `;
  } else {
    prompt = `
      As an expert career coach, improve the writing style, structure, and professional tone of the following cover letter. 
      Make it more compelling, ensure smooth transitions, use powerful action verbs, and polish the phrasing to make it stand out.
      
      Cover Letter Content:
      ${content}
      
      Format the improved cover letter in markdown. Do not include any explanations, side comments, or notes.
    `;
  }

  try {
    const result = await model.generateContent(prompt);
    const improved = result.response.text().trim();
    return improved;
  } catch (error) {
    console.error("Error improving cover letter:", error.message);
    throw new Error("Failed to improve cover letter with AI");
  }
}
