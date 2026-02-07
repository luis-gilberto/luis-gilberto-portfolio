export function safeJsonParse(value: any, fallback: any = null) { 
  if (typeof value !== "string") return value || fallback; 
  const trimmed = value.trim(); 
  if (!trimmed) return fallback; 

  const looksLikeJson = 
    (trimmed.startsWith("{") && trimmed.endsWith("}")) || 
    (trimmed.startsWith("[") && trimmed.endsWith("]")); 

  if (!looksLikeJson) return value; // Return raw string if it's not JSON 

  try { 
    return JSON.parse(trimmed); 
  } catch (e) { 
    return value; // Fallback to raw string on error 
  } 
} 
