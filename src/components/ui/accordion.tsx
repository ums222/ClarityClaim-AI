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
            className="rounded-2xl border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70"
          >
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-900 dark:text-slate-50"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
            >
              <span>{item.question}</span>
              <span
                className={cn(
                  "transition-transform text-slate-600 dark:text-slate-400",
                  open ? "rotate-180" : "rotate-0"
                )}
              >
                ▾
              </span>
            </button>
            {open && (
              <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
