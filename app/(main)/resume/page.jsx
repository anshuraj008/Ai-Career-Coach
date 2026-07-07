import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";

export default async function ResumePage() {
  const resume = await getResume();

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 md:px-0">
      <ResumeBuilder initialContent={resume?.content} resumeData={resume} />
    </div>
  );
}
