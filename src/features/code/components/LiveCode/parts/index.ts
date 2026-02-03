/**
 * @module LiveCode/parts
 * @description Barrel exports for LiveCode compound components.
 *
 * This module provides a collection of reusable UI components that compose
 * the LiveCode interactive code playground. These components follow the
 * compound component pattern, allowing flexible composition while maintaining
 * consistent styling and behavior.
 *
 * @example
 * ```tsx
 * import {
 *   LiveCodeFrame,
 *   LiveCodeHeader,
 *   LiveCodeTabs,
 *   LiveCodeTab
 * } from "./parts";
 *
 * <LiveCodeFrame>
 *   <LiveCodeHeader>
 *     <LiveCodeTabs>
 *       <LiveCodeTab tab="preview" label="Preview" icon={<EyeIcon />} />
 *       <LiveCodeTab tab="code" label="Code" icon={<CodeIcon />} />
 *     </LiveCodeTabs>
 *   </LiveCodeHeader>
 * </LiveCodeFrame>
 * ```
 */

export { LiveCodeFrame } from "./LiveCodeFrame";
export { LiveCodeHeader } from "./LiveCodeHeader";
export { LiveCodeTabs } from "./LiveCodeTabs";
export { LiveCodeTab } from "./LiveCodeTab";
export * from "./LiveCodeBadge";
export * from "./LiveCodeCodeView";
export * from "./LiveCodeConsoleView";
export * from "./LiveCodeFrame";
export * from "./LiveCodeHeader";
export * from "./LiveCodePreviewView";
export * from "./LiveCodeTab";
export * from "./LiveCodeTabs";
export * from "./LiveCodeFullScreenEditor";
export * from "./LiveCodeEditButton";
