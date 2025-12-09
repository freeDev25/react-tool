import { useEffect, useState } from 'react';

interface SelectionOverlayProps {
  selectedElementId: string | null;
  selectedPath: number[] | null;
}

interface BoxModel {
  top: number;
  left: number;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  padding: { top: number; right: number; bottom: number; left: number };
  border: { top: number; right: number; bottom: number; left: number };
}

export default function SelectionOverlay({ selectedElementId, selectedPath }: SelectionOverlayProps) {
  const [boxModel, setBoxModel] = useState<BoxModel | null>(null);

  useEffect(() => {
    if (!selectedElementId || !selectedPath) {
      setBoxModel(null);
      return;
    }

    const updateOverlay = () => {
      const selector = `[data-element-id="${selectedElementId}"][data-path="${selectedPath.join('-')}"]`;
      const element = document.querySelector(selector);

      if (!element) {
        setBoxModel(null);
        return;
      }

      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      const getVal = (val: string) => parseFloat(val) || 0;

      setBoxModel({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        margin: {
          top: getVal(style.marginTop),
          right: getVal(style.marginRight),
          bottom: getVal(style.marginBottom),
          left: getVal(style.marginLeft),
        },
        padding: {
          top: getVal(style.paddingTop),
          right: getVal(style.paddingRight),
          bottom: getVal(style.paddingBottom),
          left: getVal(style.paddingLeft),
        },
        border: {
          top: getVal(style.borderTopWidth),
          right: getVal(style.borderRightWidth),
          bottom: getVal(style.borderBottomWidth),
          left: getVal(style.borderLeftWidth),
        },
      });
    };

    updateOverlay();

    // Update on scroll and resize
    window.addEventListener('scroll', updateOverlay, true);
    window.addEventListener('resize', updateOverlay);
    
    // Create a mutation observer to handle DOM changes (like drag/drop or style updates)
    const observer = new MutationObserver(updateOverlay);
    observer.observe(document.body, { 
      subtree: true, 
      attributes: true, 
      childList: true,
      characterData: true 
    });

    return () => {
      window.removeEventListener('scroll', updateOverlay, true);
      window.removeEventListener('resize', updateOverlay);
      observer.disconnect();
    };
  }, [selectedElementId, selectedPath]);

  if (!boxModel) return null;

  const { top, left, width, height, margin, padding, border } = boxModel;

  // Calculate dimensions
  // Margin Box (Outer)
  // The element rect includes border and padding. Margin is outside.
  // However, getBoundingClientRect does NOT include margin.
  // So we need to offset the margin box outwards.
  
  const marginBox = {
    top: top - margin.top,
    left: left - margin.left,
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom,
  };

  // Border Box (The element rect itself)
  // const borderBox = {
  //   top: top,
  //   left: left,
  //   width: width,
  //   height: height,
  // };

  // Padding Box (Inside border)
  const paddingBox = {
    top: top + border.top,
    left: left + border.left,
    width: width - border.left - border.right,
    height: height - border.top - border.bottom,
  };

  // Content Box (Inside padding)
  const contentBox = {
    top: paddingBox.top + padding.top,
    left: paddingBox.left + padding.left,
    width: paddingBox.width - padding.left - padding.right,
    height: paddingBox.height - padding.top - padding.bottom,
  };

  return (
    <>
      {/* Margin - Orange */}
      <div
        className="fixed pointer-events-none z-40"
        style={{
          top: marginBox.top,
          left: marginBox.left,
          width: marginBox.width,
          height: marginBox.height,
          backgroundColor: 'rgba(249, 204, 157, 0.4)', // Orange
          border: '1px dashed rgba(249, 204, 157, 1)',
        }}
      />
      
      {/* Border - Yellow (We just show the gap between margin and padding if needed, but usually border is visible on element) */}
      {/* Actually, let's just overlay the padding and content on top of the margin box */}

      {/* Padding - Green */}
      <div
        className="fixed pointer-events-none z-40"
        style={{
          top: paddingBox.top,
          left: paddingBox.left,
          width: paddingBox.width,
          height: paddingBox.height,
          backgroundColor: 'rgba(195, 232, 141, 0.4)', // Green
          border: '1px dashed rgba(195, 232, 141, 1)',
        }}
      />

      {/* Content - Blue */}
      <div
        className="fixed pointer-events-none z-40"
        style={{
          top: contentBox.top,
          left: contentBox.left,
          width: contentBox.width,
          height: contentBox.height,
          backgroundColor: 'rgba(160, 197, 232, 0.4)', // Blue
        }}
      />

      {/* Selection Outline (The blue ring we removed from SchemaRenderer) */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          top: top,
          left: left,
          width: width,
          height: height,
          outline: '2px solid #3b82f6',
          outlineOffset: '2px',
        }}
      >
        {/* Label Tag */}
        <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
          {Math.round(width)} × {Math.round(height)}
        </div>
      </div>
    </>
  );
}
