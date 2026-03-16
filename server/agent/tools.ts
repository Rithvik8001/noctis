import { SchemaType, type FunctionDeclaration } from "@google/generative-ai";

export const agentTools: FunctionDeclaration[] = [
  {
    name: `create_note`,
    description: `Creates a new note for the user. Use when
  the user wants to remember something, add a task, or schedule
   something for a specific date.`,
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: `A short title for note`,
        },
        content: {
          type: SchemaType.STRING,
          description: `The full content/body of the note.`,
        },
        scheduledFor: {
          type: SchemaType.STRING,
          description: `ISO 8601 datetime string if the note
  is scheduled for a specific date/time. Optional.`,
        },
      },
      required: [`title`, `content`],
    },
  },

  {
    name: `list_notes`,
    description: `Retrieves the user's notes. Use when the
  user asks to see their notes, or when you need to find a note
   before updating/completing it.`,
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        filter: {
          type: SchemaType.STRING,
          format: "enum",
          enum: [`all`, `completed`, `pending`],
          description: `Filter notes by status. Defaults to all.`,
        },
      },
      required: [],
    },
  },
  {
    name: `mark_note_complete`,
    description: `Marks a specific note as completed. Use
  when the user says they finished a task or 'did' something.`,
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        noteId: {
          type: SchemaType.STRING,
          description: `The ID of the note to mark as complete.`,
        },
      },
      required: [`noteId`],
    },
  },
  {
    name: "update_note",
    description: `Updates the title or content of an existing
   note.`,
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        noteId: { type: SchemaType.STRING },
        title: { type: SchemaType.STRING },
        content: { type: SchemaType.STRING },
      },
      required: ["noteId"],
    },
  },
  {
    name: "delete_note",
    description: "Deletes a note permanently.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        noteId: { type: SchemaType.STRING },
      },
      required: ["noteId"],
    },
  },
];
