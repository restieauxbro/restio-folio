export const TOPICS = ["Advisory", "Build", "Enablement", "Something else"] as const;

export type ContactField = "name" | "email" | "company" | "topic" | "message";

export type ContactState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
      values?: Record<string, string>;
    }
  | { status: "sent"; name: string };
