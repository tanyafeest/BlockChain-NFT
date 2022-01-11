export const generateNftImage = (name: string, price: string, image: string, mimeType?: string): string => {
  return `https://og-image-green-seven.vercel.app/${encodeURIComponent(name)}.png?price=${price}&image=${image}&mime=${mimeType}`
}
