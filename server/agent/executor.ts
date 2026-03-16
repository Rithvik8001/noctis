import { db } from "../src/db/config/connection";
import { notesTable } from "../src/db/models";
import { eq, and } from "drizzle-orm";

export async function executeTool(
  toolName: string,
  args: Record<string, any>,
  userId: string,
) {
  switch (toolName) {
    case "create_note": {
      const [note] = await db
        .insert(notesTable)
        .values({
          noteId: crypto.randomUUID(),
          title: args.title,
          content: args.content,
          userId: userId,
          scheduledFor: args.scheduledFor ? new Date(args.scheduledFor) : null,
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return { success: true, note };
    }

    case "list_notes": {
      let notes;
      if (args.filter === "completed") {
        notes = await db
          .select()
          .from(notesTable)
          .where(
            and(
              eq(notesTable.userId, userId),
              eq(notesTable.isCompleted, true),
            ),
          );
      } else if (args.filter === "pending") {
        notes = await db
          .select()
          .from(notesTable)
          .where(
            and(
              eq(notesTable.userId, userId),
              eq(notesTable.isCompleted, false),
            ),
          );
      } else {
        notes = await db
          .select()
          .from(notesTable)
          .where(eq(notesTable.userId, userId));
      }
      return { notes };
    }

    case "mark_note_complete": {
      const [updated] = await db
        .update(notesTable)
        .set({ isCompleted: true, updatedAt: new Date() })
        .where(
          and(
            eq(notesTable.noteId, args.noteId),
            eq(notesTable.userId, userId),
          ),
        )
        .returning();
      return updated
        ? { success: true, note: updated }
        : {
            success: false,
            error: "Note not found",
          };
    }

    case "update_note": {
      const updates: any = { updatedAt: new Date() };
      if (args.title) updates.title = args.title;
      if (args.content) updates.content = args.content;
      const [updated] = await db
        .update(notesTable)
        .set(updates)
        .where(
          and(
            eq(notesTable.noteId, args.noteId),
            eq(notesTable.userId, userId),
          ),
        )
        .returning();
      return updated
        ? { success: true, note: updated }
        : {
            success: false,
            error: "Note not found",
          };
    }

    case "delete_note": {
      await db
        .delete(notesTable)
        .where(
          and(
            eq(notesTable.noteId, args.noteId),
            eq(notesTable.userId, userId),
          ),
        );
      return { success: true };
    }

    default:
      return { error: "Unknown tool" };
  }
}
