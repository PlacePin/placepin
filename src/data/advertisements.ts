export interface Advertisement {
  id: string;
  businessName: string;
  tagline: string;
  link: string;
  imageUrl?: string;
}

// Placeholder entries until real local-business ads are onboarded.
// `imageUrl` is left unset for now - once a business provides creative,
// drop it in and the ad card will render it automatically.
export const advertisements: Advertisement[] = [
  {
    id: 'placeholder-1',
    businessName: 'Your Local Business',
    tagline: 'This ad space is reserved for a local business.',
    link: '/contact',
  },
  {
    id: 'placeholder-2',
    businessName: 'Advertise With PlacePin',
    tagline: 'Reach engaged renters and landlords in your area.',
    link: '/contact',
  },
  {
    id: 'placeholder-3',
    businessName: 'Ad Space Available',
    tagline: 'Interested in advertising here? Get in touch with us.',
    link: '/contact',
  },
];
