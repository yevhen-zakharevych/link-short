"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createLinkInDb, updateLinkInDb, deleteLinkFromDb } from "@/data/links";
import type { Link } from "@/db/schema";

// Define input schema
const createLinkSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  shortCode: z
    .string()
    .min(3, "Short code must be at least 3 characters")
    .max(20, "Short code must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Short code can only contain letters, numbers, hyphens, and underscores",
    )
    .optional(),
});

// Define input type
type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLink(
  input: CreateLinkInput,
): Promise<{ success: true; data: Link } | { error: string }> {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  // 2. Validate input
  const validated = createLinkSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  // 3. Call data layer function
  try {
    const link = await createLinkInDb({
      userId,
      originalUrl: validated.data.originalUrl,
      shortCode: validated.data.shortCode,
    });
    return { success: true, data: link };
  } catch (error) {
    // Handle unique constraint violation for short code
    if (error instanceof Error && error.message.includes("unique")) {
      return {
        error: "This short code is already taken. Please choose another one.",
      };
    }

    return {
      error: error instanceof Error ? error.message : "Failed to create link",
    };
  }
}

// Define update link schema
const updateLinkSchema = z.object({
  linkId: z.number(),
  originalUrl: z.string().url("Please enter a valid URL"),
  shortCode: z
    .string()
    .min(3, "Short code must be at least 3 characters")
    .max(20, "Short code must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Short code can only contain letters, numbers, hyphens, and underscores",
    ),
});

// Define update link input type
type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export async function updateLink(
  input: UpdateLinkInput,
): Promise<{ success: true; data: Link } | { error: string }> {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  // 2. Validate input
  const validated = updateLinkSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  // 3. Call data layer function
  try {
    const updatedLink = await updateLinkInDb(validated.data.linkId, userId, {
      originalUrl: validated.data.originalUrl,
      shortCode: validated.data.shortCode,
    });

    if (!updatedLink) {
      return { error: "Link not found or unauthorized" };
    }

    return { success: true, data: updatedLink };
  } catch (error) {
    // Handle unique constraint violation for short code
    if (error instanceof Error && error.message.includes("unique")) {
      return {
        error: "This short code is already taken. Please choose another one.",
      };
    }

    return {
      error: error instanceof Error ? error.message : "Failed to update link",
    };
  }
}

// Define delete link schema
const deleteLinkSchema = z.object({
  linkId: z.number(),
});

// Define delete link input type
type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export async function deleteLink(
  input: DeleteLinkInput,
): Promise<{ success: true } | { error: string }> {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  // 2. Validate input
  const validated = deleteLinkSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  // 3. Call data layer function
  try {
    const deleted = await deleteLinkFromDb(validated.data.linkId, userId);

    if (!deleted) {
      return { error: "Link not found or unauthorized" };
    }

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete link",
    };
  }
}
