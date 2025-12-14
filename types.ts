export enum VideoAspectRatio {
  Square = "1:1",
  Landscape = "16:9",
  Portrait = "9:16",
  Ultrawide = "21:9"
}

export enum CameraMovement {
  Static = "Static",
  Pan = "Pan",
  Tilt = "Tilt",
  ZoomIn = "Zoom In",
  ZoomOut = "Zoom Out",
  Dolly = "Dolly",
  Handheld = "Handheld / Shake",
  FPV = "FPV Drone"
}

export enum LightingStyle {
  Natural = "Natural Daylight",
  Cinematic = "Cinematic / Dramatic",
  Neon = "Cyberpunk / Neon",
  Studio = "Studio Lighting",
  GoldenHour = "Golden Hour",
  Dark = "Low Key / Dark"
}

export enum ArtStyle {
  Photorealistic = "Photorealistic",
  Anime = "Anime / Manga",
  ThreeDRender = "3D Render (Octane)",
  OilPainting = "Oil Painting",
  Vintage = "Vintage Film (VHS)",
  Claymation = "Claymation",
  PixelArt = "Pixel Art (8-bit)",
  Abstract = "Abstract / Experimental",
  Surrealism = "Surrealism (Dreamlike)",
  Fantasy = "Fantasy / RPG",
  Cyberpunk = "Cyberpunk / Sci-Fi",
  Noir = "Film Noir / B&W",
  Watercolor = "Watercolor / Ink"
}

export interface PromptFormData {
  subject: string;
  action: string;
  environment: string;
  camera: CameraMovement;
  lighting: LightingStyle;
  style: ArtStyle;
  negativePrompt: string;
  aspectRatio: VideoAspectRatio;
  duration: number; // in seconds, hypothetical for prompt text
}

export interface GeneratedResult {
  optimizedPrompt: string;
  technicalDetails: string;
  explanation: string;
}