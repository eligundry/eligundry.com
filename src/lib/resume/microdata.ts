/**
 * Microdata properties for an element that is a technology the page's
 * schema.org Person knows about. Components spread it; rendered markdown
 * (`markTechnologyLinks()`) sets the same properties on its hast tree.
 */
export const KNOWS_ABOUT = {
  itemProp: 'knowsAbout',
  itemScope: true,
  itemType: 'https://schema.org/Thing',
}
