// 3 grupos de plataformas: Paid/Ads (7), Orgánico/Social (6), Otros (3).
// Determina qué SOP aplica la calculadora (Ignite = pauta con NSM+Tax Check, Comunidad = SMART orgánico).
export const PLATFORM_GROUPS = [
  {
    group: 'Paid / Ads',
    sop: 'SOP Ignite',
    items: [
      { value: 'meta-ads', label: 'Meta Ads' },
      { value: 'google-ads', label: 'Google Ads' },
      { value: 'tiktok-ads', label: 'TikTok Ads' },
      { value: 'linkedin-ads', label: 'LinkedIn Ads' },
      { value: 'programatica', label: 'Programática' },
      { value: 'mercado-ads', label: 'Mercado Ads' },
      { value: 'x-ads', label: 'X Ads' },
    ],
  },
  {
    group: 'Orgánico / Social',
    sop: 'SOP Comunidad',
    items: [
      { value: 'instagram-organico', label: 'Instagram orgánico' },
      { value: 'tiktok-organico', label: 'TikTok orgánico' },
      { value: 'facebook-organico', label: 'Facebook orgánico' },
      { value: 'linkedin-organico', label: 'LinkedIn orgánico' },
      { value: 'seo', label: 'SEO' },
      { value: 'email-marketing', label: 'Email marketing' },
    ],
  },
  {
    group: 'Otros',
    sop: 'SOP Setup',
    items: [
      { value: 'influencers', label: 'Influencers' },
      { value: 'pr-prensa', label: 'PR / Prensa' },
      { value: 'eventos', label: 'Eventos' },
    ],
  },
];
