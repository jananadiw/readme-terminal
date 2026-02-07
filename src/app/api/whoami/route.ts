import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const content = readFileSync(join(process.cwd(), 'whoami.md'), 'utf-8');
  return new Response(content);
}
