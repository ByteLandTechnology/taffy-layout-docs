"use client";

import { useEffect } from "react";
import clarity from "@microsoft/clarity";

interface MicrosoftClarityProps {
  projectId: string;
}

/**
 * Microsoft Clarity analytics component.
 * Uses the react-microsoft-clarity package for initialization.
 * @param props - Component props.
 * @param props.projectId - The Microsoft Clarity project ID.
 * @returns null
 */
export function MicrosoftClarity({ projectId }: MicrosoftClarityProps) {
  useEffect(() => {
    if (projectId) {
      clarity.init(projectId);
    }
  }, [projectId]);

  return null;
}
