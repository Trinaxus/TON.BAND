export interface GalleryMetadata {
  jahr: string;
  galerie: string;
  kategorie: string;
  tags: string[];
  title?: string;
  description?: string;
  passwordProtected?: boolean;
  /**
   * Zugriffsberechtigung für die Galerie:
   * - 'public': Jeder kann sehen
   * - 'password': Passwortgeschützt
   * - 'internal': Nur für Admins
   * - 'locked': Gesperrt, für niemanden sichtbar
   */
  accessType?: 'public' | 'password' | 'internal' | 'locked';
}
