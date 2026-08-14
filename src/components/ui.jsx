import { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  BookText,
  SpellCheck,
  BookOpen,
  Headphones,
  PenTool,
  MessageSquare,
} from "lucide-react";
import { LEVEL_LABELS, LEVEL_COLORS } from "../utils/level.js";

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Button({ variant = "primary", size = "md", className, children, ...props }) {
  return (
    <button
      className={cn(
        `rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2`,
        {
          primary: `bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:shadow-lg hover:shadow-violet-500/25`,
          secondary: `bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700`,
          ghost: `text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`,
          danger: `bg-red-500 text-white hover:bg-red-600`,
        }[variant],
        {
          sm: `px-3 py-1.5 text-sm`,
          md: `px-5 py-2.5 text-sm`,
          lg: `px-8 py-3 text-base`,
        }[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ProgressBar({
  value,
  max,
  className,
  color = "primary",
  showLabel,
}) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  return (
    <div className={cn(`w-full`, className)}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            `h-full rounded-full transition-all duration-500 ease-out`,
            {
              primary: `bg-gradient-to-r from-indigo-500 to-violet-500`,
              green: `bg-green-500`,
              yellow: `bg-yellow-500`,
              purple: `bg-purple-500`,
            }[color]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1 text-right">{pct}%</p>
      )}
    </div>
  );
}

export function LevelBadge({ level, size = "sm" }) {
  return (
    <span
      className={`inline-flex items-center font-bold rounded-full text-white ${LEVEL_COLORS[level]} ${
        { sm: `text-xs px-2 py-0.5`, md: `text-sm px-3 py-1`, lg: `text-base px-4 py-1.5` }[size]
      }`}
    >
      {level} - {LEVEL_LABELS[level]}
    </span>
  );
}

export const Card = forwardRef(
  ({ hover, className, children, onClick, style }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 ${
        hover ? `cursor-pointer` : ``
      } ${className || ""}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </motion.div>
  )
);
Card.displayName = "Card";

export function Badge({ variant = "default", children, className }) {
  return (
    <span
      className={cn(
        `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`,
        {
          default: `bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300`,
          success: `bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`,
          warning: `bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400`,
          danger: `bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`,
          info: `bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400`,
        }[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

const SKILL_ICONS = {
  grammar: BookText,
  vocabulary: SpellCheck,
  reading: BookOpen,
  listening: Headphones,
  writing: PenTool,
  speaking: MessageSquare,
};

const   SKILL_COLORS = {
  grammar: `text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30`,
  vocabulary: `text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30`,
  reading: `text-violet-600 bg-violet-100 dark:bg-violet-900/30`,
  listening: `text-violet-500 bg-violet-100 dark:bg-violet-900/30`,
  writing: `text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30`,
  speaking: `text-violet-500 bg-violet-100 dark:bg-violet-900/30`,
};

const SKILL_LABELS = {
  grammar: `Gramática`,
  vocabulary: `Vocabulario`,
  reading: `Lectura`,
  listening: `Escucha`,
  writing: `Escritura`,
  speaking: `Conversación`,
};

export function SkillBadge({ skill, showLabel }) {
  const Icon = SKILL_ICONS[skill];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${SKILL_COLORS[skill]}`}
    >
      <Icon size={14} />
      {showLabel && SKILL_LABELS[skill]}
    </span>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon && <div className="text-gray-300 dark:text-gray-600">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-400 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
