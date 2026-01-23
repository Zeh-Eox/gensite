const sanitizeHtml = (code: string): string => code.replace(/```[a-z]*\n?/gi, "").replace(/```$/g, "").trim();

export default sanitizeHtml