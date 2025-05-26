import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropwownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // Width of dropdown (w-60 = 240px)

    // Calculate the initial postion
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // Check if the dropdown goes off the right side of the screen
    if (left + dropdownWidth > window.innerWidth) {
      // If it does, adjust the left position to align with the right side of the element
      left = rect.right + window.scrollX - dropdownWidth;

      // If still off screen, align the right edge of the viewport with some padding
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16; // 16px padding
      }
    }

    // Ensure the dropdown doesn't go off the left side of the screen
    if (left < 0) {
      left = 16;
    }

    return { top, left };
  };

  return { getDropwownPosition };
};
