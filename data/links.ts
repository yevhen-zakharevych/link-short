import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { links, type Link, type NewLink } from "@/db/schema";

/**
 * Fetches all links for a specific user
 * @param userId - The Clerk user ID
 * @returns Array of links belonging to the user
 */
export async function getUserLinks(userId: string): Promise<Link[]> {
  return await db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}

/**
 * Generates a random short code for a link
 * @param length - Length of the short code (default: 6)
 * @returns A random alphanumeric string
 */
function generateShortCode(length: number = 6): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Creates a new link in the database
 * @param data - Link data including userId and originalUrl
 * @returns The created link
 */
export async function createLinkInDb(data: {
  userId: string;
  originalUrl: string;
  shortCode?: string;
}): Promise<Link> {
  // Use provided short code or generate a random one
  const shortCode = data.shortCode || generateShortCode();

  const newLink: NewLink = {
    userId: data.userId,
    originalUrl: data.originalUrl,
    shortCode,
  };

  const [createdLink] = await db.insert(links).values(newLink).returning();
  return createdLink;
}

/**
 * Updates an existing link in the database
 * @param linkId - The ID of the link to update
 * @param userId - The user ID who owns the link (for authorization)
 * @param data - Updated link data
 * @returns The updated link or null if not found or unauthorized
 */
export async function updateLinkInDb(
  linkId: number,
  userId: string,
  data: {
    originalUrl?: string;
    shortCode?: string;
  },
): Promise<Link | null> {
  const updateData: Partial<NewLink> = {
    ...data,
    updatedAt: new Date(),
  };

  const [updatedLink] = await db
    .update(links)
    .set(updateData)
    .where(eq(links.id, linkId))
    .returning();

  // Verify ownership
  if (!updatedLink || updatedLink.userId !== userId) {
    return null;
  }

  return updatedLink;
}

/**
 * Deletes a link from the database
 * @param linkId - The ID of the link to delete
 * @param userId - The user ID who owns the link (for authorization)
 * @returns True if deleted, false if not found or unauthorized
 */
export async function deleteLinkFromDb(
  linkId: number,
  userId: string,
): Promise<boolean> {
  const [deletedLink] = await db
    .delete(links)
    .where(eq(links.id, linkId))
    .returning();

  // Verify ownership
  if (!deletedLink || deletedLink.userId !== userId) {
    return false;
  }

  return true;
}

/**
 * Retrieves a link by its short code
 * @param shortCode - The short code to look up
 * @returns The link object or null if not found
 */
export async function getLinkByShortCode(
  shortCode: string,
): Promise<Link | null> {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return link || null;
}
