// app/api/qa/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getEmbeddings } from '../../../utility/embedded';
import { splitText } from '../../../utility/testSpillter';
import { searchSimilarDocuments } from '../../../utility/vector';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { question, pdfText } = await req.json();

  // Split text and get embeddings
  const textChunks = splitText(pdfText);
  const embeddings = await getEmbeddings(textChunks);

  // Search for similar documents
  const similarDocs = await searchSimilarDocuments(embeddings, question);

  // Generate response using OpenAI
  const answer = await generateResponse(similarDocs, question);

  return NextResponse.json({ answer });
}

async function generateResponse(similarDocs: string[], question: string): Promise<string> {
  const prompt = `${similarDocs.join('\n')}\n\nQuestion: ${question}\nAnswer:`;
  const response = await openai.completions.create({
    model: 'text-davinci-003',
    prompt,
    max_tokens: 150,
    temperature: 0.7,
  });

  return response.choices[0].text?.trim() ?? '';
}
