export interface Region {
  id: string;
  name: string;
  comunas: string[];
}

export const CHILE_REGIONS: Region[] = [
  {
    id: "RM",
    name: "Región Metropolitana de Santiago",
    comunas: [
      "Santiago Centro", "Providencia", "Las Condes", "Vitacura", "Ñuñoa", "La Reina", "Lo Barnechea",
      "Peñalolén", "Macul", "La Florida", "San Miguel", "San Joaquín", "La Cisterna", "Maipú",
      "Estación Central", "Pudahuel", "Quilicura", "Renca", "Conchalí", "Recoleta", "Independencia",
      "Huechuraba", "Puente Alto", "San Bernardo", "Colina", "Lampa", "Buin", "Paine", "Talagante", "Melipilla"
    ],
  },
  {
    id: "V",
    name: "Región de Valparaíso",
    comunas: ["Viña del Mar", "Valparaíso", "Concón", "Quilpué", "Villa Alemana", "Quillota", "San Antonio", "Los Andes", "San Felipe"],
  },
  {
    id: "VIII",
    name: "Región del Biobío",
    comunas: ["Concepción", "San Pedro de la Paz", "Talcahuano", "Chiguayante", "Hualpén", "Coronel", "Los Ángeles", "Chillán"],
  },
  {
    id: "IV",
    name: "Región de Coquimbo",
    comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel"],
  },
  {
    id: "II",
    name: "Región de Antofagasta",
    comunas: ["Antofagasta", "Calama", "Mejillones", "Tocopilla"],
  },
  {
    id: "IX",
    name: "Región de La Araucanía",
    comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"],
  },
  {
    id: "X",
    name: "Región de Los Lagos",
    comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud"],
  },
  {
    id: "VI",
    name: "Región del Libertador Bernardo O'Higgins",
    comunas: ["Rancagua", "Machalí", "Rengo", "San Fernando"],
  },
  {
    id: "VII",
    name: "Región del Maule",
    comunas: ["Talca", "Curicó", "Linares", "Constitución"],
  },
  {
    id: "I",
    name: "Región de Tarapacá",
    comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte"],
  },
  {
    id: "XV",
    name: "Región de Arica y Parinacota",
    comunas: ["Arica", "Putre"],
  },
  {
    id: "XIV",
    name: "Región de Los Ríos",
    comunas: ["Valdivia", "La Unión", "Panguipulli"],
  },
  {
    id: "III",
    name: "Región de Atacama",
    comunas: ["Copiapó", "Vallenar", "Caldera"],
  },
  {
    id: "XI",
    name: "Región de Aysén",
    comunas: ["Coyhaique", "Puerto Aysén"],
  },
  {
    id: "XII",
    name: "Región de Magallanes",
    comunas: ["Punta Arenas", "Puerto Natales"],
  },
];
