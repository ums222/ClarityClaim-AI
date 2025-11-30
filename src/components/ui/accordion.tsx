import * as React from "react";
import { cn } from "../../lib/utils";

type Item = {
  id: string;
  question: string;
  answer: string;
};

interface AccordionProps {
  items: Item[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openId, setOpenId] = React.useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const open = item.id === openId;
        return (
          <div
            key={item.id}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70"
          >
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-neutral-900 dark:text-neutral-50"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
            >
              <span>{item.question}</span>
              <span
                className={cn(
                  "transition-transform",
                  open ? "rotate-180" : "rotate-0"
                )}
              >
                ▾
              </span>
            </button>
            {open && (
              <div className="border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
