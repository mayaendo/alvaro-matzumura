import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Each section of the site is a single document (a "singleton") so the
 * editor sees three fixed pages — Inicio, Fotos, Motion — instead of lists.
 */

const mp4 = { accept: "video/mp4" };

export const home = defineType({
  name: "home",
  title: "Inicio",
  type: "document",
  fields: [
    defineField({
      name: "video",
      title: "Video principal",
      description: "MP4 corto en bucle, sin sonido. Idealmente menos de 15 MB.",
      type: "file",
      options: mp4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Imagen mientras carga",
      description: "Un fotograma del video. Se ve un instante antes de que empiece.",
      type: "image",
    }),
  ],
  preview: { prepare: () => ({ title: "Inicio" }) },
});

export const photos = defineType({
  name: "photos",
  title: "Fotos",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Fotos",
      description:
        "Arrastra para cambiar el orden. Puedes soltar varias fotos a la vez sobre la lista.",
      type: "array",
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          fields: [
            defineField({
              name: "alt",
              title: "Descripción breve",
              description: "Qué se ve en la foto (para accesibilidad y Google).",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Fotos" }) },
});

export const motion = defineType({
  name: "motion",
  title: "Motion",
  type: "document",
  fields: [
    defineField({
      name: "projects",
      title: "Proyectos",
      description: "Arrastra para cambiar el orden.",
      type: "array",
      of: [
        defineArrayMember({
          name: "project",
          title: "Proyecto",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Título",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Descripción",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "clip",
              title: "Clip en bucle",
              description:
                "MP4 corto (5–15 s), sin sonido, que se reproduce en la página. Idealmente menos de 10 MB.",
              type: "file",
              options: mp4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "poster",
              title: "Imagen mientras carga",
              type: "image",
            }),
            defineField({
              name: "vimeo",
              title: "Enlace de Vimeo (video completo)",
              description:
                "Opcional. Pega el enlace, p. ej. https://vimeo.com/1154904862. Al hacer clic se abre en un popup.",
              type: "url",
              validation: (rule) =>
                rule.custom((url) =>
                  !url || /vimeo\.com\/(?:video\/)?\d+/.test(url)
                    ? true
                    : "Debe ser un enlace de Vimeo, p. ej. https://vimeo.com/123456789",
                ),
            }),
          ],
          preview: {
            select: { title: "title", media: "poster" },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Motion" }) },
});

export const singletons = [
  { id: "home", type: "home", title: "Inicio" },
  { id: "photos", type: "photos", title: "Fotos" },
  { id: "motion", type: "motion", title: "Motion" },
] as const;

export const schemaTypes = [home, photos, motion];
