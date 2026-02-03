import { mdxComponents } from "@/features/docs/components/mdx-components";

export function useMDXComponents(components: Record<string, unknown>) {
  return { ...mdxComponents, ...components };
}
