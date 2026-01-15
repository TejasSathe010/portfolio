"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { TimelineStep } from "@/lib/architectures";

type UseGuidedControllerProps = {
  timeline: TimelineStep[];
  speed: number;
  onStepChange?: (stepIndex: number, activeEdgeIds: Set<string>) => void;
};

export function useGuidedController({
  timeline,
  speed,
  onStepChange
}: UseGuidedControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [activeEdgeIds, setActiveEdgeIds] = useState<Set<string>>(new Set());
  const [visitedEdgeIds, setVisitedEdgeIds] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout>();
  const stepStartTimeRef = useRef<number>(0);

  const getActiveEdgesForStep = useCallback((stepIndex: number): Set<string> => {
    if (stepIndex < 0 || stepIndex >= timeline.length) return new Set();

    const step = timeline[stepIndex];
    if (!step) return new Set();
    
    if (step.kind === "edge") {
      return new Set([step.edgeId]);
    } else if (step.kind === "parallel") {
      return new Set(step.edges);
    }
    return new Set();
  }, [timeline]);

  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next >= timeline.length) {
        setIsPlaying(false);
        return prev;
      }

      const newActive = getActiveEdgesForStep(next);
      setActiveEdgeIds(newActive);
      setVisitedEdgeIds((visited) => {
        const updated = new Set(visited);
        newActive.forEach(id => updated.add(id));
        return updated;
      });

      onStepChange?.(next, newActive);
      return next;
    });
  }, [timeline, getActiveEdgesForStep, onStepChange]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= timeline.length) return;

    setCurrentStep(stepIndex);
    const newActive = getActiveEdgesForStep(stepIndex);
    setActiveEdgeIds(newActive);

    const visited = new Set<string>();
    for (let i = 0; i <= stepIndex; i++) {
      const step = timeline[i];
      if (!step) continue;
      
      if (step.kind === "edge") {
        visited.add(step.edgeId);
      } else if (step.kind === "parallel") {
        step.edges.forEach(id => visited.add(id));
      }
    }
    setVisitedEdgeIds(visited);

    onStepChange?.(stepIndex, newActive);
  }, [timeline, getActiveEdgesForStep, onStepChange]);

  const stepBack = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev <= 0) return 0;
      const next = prev - 1;
      goToStep(next);
      return next;
    });
  }, [goToStep]);

  const stepForward = useCallback(() => {
    if (currentStep < timeline.length - 1) {
      advanceStep();
    }
  }, [currentStep, timeline.length, advanceStep]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(-1);
    setActiveEdgeIds(new Set());
    setVisitedEdgeIds(new Set());
    onStepChange?.(-1, new Set());
  }, [onStepChange]);

  useEffect(() => {
    if (!isPlaying || currentStep < 0 || currentStep >= timeline.length) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      return;
    }

    const step = timeline[currentStep];
    if (!step) return;
    
    const duration = step.kind === "edge" 
      ? 2000 
      : 2500; 
    const adjustedDuration = duration / speed;

    stepStartTimeRef.current = Date.now();
    intervalRef.current = setTimeout(() => {
      advanceStep();
    }, adjustedDuration);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isPlaying, currentStep, timeline, speed, advanceStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && !e.repeat) {
        e.preventDefault();
        if (isPlaying) pause();
        else if (currentStep >= 0) play();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBack();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepForward();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, currentStep, play, pause, stepBack, stepForward]);

  return {
    isPlaying,
    currentStep,
    activeEdgeIds,
    visitedEdgeIds,
    play,
    pause,
    reset,
    stepBack,
    stepForward,
    goToStep,
    totalSteps: timeline.length
  };
}
