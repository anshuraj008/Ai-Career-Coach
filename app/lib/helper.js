// Helper function to convert entries to markdown
export function entriesToMarkdown(entries, type) {
  if (!entries?.length) return "";

  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        if (type === "Education") {
          const duration = entry.current
            ? `${entry.startDate} - Present`
            : `${entry.startDate} - ${entry.endDate}`;
          const educationMeta = [
            `Duration: ${duration}`,
            !entry.current && entry.endDate ? `Passout Year: ${extractYear(entry.endDate)}` : null,
            entry.cgpa ? `CGPA: ${entry.cgpa}` : null,
          ]
            .filter(Boolean)
            .join(" | ");

          return `### ${entry.title} @ ${entry.organization}\n${educationMeta}\n\n${entry.description}`;
        }

        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        return `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n${entry.description}`;
      })
      .join("\n\n")
  );
}

// Parse markdown string back to form values
export function markdownToEntries(markdown) {
  const result = {
    contactInfo: {
      email: "",
      mobile: "",
      linkedin: "",
      twitter: "",
    },
    summary: "",
    skills: "",
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    internships: [],
    achievements: [],
  };

  if (!markdown) return result;

  // Split into sections using "## "
  const sections = markdown.split(/\n## /);
  
  for (let section of sections) {
    section = section.trim();
    if (!section) continue;

    // Check if it's the contact header block
    if (section.includes('align="center"') || section.includes("📧") || section.includes("📱")) {
      const emailMatch = section.match(/📧\s*([^\s|]+)/);
      const mobileMatch = section.match(/📱\s*([^\s|]+)/);
      const linkedinMatch = section.match(/💼\s*\[LinkedIn\]\(([^)]+)\)/);
      const twitterMatch = section.match(/🐦\s*\[Twitter\]\(([^)]+)\)/);

      if (emailMatch) result.contactInfo.email = emailMatch[1].trim();
      if (mobileMatch) result.contactInfo.mobile = mobileMatch[1].trim();
      if (linkedinMatch) result.contactInfo.linkedin = linkedinMatch[1].trim();
      if (twitterMatch) result.contactInfo.twitter = twitterMatch[1].trim();
    } else if (section.startsWith("Professional Summary")) {
      result.summary = section.replace("Professional Summary", "").trim();
    } else if (section.startsWith("Skills")) {
      result.skills = section.replace("Skills", "").trim();
    } else if (section.startsWith("Work Experience") || section.startsWith("Experience")) {
      result.experience = parseMarkdownSection(section);
    } else if (section.startsWith("Education")) {
      result.education = parseMarkdownSection(section);
    } else if (section.startsWith("Projects")) {
      result.projects = parseMarkdownSection(section);
    } else if (section.startsWith("Certifications")) {
      result.certifications = parseMarkdownSection(section);
    } else if (section.startsWith("Internships")) {
      result.internships = parseMarkdownSection(section);
    } else if (section.startsWith("Achievements")) {
      result.achievements = parseMarkdownSection(section);
    }
  }

  return result;
}

function parseMarkdownSection(sectionText) {
  const entries = [];
  const items = sectionText.split(/\n### /);
  
  for (let i = 1; i < items.length; i++) {
    const item = items[i].trim();
    const lines = item.split("\n");
    if (lines.length >= 2) {
      const headerLine = lines[0].trim();
      const dateLine = lines[1].trim();
      const description = lines.slice(2).join("\n").trim();

      let title = headerLine;
      let organization = "";
      if (headerLine.includes(" @ ")) {
        const parts = headerLine.split(" @ ");
        title = parts[0].trim();
        organization = parts[1].trim();
      }

      let startDate = "";
      let endDate = "";
      let current = false;
      let cgpa = "";

      if (dateLine.startsWith("Duration:")) {
        const metadataParts = dateLine.split("|").map((part) => part.trim());

        metadataParts.forEach((part) => {
          if (part.startsWith("Duration:")) {
            const durationValue = part.replace("Duration:", "").trim();
            if (durationValue.includes(" - ")) {
              const parts = durationValue.split(" - ");
              startDate = parts[0].trim();
              const endPart = parts[1].trim();
              if (endPart.toLowerCase() === "present") {
                current = true;
              } else {
                endDate = endPart;
              }
            }
          } else if (part.startsWith("CGPA:")) {
            cgpa = part.replace("CGPA:", "").trim();
          }
        });
      } else if (dateLine.includes(" - ")) {
        const parts = dateLine.split(" - ");
        startDate = parts[0].trim();
        const endPart = parts[1].trim();
        if (endPart.toLowerCase() === "present") {
          current = true;
        } else {
          endDate = endPart;
        }
      }

      entries.push({
        title,
        organization,
        startDate,
        endDate,
        cgpa,
        current,
        description,
      });
    }
  }
  return entries;
}

function extractYear(dateValue) {
  if (!dateValue) return "";
  const match = String(dateValue).match(/(\d{4})$/);
  return match ? match[1] : dateValue;
}
