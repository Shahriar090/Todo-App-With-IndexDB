import type { TodoContextType } from "@/types/types";
import { createContext } from "react";

export const TodoContext = createContext<TodoContextType|null>(null)