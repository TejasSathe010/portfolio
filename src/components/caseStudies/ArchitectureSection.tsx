import { architecturesBySlug } from "@/lib/architectures";
import { ArchitectureCanvas } from "./ArchitectureCanvas";

export function ArchitectureSection({ slug }: { slug: string }) {
  const model = architecturesBySlug[slug];
  if (!model) return null; // safe: nothing breaks if slug not configured
  return <ArchitectureCanvas model={model} />;
}
