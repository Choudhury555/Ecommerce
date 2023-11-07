import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url'

export const client = sanityClient({
    projectId: 'pen9cz45',
    dataset: 'production',
    apiVersion: '2023-10-26',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN //Stored in .env file
});

const bulider = imageUrlBuilder(client);

export const urlFor = (source) => bulider.image(source);
