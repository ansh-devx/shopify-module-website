import { getCognitoIdToken } from "@/lib/cognitoAuth";

const KB_API_BASE_URL = process.env.KB_API_BASE_URL || '';

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorName: string;
  authorEmail: string;
  brandProject: string;
  tags: string[];
  date: string;
  content: string;
  status: string;
  assignedApproverName: string;
  assignedApproverEmail: string;
  rejectionReason: string;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export async function loadKnowledgeBase(): Promise<KnowledgeArticle[]> {
  if (!KB_API_BASE_URL) return [];

  try {
    const idToken = await getCognitoIdToken();
    const response = await fetch(
      `${KB_API_BASE_URL}/kb/articles?includeContent=true`,
      {
        headers: { Authorization: `Bearer ${idToken}` },
        cache: 'no-store',
      }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.articles || [];
  } catch {
    return [];
  }
}
