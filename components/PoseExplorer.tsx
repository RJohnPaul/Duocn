'use client';

import { useState } from 'react';
import type { Pose } from '@/content/registry';
import { ComponentStage } from './ComponentStage';

const ALL: Pose[] = ['closed', 'portrait', 'landscape', 'seated', 'standing'];

export function PoseExplorer() {
  const [pose] = useState<Pose>('landscape');
  return <ComponentStage slug="duo-pose" poses={ALL} initial={pose} />;
}
