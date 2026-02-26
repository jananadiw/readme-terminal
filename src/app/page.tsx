import { readFile } from "fs/promises";
import { join } from "path";
import HomeTemplate from "@/components/templates/HomeTemplate";

export default async function Home() {
  const whoamiContent = await readFile(join(process.cwd(), "whoami.md"), "utf-8");
  return <HomeTemplate initialWhoamiContent={whoamiContent} />;
}
