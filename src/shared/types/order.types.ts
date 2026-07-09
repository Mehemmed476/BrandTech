import type { z } from "zod";
import type { orderCreateSchema } from "@/shared/schemas";

export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
