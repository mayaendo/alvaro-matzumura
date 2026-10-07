"use client";

// Embedded Studio at /studio. Client module: the config holds functions.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes, singletons } from "./sanity/schemas";

const singletonTypes = new Set<string>(singletons.map((s) => s.type));

export default defineConfig({
  name: "alvaro-matzumura",
  title: "Alvaro Matzumura",
  basePath: "/studio",
  projectId: projectId || "not-configured",
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "+" menu…
    templates: (templates) => templates.filter((t) => !singletonTypes.has(t.schemaType)),
  },
  document: {
    // …nor duplicated or deleted.
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items(
            singletons.map(({ id, type, title }) =>
              S.listItem()
                .title(title)
                .id(id)
                .child(S.document().schemaType(type).documentId(id).title(title)),
            ),
          ),
    }),
  ],
});
