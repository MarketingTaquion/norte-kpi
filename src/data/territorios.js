// Localidades/aglomerados urbanos de Argentina con población — base: INDEC,
// Censo Nacional de Población, Hogares y Viviendas 2022 (aglomerados urbanos,
// vía REDATAM). Se usa el aglomerado ("Gran X") en vez de la ciudad-proper en
// la mayoría de los casos, porque es lo que efectivamente segmentan las
// plataformas de pauta (Meta/Google no recortan por límite administrativo
// municipal) — ver docs/reference/territorios.md para el detalle de fuentes,
// entradas combinadas (ej. "Neuquén - Plottier - Cipolletti") y los casos
// donde dos fuentes daban cifras distintas (Bahía Blanca, Santa Fe).
//
// Actualizado a 2026: cada valor de Censo 2022 se multiplicó por el ratio de
// crecimiento nacional 2022→2026 (46.466.688 / 46.135.579 = 1,007177, INDEC
// "Estimaciones de población por departamento" 2022-2035,
// censo.gob.ar/wp-content/uploads/2026/02/base_estimaciones_pob_deptos_2022_2035.csv).
// Se usa el ratio NACIONAL, no uno por departamento: los aglomerados "Gran X"
// abarcan varios departamentos INDEC a la vez (igual que el GBA abarca 24
// partidos — ej. "Gran Córdoba" no es el departamento "Capital" de Córdoba,
// lo excede varias veces), y mapear cada localidad a su composición exacta
// de departamentos no es verificable sin una fuente que ya la traiga armada.
// El ajuste nacional es chico (+0,72% en 4 años) y evita inyectar error por
// una atribución de departamento incorrecta — ver docs/reference/territorios.md.
//
// No incluye "Gran Buenos Aires" como una sola entrada (16,2M) — CABA y cada
// partido del GBA están cargados por separado, porque agruparlos derrotaría
// el propósito de esta feature (poder acotar por zona real, no por "Buenos
// Aires" en general).
export const TERRITORIOS = [
  { value: 'caba', label: 'Ciudad Autónoma de Buenos Aires (CABA)', provincia: 'CABA', poblacion: 3144111 },
  { value: 'la-matanza', label: 'La Matanza', provincia: 'Buenos Aires', poblacion: 1850963 },
  { value: 'la-plata', label: 'Gran La Plata', provincia: 'Buenos Aires', poblacion: 937366 },
  { value: 'mar-del-plata', label: 'Mar del Plata (Gral. Pueyrredón)', provincia: 'Buenos Aires', poblacion: 648858 },
  { value: 'lomas-de-zamora', label: 'Lomas de Zamora', provincia: 'Buenos Aires', poblacion: 699313 },
  { value: 'quilmes', label: 'Quilmes', provincia: 'Buenos Aires', poblacion: 640591 },
  { value: 'almirante-brown', label: 'Almirante Brown', provincia: 'Buenos Aires', poblacion: 590057 },
  { value: 'merlo', label: 'Merlo', provincia: 'Buenos Aires', poblacion: 584974 },
  { value: 'moreno', label: 'Moreno', provincia: 'Buenos Aires', poblacion: 578496 },
  { value: 'florencio-varela', label: 'Florencio Varela', provincia: 'Buenos Aires', poblacion: 501391 },
  { value: 'lanus', label: 'Lanús', provincia: 'Buenos Aires', poblacion: 465367 },
  { value: 'general-san-martin', label: 'General San Martín', provincia: 'Buenos Aires', poblacion: 453567 },
  { value: 'tigre', label: 'Tigre', provincia: 'Buenos Aires', poblacion: 450999 },
  { value: 'pilar', label: 'Pilar', provincia: 'Buenos Aires', poblacion: 397907 },
  { value: 'avellaneda', label: 'Avellaneda', provincia: 'Buenos Aires', poblacion: 373601 },
  { value: 'tres-de-febrero', label: 'Tres de Febrero', provincia: 'Buenos Aires', poblacion: 369006 },
  { value: 'berazategui', label: 'Berazategui', provincia: 'Buenos Aires', poblacion: 363170 },
  { value: 'malvinas-argentinas', label: 'Malvinas Argentinas', provincia: 'Buenos Aires', poblacion: 354313 },
  { value: 'bahia-blanca', label: 'Bahía Blanca', provincia: 'Buenos Aires', poblacion: 337596 },
  { value: 'esteban-echeverria', label: 'Esteban Echeverría', provincia: 'Buenos Aires', poblacion: 341463 },
  { value: 'moron', label: 'Morón', provincia: 'Buenos Aires', poblacion: 336576 },
  { value: 'san-miguel-buenos-aires', label: 'San Miguel', provincia: 'Buenos Aires', poblacion: 331195 },
  { value: 'jose-c-paz', label: 'José C. Paz', provincia: 'Buenos Aires', poblacion: 329339 },
  { value: 'san-isidro', label: 'San Isidro', provincia: 'Buenos Aires', poblacion: 299416 },
  { value: 'vicente-lopez', label: 'Vicente López', provincia: 'Buenos Aires', poblacion: 284307 },
  { value: 'escobar', label: 'Escobar', provincia: 'Buenos Aires', poblacion: 258290 },
  { value: 'hurlingham', label: 'Hurlingham', provincia: 'Buenos Aires', poblacion: 186973 },
  { value: 'ituzaingo', label: 'Ituzaingó', provincia: 'Buenos Aires', poblacion: 181526 },
  { value: 'san-fernando', label: 'San Fernando', provincia: 'Buenos Aires', poblacion: 172848 },
  { value: 'tandil', label: 'Tandil', provincia: 'Buenos Aires', poblacion: 139543 },
  { value: 'zarate', label: 'Zárate', provincia: 'Buenos Aires', poblacion: 115730 },
  { value: 'campana', label: 'Campana', provincia: 'Buenos Aires', poblacion: 104983 },
  { value: 'olavarria', label: 'Olavarría', provincia: 'Buenos Aires', poblacion: 103646 },
  { value: 'pergamino', label: 'Pergamino', provincia: 'Buenos Aires', poblacion: 102915 },
  { value: 'junin', label: 'Junín', provincia: 'Buenos Aires', poblacion: 96070 },
  { value: 'necochea', label: 'Necochea - Quequén', provincia: 'Buenos Aires', poblacion: 94732 },
  { value: 'mercedes-buenos-aires', label: 'Mercedes (Buenos Aires)', provincia: 'Buenos Aires', poblacion: 67735 },
  { value: 'chivilcoy', label: 'Chivilcoy', provincia: 'Buenos Aires', poblacion: 66046 },
  { value: 'azul', label: 'Azul', provincia: 'Buenos Aires', poblacion: 65352 },
  { value: 'punta-alta', label: 'Punta Alta', provincia: 'Buenos Aires', poblacion: 64705 },
  { value: 'san-pedro-buenos-aires', label: 'San Pedro (Buenos Aires)', provincia: 'Buenos Aires', poblacion: 56876 },
  { value: 'tres-arroyos', label: 'Tres Arroyos', provincia: 'Buenos Aires', poblacion: 52574 },
  { value: 'chacabuco', label: 'Chacabuco', provincia: 'Buenos Aires', poblacion: 46773 },
  { value: 'balcarce', label: 'Balcarce', provincia: 'Buenos Aires', poblacion: 44728 },
  { value: 'nueve-de-julio', label: 'Nueve de Julio', provincia: 'Buenos Aires', poblacion: 42400 },
  { value: 'canuelas', label: 'Cañuelas', provincia: 'Buenos Aires', poblacion: 42101 },
  { value: 'trenque-lauquen', label: 'Trenque Lauquen', provincia: 'Buenos Aires', poblacion: 40262 },
  { value: 'chascomus', label: 'Chascomús', provincia: 'Buenos Aires', poblacion: 40234 },
  { value: 'pinamar', label: 'Pinamar - Divisadero', provincia: 'Buenos Aires', poblacion: 39583 },
  { value: 'bragado', label: 'Bragado', provincia: 'Buenos Aires', poblacion: 39072 },
  { value: 'villa-gesell', label: 'Villa Gesell', provincia: 'Buenos Aires', poblacion: 37563 },
  { value: 'pehuajo', label: 'Pehuajó', provincia: 'Buenos Aires', poblacion: 36769 },
  { value: 'lobos', label: 'Lobos', provincia: 'Buenos Aires', poblacion: 35975 },
  { value: 'baradero', label: 'Baradero', provincia: 'Buenos Aires', poblacion: 35643 },
  { value: 'miramar', label: 'Miramar - El Marquesado', provincia: 'Buenos Aires', poblacion: 35288 },
  { value: 'salto', label: 'Salto', provincia: 'Buenos Aires', poblacion: 34278 },
  { value: 'lincoln', label: 'Lincoln', provincia: 'Buenos Aires', poblacion: 33008 },
  { value: 'coronel-suarez', label: 'Coronel Suárez', provincia: 'Buenos Aires', poblacion: 32758 },
  { value: 'bolivar', label: 'San Carlos de Bolívar', provincia: 'Buenos Aires', poblacion: 31845 },
  { value: 'arrecifes', label: 'Arrecifes', provincia: 'Buenos Aires', poblacion: 30615 },
  { value: 'saladillo', label: 'Saladillo', provincia: 'Buenos Aires', poblacion: 30596 },
  { value: 'dolores', label: 'Dolores', provincia: 'Buenos Aires', poblacion: 30590 },

  { value: 'cordoba', label: 'Gran Córdoba', provincia: 'Córdoba', poblacion: 1717983 },
  { value: 'rio-cuarto', label: 'Gran Río Cuarto', provincia: 'Córdoba', poblacion: 191323 },
  { value: 'villa-maria', label: 'Villa María - Villa Nueva', provincia: 'Córdoba', poblacion: 122814 },
  { value: 'villa-carlos-paz', label: 'Villa Carlos Paz', provincia: 'Córdoba', poblacion: 84037 },
  { value: 'san-francisco', label: 'San Francisco - Frontera', provincia: 'Córdoba', poblacion: 80261 },
  { value: 'jesus-maria', label: 'Jesús María - Colonia Caroya - Sinsacate', provincia: 'Córdoba', poblacion: 63533 },
  { value: 'alta-gracia', label: 'Alta Gracia', provincia: 'Córdoba', poblacion: 60594 },
  { value: 'rio-tercero', label: 'Río Tercero', provincia: 'Córdoba', poblacion: 53357 },
  { value: 'cosquin', label: 'Cosquín - Santa María de Punilla - Bialet Massé', provincia: 'Córdoba', poblacion: 52697 },
  { value: 'villa-dolores', label: 'Villa Dolores', provincia: 'Córdoba', poblacion: 51052 },
  { value: 'rio-segundo', label: 'Río Segundo - Pilar', provincia: 'Córdoba', poblacion: 40918 },
  { value: 'la-falda', label: 'La Falda - Huerta Grande - Valle Hermoso', provincia: 'Córdoba', poblacion: 40599 },
  { value: 'bell-ville', label: 'Bell Ville', provincia: 'Córdoba', poblacion: 37570 },
  { value: 'cruz-del-eje', label: 'Cruz del Eje', provincia: 'Córdoba', poblacion: 34563 },

  { value: 'rosario', label: 'Gran Rosario', provincia: 'Santa Fe', poblacion: 1439550 },
  { value: 'santa-fe-ciudad', label: 'Gran Santa Fe', provincia: 'Santa Fe', poblacion: 533831 },
  { value: 'reconquista', label: 'Reconquista - Avellaneda', provincia: 'Santa Fe', poblacion: 112195 },
  { value: 'rafaela', label: 'Rafaela', provincia: 'Santa Fe', poblacion: 102198 },
  { value: 'venado-tuerto', label: 'Venado Tuerto', provincia: 'Santa Fe', poblacion: 82554 },
  { value: 'villa-constitucion', label: 'Villa Constitución', provincia: 'Santa Fe', poblacion: 52579 },
  { value: 'esperanza', label: 'Esperanza', provincia: 'Santa Fe', poblacion: 45759 },
  { value: 'casilda', label: 'Casilda', provincia: 'Santa Fe', poblacion: 38691 },
  { value: 'canada-de-gomez', label: 'Cañada de Gómez', provincia: 'Santa Fe', poblacion: 32145 },

  { value: 'mendoza', label: 'Gran Mendoza', provincia: 'Mendoza', poblacion: 1064478 },
  { value: 'san-rafael', label: 'San Rafael', provincia: 'Mendoza', poblacion: 140190 },
  { value: 'san-martin-mendoza', label: 'San Martín - La Colonia', provincia: 'Mendoza', poblacion: 106254 },
  { value: 'tunuyan', label: 'Tunuyán', provincia: 'Mendoza', poblacion: 38642 },
  { value: 'general-alvear', label: 'General Alvear', provincia: 'Mendoza', poblacion: 35882 },
  { value: 'rivadavia-mendoza', label: 'Rivadavia (Mendoza)', provincia: 'Mendoza', poblacion: 35080 },

  { value: 'tucuman', label: 'Gran San Miguel de Tucumán', provincia: 'Tucumán', poblacion: 1059745 },
  { value: 'tafi-viejo', label: 'Tafí Viejo', provincia: 'Tucumán', poblacion: 85653 },
  { value: 'concepcion-tucuman', label: 'Concepción - Arcadia - Alto Verde', provincia: 'Tucumán', poblacion: 65309 },
  { value: 'aguilares', label: 'Aguilares', provincia: 'Tucumán', poblacion: 44981 },
  { value: 'famailla', label: 'Famaillá', provincia: 'Tucumán', poblacion: 33333 },
  { value: 'monteros', label: 'Monteros', provincia: 'Tucumán', poblacion: 31223 },

  { value: 'salta', label: 'Gran Salta', provincia: 'Salta', poblacion: 675831 },
  { value: 'oran', label: 'San Ramón de la Nueva Orán', provincia: 'Salta', poblacion: 89505 },
  { value: 'tartagal', label: 'Tartagal', provincia: 'Salta', poblacion: 88727 },
  { value: 'general-guemes', label: 'General Güemes', provincia: 'Salta', poblacion: 38321 },
  { value: 'metan', label: 'San José de Metán', provincia: 'Salta', poblacion: 34849 },

  { value: 'san-juan', label: 'Gran San Juan', provincia: 'San Juan', poblacion: 550536 },
  { value: 'caucete', label: 'Caucete', provincia: 'San Juan', poblacion: 32687 },

  { value: 'santiago-del-estero', label: 'Santiago del Estero - La Banda', provincia: 'Santiago del Estero', poblacion: 452915 },
  { value: 'termas-de-rio-hondo', label: 'Termas de Río Hondo', provincia: 'Santiago del Estero', poblacion: 43068 },
  { value: 'frias', label: 'Frías', provincia: 'Santiago del Estero', poblacion: 33805 },

  { value: 'corrientes', label: 'Gran Corrientes', provincia: 'Corrientes', poblacion: 430599 },
  { value: 'goya', label: 'Goya', provincia: 'Corrientes', poblacion: 89587 },
  { value: 'mercedes-corrientes', label: 'Mercedes (Corrientes)', provincia: 'Corrientes', poblacion: 42417 },
  { value: 'curuzu-cuatia', label: 'Curuzú Cuatiá', provincia: 'Corrientes', poblacion: 41219 },
  { value: 'paso-de-los-libres', label: 'Paso de los Libres', provincia: 'Corrientes', poblacion: 51811 },
  { value: 'bella-vista', label: 'Bella Vista (Corrientes)', provincia: 'Corrientes', poblacion: 35801 },
  { value: 'gobernador-virasoro', label: 'Gobernador Virasoro', provincia: 'Corrientes', poblacion: 35402 },

  { value: 'resistencia', label: 'Gran Resistencia', provincia: 'Chaco', poblacion: 410543 },
  { value: 'saenz-pena', label: 'Presidencia Roque Sáenz Peña', provincia: 'Chaco', poblacion: 97561 },
  { value: 'villa-angela', label: 'Villa Ángela', provincia: 'Chaco', poblacion: 47186 },
  { value: 'general-jose-de-san-martin', label: 'General José de San Martín (Chaco)', provincia: 'Chaco', poblacion: 33463 },
  { value: 'charata', label: 'Charata', provincia: 'Chaco', poblacion: 31190 },

  { value: 'posadas', label: 'Gran Posadas', provincia: 'Misiones', poblacion: 391862 },
  { value: 'obera', label: 'Oberá', provincia: 'Misiones', poblacion: 75998 },
  { value: 'eldorado', label: 'Eldorado', provincia: 'Misiones', poblacion: 69215 },
  { value: 'puerto-iguazu', label: 'Puerto Iguazú', provincia: 'Misiones', poblacion: 54172 },
  { value: 'apostoles', label: 'Apóstoles', provincia: 'Misiones', poblacion: 30495 },

  { value: 'jujuy', label: 'Gran San Salvador de Jujuy', provincia: 'Jujuy', poblacion: 378491 },
  { value: 'san-pedro-jujuy', label: 'San Pedro - La Esperanza (Jujuy)', provincia: 'Jujuy', poblacion: 77669 },
  { value: 'perico', label: 'Perico', provincia: 'Jujuy', poblacion: 57035 },
  { value: 'libertador-general-san-martin', label: 'Libertador General San Martín (Jujuy)', provincia: 'Jujuy', poblacion: 47548 },

  { value: 'parana', label: 'Gran Paraná', provincia: 'Entre Ríos', poblacion: 304786 },
  { value: 'concordia', label: 'Concordia', provincia: 'Entre Ríos', poblacion: 176944 },
  { value: 'gualeguaychu', label: 'Gualeguaychú - Pueblo General Belgrano', provincia: 'Entre Ríos', poblacion: 98879 },
  { value: 'concepcion-del-uruguay', label: 'Concepción del Uruguay', provincia: 'Entre Ríos', poblacion: 86174 },
  { value: 'gualeguay', label: 'Gualeguay', provincia: 'Entre Ríos', poblacion: 44224 },
  { value: 'villaguay', label: 'Villaguay', provincia: 'Entre Ríos', poblacion: 39689 },
  { value: 'chajari', label: 'Chajarí', provincia: 'Entre Ríos', poblacion: 39675 },
  { value: 'victoria', label: 'Victoria (Entre Ríos)', provincia: 'Entre Ríos', poblacion: 35216 },

  { value: 'formosa', label: 'Formosa', provincia: 'Formosa', poblacion: 262193 },
  { value: 'clorinda', label: 'Clorinda', provincia: 'Formosa', poblacion: 56934 },

  { value: 'catamarca', label: 'Gran San Fernando del Valle de Catamarca', provincia: 'Catamarca', poblacion: 232019 },

  { value: 'san-luis', label: 'Gran San Luis', provincia: 'San Luis', poblacion: 227155 },
  { value: 'villa-mercedes', label: 'Villa Mercedes', provincia: 'San Luis', poblacion: 133024 },

  { value: 'la-rioja', label: 'La Rioja', provincia: 'La Rioja', poblacion: 210135 },
  { value: 'chilecito', label: 'Chilecito', provincia: 'La Rioja', poblacion: 39609 },

  { value: 'comodoro-rivadavia', label: 'Comodoro Rivadavia', provincia: 'Chubut', poblacion: 200800 },
  { value: 'trelew', label: 'Trelew', provincia: 'Chubut', poblacion: 105408 },
  { value: 'puerto-madryn', label: 'Puerto Madryn', provincia: 'Chubut', poblacion: 98326 },
  { value: 'esquel', label: 'Esquel', provincia: 'Chubut', poblacion: 36887 },

  { value: 'santa-rosa', label: 'Gran Santa Rosa', provincia: 'La Pampa', poblacion: 133841 },
  { value: 'general-pico', label: 'General Pico', provincia: 'La Pampa', poblacion: 67284 },

  { value: 'rio-gallegos', label: 'Río Gallegos', provincia: 'Santa Cruz', poblacion: 116353 },
  { value: 'caleta-olivia', label: 'Caleta Olivia', provincia: 'Santa Cruz', poblacion: 56714 },

  { value: 'rio-grande', label: 'Río Grande (Tierra del Fuego)', provincia: 'Tierra del Fuego', poblacion: 98312 },
  { value: 'ushuaia', label: 'Ushuaia', provincia: 'Tierra del Fuego', poblacion: 79979 },

  { value: 'neuquen', label: 'Neuquén - Plottier - Cipolletti', provincia: 'Neuquén', poblacion: 556300 },
  { value: 'cutral-co', label: 'Cutral Có - Plaza Huincul', provincia: 'Neuquén', poblacion: 56629 },
  { value: 'centenario', label: 'Centenario', provincia: 'Neuquén', poblacion: 42101 },
  { value: 'zapala', label: 'Zapala', provincia: 'Neuquén', poblacion: 40799 },
  { value: 'san-martin-de-los-andes', label: 'San Martín de los Andes', provincia: 'Neuquén', poblacion: 37374 },

  { value: 'bariloche', label: 'San Carlos de Bariloche', provincia: 'Río Negro', poblacion: 135947 },
  { value: 'general-roca', label: 'General Roca', provincia: 'Río Negro', poblacion: 103487 },
  { value: 'viedma', label: 'Viedma - Carmen de Patagones', provincia: 'Río Negro', poblacion: 83924 },
  { value: 'villa-regina', label: 'Villa Regina', provincia: 'Río Negro', poblacion: 30710 },

  { value: 'san-nicolas', label: 'Gran San Nicolás de los Arroyos', provincia: 'Buenos Aires', poblacion: 161501 },
  { value: 'mar-de-ajo', label: 'Mar de Ajó - Santa Teresita - Mar del Tuyú', provincia: 'Buenos Aires', poblacion: 83612 },
];
