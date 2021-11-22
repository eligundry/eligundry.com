/* eslint-disable */

declare namespace GatsbyTypes {
type Maybe<T> = T | undefined;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
  ID: string;
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: string;
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: boolean;
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: number;
  /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: string;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: never;
};










type File = Node & {
  readonly sourceInstanceName: Scalars['String'];
  readonly absolutePath: Scalars['String'];
  readonly relativePath: Scalars['String'];
  readonly extension: Scalars['String'];
  readonly size: Scalars['Int'];
  readonly prettySize: Scalars['String'];
  readonly modifiedTime: Scalars['Date'];
  readonly accessTime: Scalars['Date'];
  readonly changeTime: Scalars['Date'];
  readonly birthTime: Scalars['Date'];
  readonly root: Scalars['String'];
  readonly dir: Scalars['String'];
  readonly base: Scalars['String'];
  readonly ext: Scalars['String'];
  readonly name: Scalars['String'];
  readonly relativeDirectory: Scalars['String'];
  readonly dev: Scalars['Int'];
  readonly mode: Scalars['Int'];
  readonly nlink: Scalars['Int'];
  readonly uid: Scalars['Int'];
  readonly gid: Scalars['Int'];
  readonly rdev: Scalars['Int'];
  readonly ino: Scalars['Float'];
  readonly atimeMs: Scalars['Float'];
  readonly mtimeMs: Scalars['Float'];
  readonly ctimeMs: Scalars['Float'];
  readonly atime: Scalars['Date'];
  readonly mtime: Scalars['Date'];
  readonly ctime: Scalars['Date'];
  /** @deprecated Use `birthTime` instead */
  readonly birthtime: Maybe<Scalars['Date']>;
  /** @deprecated Use `birthTime` instead */
  readonly birthtimeMs: Maybe<Scalars['Float']>;
  readonly blksize: Maybe<Scalars['Int']>;
  readonly blocks: Maybe<Scalars['Int']>;
  readonly url: Maybe<Scalars['String']>;
  /** Copy file to static directory and return public url to it */
  readonly publicURL: Maybe<Scalars['String']>;
  /** Returns all children nodes filtered by type ImageSharp */
  readonly childrenImageSharp: Maybe<ReadonlyArray<Maybe<ImageSharp>>>;
  /** Returns the first child node of type ImageSharp or null if there are no children of given type on this node */
  readonly childImageSharp: Maybe<ImageSharp>;
  /** Returns all children nodes filtered by type Mdx */
  readonly childrenMdx: Maybe<ReadonlyArray<Maybe<Mdx>>>;
  /** Returns the first child node of type Mdx or null if there are no children of given type on this node */
  readonly childMdx: Maybe<Mdx>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type File_modifiedTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_accessTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_changeTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_birthTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_atimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_mtimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_ctimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

/** Node Interface */
type Node = {
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type Internal = {
  readonly content: Maybe<Scalars['String']>;
  readonly contentDigest: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly fieldOwners: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly ignoreType: Maybe<Scalars['Boolean']>;
  readonly mediaType: Maybe<Scalars['String']>;
  readonly owner: Scalars['String'];
  readonly type: Scalars['String'];
};


type Directory = Node & {
  readonly sourceInstanceName: Scalars['String'];
  readonly absolutePath: Scalars['String'];
  readonly relativePath: Scalars['String'];
  readonly extension: Scalars['String'];
  readonly size: Scalars['Int'];
  readonly prettySize: Scalars['String'];
  readonly modifiedTime: Scalars['Date'];
  readonly accessTime: Scalars['Date'];
  readonly changeTime: Scalars['Date'];
  readonly birthTime: Scalars['Date'];
  readonly root: Scalars['String'];
  readonly dir: Scalars['String'];
  readonly base: Scalars['String'];
  readonly ext: Scalars['String'];
  readonly name: Scalars['String'];
  readonly relativeDirectory: Scalars['String'];
  readonly dev: Scalars['Int'];
  readonly mode: Scalars['Int'];
  readonly nlink: Scalars['Int'];
  readonly uid: Scalars['Int'];
  readonly gid: Scalars['Int'];
  readonly rdev: Scalars['Int'];
  readonly ino: Scalars['Float'];
  readonly atimeMs: Scalars['Float'];
  readonly mtimeMs: Scalars['Float'];
  readonly ctimeMs: Scalars['Float'];
  readonly atime: Scalars['Date'];
  readonly mtime: Scalars['Date'];
  readonly ctime: Scalars['Date'];
  /** @deprecated Use `birthTime` instead */
  readonly birthtime: Maybe<Scalars['Date']>;
  /** @deprecated Use `birthTime` instead */
  readonly birthtimeMs: Maybe<Scalars['Float']>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type Directory_modifiedTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_accessTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_changeTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_birthTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_atimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_mtimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_ctimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type Site = Node & {
  readonly buildTime: Maybe<Scalars['Date']>;
  readonly siteMetadata: Maybe<SiteSiteMetadata>;
  readonly port: Maybe<Scalars['Int']>;
  readonly host: Maybe<Scalars['String']>;
  readonly polyfill: Maybe<Scalars['Boolean']>;
  readonly pathPrefix: Maybe<Scalars['String']>;
  readonly jsxRuntime: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type Site_buildTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type SiteSiteMetadata = {
  readonly title: Maybe<Scalars['String']>;
  readonly description: Maybe<Scalars['String']>;
  readonly siteUrl: Maybe<Scalars['String']>;
  readonly rssMetadata: Maybe<SiteSiteMetadataRssMetadata>;
};

type SiteSiteMetadataRssMetadata = {
  readonly site_url: Maybe<Scalars['String']>;
  readonly feed_url: Maybe<Scalars['String']>;
  readonly title: Maybe<Scalars['String']>;
  readonly description: Maybe<Scalars['String']>;
  readonly copyright: Maybe<Scalars['String']>;
};

type SiteFunction = Node & {
  readonly functionRoute: Scalars['String'];
  readonly pluginName: Scalars['String'];
  readonly originalAbsoluteFilePath: Scalars['String'];
  readonly originalRelativeFilePath: Scalars['String'];
  readonly relativeCompiledFilePath: Scalars['String'];
  readonly absoluteCompiledFilePath: Scalars['String'];
  readonly matchPath: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type SitePage = Node & {
  readonly path: Scalars['String'];
  readonly component: Scalars['String'];
  readonly internalComponentName: Scalars['String'];
  readonly componentChunkName: Scalars['String'];
  readonly matchPath: Maybe<Scalars['String']>;
  readonly pageContext: Maybe<Scalars['JSON']>;
  readonly pluginCreator: Maybe<SitePlugin>;
  readonly fields: Maybe<SitePageFields>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type SitePlugin = Node & {
  readonly resolve: Maybe<Scalars['String']>;
  readonly name: Maybe<Scalars['String']>;
  readonly version: Maybe<Scalars['String']>;
  readonly nodeAPIs: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly browserAPIs: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly ssrAPIs: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly pluginFilepath: Maybe<Scalars['String']>;
  readonly pluginOptions: Maybe<Scalars['JSON']>;
  readonly packageJson: Maybe<Scalars['JSON']>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type SiteBuildMetadata = Node & {
  readonly buildTime: Maybe<Scalars['Date']>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type SiteBuildMetadata_buildTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type GatsbyImageFormat =
  | 'NO_CHANGE'
  | 'auto'
  | 'jpg'
  | 'png'
  | 'webp'
  | 'avif';

type GatsbyImageLayout =
  | 'fixed'
  | 'fullWidth'
  | 'constrained';

type GatsbyImagePlaceholder =
  | 'dominantColor'
  | 'tracedSVG'
  | 'blurred'
  | 'none';

type ImageFormat =
  | 'NO_CHANGE'
  | 'AUTO'
  | 'jpg'
  | 'png'
  | 'webp'
  | 'avif';

type ImageFit =
  | 'cover'
  | 'contain'
  | 'fill'
  | 'inside'
  | 'outside';

type ImageLayout =
  | 'fixed'
  | 'fullWidth'
  | 'constrained';

type ImageCropFocus =
  | 'CENTER'
  | 1
  | 5
  | 2
  | 6
  | 3
  | 7
  | 4
  | 8
  | 16
  | 17;

type DuotoneGradient = {
  readonly highlight: Scalars['String'];
  readonly shadow: Scalars['String'];
  readonly opacity: Maybe<Scalars['Int']>;
};

type PotraceTurnPolicy =
  | 'black'
  | 'white'
  | 'left'
  | 'right'
  | 'minority'
  | 'majority';

type Potrace = {
  readonly turnPolicy: Maybe<PotraceTurnPolicy>;
  readonly turdSize: Maybe<Scalars['Float']>;
  readonly alphaMax: Maybe<Scalars['Float']>;
  readonly optCurve: Maybe<Scalars['Boolean']>;
  readonly optTolerance: Maybe<Scalars['Float']>;
  readonly threshold: Maybe<Scalars['Int']>;
  readonly blackOnWhite: Maybe<Scalars['Boolean']>;
  readonly color: Maybe<Scalars['String']>;
  readonly background: Maybe<Scalars['String']>;
};

type ImageSharp = Node & {
  readonly fixed: Maybe<ImageSharpFixed>;
  readonly fluid: Maybe<ImageSharpFluid>;
  readonly gatsbyImageData: Scalars['JSON'];
  readonly original: Maybe<ImageSharpOriginal>;
  readonly resize: Maybe<ImageSharpResize>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type ImageSharp_fixedArgs = {
  width: Maybe<Scalars['Int']>;
  height: Maybe<Scalars['Int']>;
  base64Width: Maybe<Scalars['Int']>;
  jpegProgressive?: Maybe<Scalars['Boolean']>;
  pngCompressionSpeed?: Maybe<Scalars['Int']>;
  grayscale?: Maybe<Scalars['Boolean']>;
  duotone: Maybe<DuotoneGradient>;
  traceSVG: Maybe<Potrace>;
  quality: Maybe<Scalars['Int']>;
  jpegQuality: Maybe<Scalars['Int']>;
  pngQuality: Maybe<Scalars['Int']>;
  webpQuality: Maybe<Scalars['Int']>;
  toFormat?: Maybe<ImageFormat>;
  toFormatBase64?: Maybe<ImageFormat>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
  background?: Maybe<Scalars['String']>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
};


type ImageSharp_fluidArgs = {
  maxWidth: Maybe<Scalars['Int']>;
  maxHeight: Maybe<Scalars['Int']>;
  base64Width: Maybe<Scalars['Int']>;
  grayscale?: Maybe<Scalars['Boolean']>;
  jpegProgressive?: Maybe<Scalars['Boolean']>;
  pngCompressionSpeed?: Maybe<Scalars['Int']>;
  duotone: Maybe<DuotoneGradient>;
  traceSVG: Maybe<Potrace>;
  quality: Maybe<Scalars['Int']>;
  jpegQuality: Maybe<Scalars['Int']>;
  pngQuality: Maybe<Scalars['Int']>;
  webpQuality: Maybe<Scalars['Int']>;
  toFormat?: Maybe<ImageFormat>;
  toFormatBase64?: Maybe<ImageFormat>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
  background?: Maybe<Scalars['String']>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
  sizes?: Maybe<Scalars['String']>;
  srcSetBreakpoints?: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>;
};


type ImageSharp_gatsbyImageDataArgs = {
  layout?: Maybe<ImageLayout>;
  width: Maybe<Scalars['Int']>;
  height: Maybe<Scalars['Int']>;
  aspectRatio: Maybe<Scalars['Float']>;
  placeholder: Maybe<ImagePlaceholder>;
  blurredOptions: Maybe<BlurredOptions>;
  tracedSVGOptions: Maybe<Potrace>;
  formats: Maybe<ReadonlyArray<Maybe<ImageFormat>>>;
  outputPixelDensities: Maybe<ReadonlyArray<Maybe<Scalars['Float']>>>;
  breakpoints: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>;
  sizes: Maybe<Scalars['String']>;
  quality: Maybe<Scalars['Int']>;
  jpgOptions: Maybe<JPGOptions>;
  pngOptions: Maybe<PNGOptions>;
  webpOptions: Maybe<WebPOptions>;
  avifOptions: Maybe<AVIFOptions>;
  transformOptions: Maybe<TransformOptions>;
  backgroundColor: Maybe<Scalars['String']>;
};


type ImageSharp_resizeArgs = {
  width: Maybe<Scalars['Int']>;
  height: Maybe<Scalars['Int']>;
  quality: Maybe<Scalars['Int']>;
  jpegQuality: Maybe<Scalars['Int']>;
  pngQuality: Maybe<Scalars['Int']>;
  webpQuality: Maybe<Scalars['Int']>;
  jpegProgressive?: Maybe<Scalars['Boolean']>;
  pngCompressionLevel?: Maybe<Scalars['Int']>;
  pngCompressionSpeed?: Maybe<Scalars['Int']>;
  grayscale?: Maybe<Scalars['Boolean']>;
  duotone: Maybe<DuotoneGradient>;
  base64?: Maybe<Scalars['Boolean']>;
  traceSVG: Maybe<Potrace>;
  toFormat?: Maybe<ImageFormat>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
  background?: Maybe<Scalars['String']>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
};

type ImageSharpFixed = {
  readonly base64: Maybe<Scalars['String']>;
  readonly tracedSVG: Maybe<Scalars['String']>;
  readonly aspectRatio: Maybe<Scalars['Float']>;
  readonly width: Scalars['Float'];
  readonly height: Scalars['Float'];
  readonly src: Scalars['String'];
  readonly srcSet: Scalars['String'];
  readonly srcWebp: Maybe<Scalars['String']>;
  readonly srcSetWebp: Maybe<Scalars['String']>;
  readonly originalName: Maybe<Scalars['String']>;
};

type ImageSharpFluid = {
  readonly base64: Maybe<Scalars['String']>;
  readonly tracedSVG: Maybe<Scalars['String']>;
  readonly aspectRatio: Scalars['Float'];
  readonly src: Scalars['String'];
  readonly srcSet: Scalars['String'];
  readonly srcWebp: Maybe<Scalars['String']>;
  readonly srcSetWebp: Maybe<Scalars['String']>;
  readonly sizes: Scalars['String'];
  readonly originalImg: Maybe<Scalars['String']>;
  readonly originalName: Maybe<Scalars['String']>;
  readonly presentationWidth: Scalars['Int'];
  readonly presentationHeight: Scalars['Int'];
};

type ImagePlaceholder =
  | 'dominantColor'
  | 'tracedSVG'
  | 'blurred'
  | 'none';

type BlurredOptions = {
  /** Width of the generated low-res preview. Default is 20px */
  readonly width: Maybe<Scalars['Int']>;
  /** Force the output format for the low-res preview. Default is to use the same format as the input. You should rarely need to change this */
  readonly toFormat: Maybe<ImageFormat>;
};

type JPGOptions = {
  readonly quality: Maybe<Scalars['Int']>;
  readonly progressive: Maybe<Scalars['Boolean']>;
};

type PNGOptions = {
  readonly quality: Maybe<Scalars['Int']>;
  readonly compressionSpeed: Maybe<Scalars['Int']>;
};

type WebPOptions = {
  readonly quality: Maybe<Scalars['Int']>;
};

type AVIFOptions = {
  readonly quality: Maybe<Scalars['Int']>;
  readonly lossless: Maybe<Scalars['Boolean']>;
  readonly speed: Maybe<Scalars['Int']>;
};

type TransformOptions = {
  readonly grayscale: Maybe<Scalars['Boolean']>;
  readonly duotone: Maybe<DuotoneGradient>;
  readonly rotate: Maybe<Scalars['Int']>;
  readonly trim: Maybe<Scalars['Float']>;
  readonly cropFocus: Maybe<ImageCropFocus>;
  readonly fit: Maybe<ImageFit>;
};

type ImageSharpOriginal = {
  readonly width: Maybe<Scalars['Float']>;
  readonly height: Maybe<Scalars['Float']>;
  readonly src: Maybe<Scalars['String']>;
};

type ImageSharpResize = {
  readonly src: Maybe<Scalars['String']>;
  readonly tracedSVG: Maybe<Scalars['String']>;
  readonly width: Maybe<Scalars['Int']>;
  readonly height: Maybe<Scalars['Int']>;
  readonly aspectRatio: Maybe<Scalars['Float']>;
  readonly originalName: Maybe<Scalars['String']>;
};

type GoodreadsBook = Node & {
  readonly title: Maybe<Scalars['String']>;
  readonly author: Maybe<Scalars['String']>;
  readonly isbn: Maybe<Scalars['String']>;
  readonly isbn13: Maybe<Scalars['String']>;
  readonly asin: Maybe<Scalars['String']>;
  readonly pages: Maybe<Scalars['Int']>;
  readonly published: Maybe<Scalars['Date']>;
  readonly started: Maybe<Scalars['Date']>;
  readonly finished: Maybe<Scalars['Date']>;
  readonly cover: Maybe<Scalars['String']>;
  readonly coverImage: Maybe<File>;
  readonly url: Maybe<Scalars['String']>;
  readonly shelf: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type MdxFrontmatter = {
  readonly title: Scalars['String'];
  readonly date: Maybe<Scalars['Date']>;
  readonly description: Maybe<Scalars['String']>;
  readonly cover: Maybe<File>;
  readonly tags: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly slug: Maybe<Scalars['String']>;
  readonly location: Maybe<Scalars['String']>;
  readonly draft: Maybe<Scalars['Boolean']>;
};


type MdxFrontmatter_dateArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type MdxHeadingMdx = {
  readonly value: Maybe<Scalars['String']>;
  readonly depth: Maybe<Scalars['Int']>;
};

type HeadingsMdx =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

type MdxWordCount = {
  readonly paragraphs: Maybe<Scalars['Int']>;
  readonly sentences: Maybe<Scalars['Int']>;
  readonly words: Maybe<Scalars['Int']>;
};

type Mdx = Node & {
  readonly rawBody: Scalars['String'];
  readonly fileAbsolutePath: Scalars['String'];
  readonly frontmatter: Maybe<MdxFrontmatter>;
  readonly slug: Maybe<Scalars['String']>;
  readonly body: Scalars['String'];
  readonly excerpt: Scalars['String'];
  readonly headings: Maybe<ReadonlyArray<Maybe<MdxHeadingMdx>>>;
  readonly html: Maybe<Scalars['String']>;
  readonly mdxAST: Maybe<Scalars['JSON']>;
  readonly tableOfContents: Maybe<Scalars['JSON']>;
  readonly timeToRead: Maybe<Scalars['Int']>;
  readonly wordCount: Maybe<MdxWordCount>;
  readonly collection: Maybe<Scalars['String']>;
  readonly fields: Maybe<MdxFields>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type Mdx_excerptArgs = {
  pruneLength?: Maybe<Scalars['Int']>;
  truncate?: Maybe<Scalars['Boolean']>;
};


type Mdx_headingsArgs = {
  depth: Maybe<HeadingsMdx>;
};


type Mdx_tableOfContentsArgs = {
  maxDepth: Maybe<Scalars['Int']>;
};

type MdxFields = {
  readonly date: Maybe<Scalars['Date']>;
  readonly slug: Maybe<Scalars['String']>;
  readonly latestCommit: Maybe<MdxFieldsLatestCommit>;
};


type MdxFields_dateArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type MdxFieldsLatestCommit = {
  readonly date: Maybe<Scalars['Date']>;
  readonly message: Maybe<Scalars['String']>;
  readonly hash: Maybe<Scalars['String']>;
};


type MdxFieldsLatestCommit_dateArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type DownloadedImage = Node & {
  readonly url: Scalars['String'];
  readonly name: Scalars['String'];
  readonly image: Maybe<File>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type GitCommit = {
  readonly date: Maybe<Scalars['Date']>;
  readonly message: Maybe<Scalars['String']>;
  readonly hash: Maybe<Scalars['String']>;
};

type SitePageFields = {
  readonly latestCommit: Maybe<GitCommit>;
};

type feelings = Node & {
  readonly time: Scalars['String'];
  readonly mood: Scalars['String'];
  readonly activities: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly notes: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type LastfmTrack = Node & {
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
  readonly name: Maybe<Scalars['String']>;
  readonly loved: Maybe<Scalars['String']>;
  readonly mbid: Maybe<Scalars['String']>;
  readonly streamable: Maybe<Scalars['String']>;
  readonly url: Maybe<Scalars['String']>;
  readonly image: Maybe<ReadonlyArray<Maybe<LastfmTrackImage>>>;
  readonly playbacks: Maybe<ReadonlyArray<Maybe<LastfmPlayback>>>;
  readonly artist: Maybe<LastfmArtist>;
  readonly album: Maybe<LastfmAlbum>;
};

type LastfmTrackImage = {
  readonly size: Maybe<Scalars['String']>;
  readonly text: Maybe<Scalars['String']>;
};

type LastfmPlayback = Node & {
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
  readonly date: Maybe<Scalars['String']>;
  readonly track: Maybe<LastfmTrack>;
};

type LastfmMeta = Node & {
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
  readonly total_playbacks: Maybe<Scalars['String']>;
};

type LastfmArtist = Node & {
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
  readonly name: Maybe<Scalars['String']>;
  readonly mbid: Maybe<Scalars['String']>;
  readonly url: Maybe<Scalars['String']>;
  readonly image: Maybe<ReadonlyArray<Maybe<LastfmArtistImage>>>;
  readonly playbacks: Maybe<ReadonlyArray<Maybe<LastfmPlayback>>>;
  readonly albums: Maybe<ReadonlyArray<Maybe<LastfmAlbum>>>;
  readonly tracks: Maybe<ReadonlyArray<Maybe<LastfmTrack>>>;
};

type LastfmArtistImage = {
  readonly size: Maybe<Scalars['String']>;
  readonly text: Maybe<Scalars['String']>;
};

type LastfmAlbum = Node & {
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
  readonly name: Maybe<Scalars['String']>;
  readonly mbid: Maybe<Scalars['String']>;
  readonly url: Maybe<Scalars['String']>;
  readonly playbacks: Maybe<ReadonlyArray<Maybe<LastfmPlayback>>>;
  readonly artist: Maybe<LastfmArtist>;
  readonly tracks: Maybe<ReadonlyArray<Maybe<LastfmTrack>>>;
};

type Query = {
  readonly file: Maybe<File>;
  readonly allFile: FileConnection;
  readonly directory: Maybe<Directory>;
  readonly allDirectory: DirectoryConnection;
  readonly site: Maybe<Site>;
  readonly allSite: SiteConnection;
  readonly siteFunction: Maybe<SiteFunction>;
  readonly allSiteFunction: SiteFunctionConnection;
  readonly sitePage: Maybe<SitePage>;
  readonly allSitePage: SitePageConnection;
  readonly sitePlugin: Maybe<SitePlugin>;
  readonly allSitePlugin: SitePluginConnection;
  readonly siteBuildMetadata: Maybe<SiteBuildMetadata>;
  readonly allSiteBuildMetadata: SiteBuildMetadataConnection;
  readonly imageSharp: Maybe<ImageSharp>;
  readonly allImageSharp: ImageSharpConnection;
  readonly goodreadsBook: Maybe<GoodreadsBook>;
  readonly allGoodreadsBook: GoodreadsBookConnection;
  readonly mdx: Maybe<Mdx>;
  readonly allMdx: MdxConnection;
  readonly downloadedImage: Maybe<DownloadedImage>;
  readonly allDownloadedImage: DownloadedImageConnection;
  readonly feelings: Maybe<feelings>;
  readonly allFeelings: feelingsConnection;
  readonly lastfmTrack: Maybe<LastfmTrack>;
  readonly allLastfmTrack: LastfmTrackConnection;
  readonly lastfmPlayback: Maybe<LastfmPlayback>;
  readonly allLastfmPlayback: LastfmPlaybackConnection;
  readonly lastfmMeta: Maybe<LastfmMeta>;
  readonly allLastfmMeta: LastfmMetaConnection;
  readonly lastfmArtist: Maybe<LastfmArtist>;
  readonly allLastfmArtist: LastfmArtistConnection;
  readonly lastfmAlbum: Maybe<LastfmAlbum>;
  readonly allLastfmAlbum: LastfmAlbumConnection;
};


type Query_fileArgs = {
  sourceInstanceName: Maybe<StringQueryOperatorInput>;
  absolutePath: Maybe<StringQueryOperatorInput>;
  relativePath: Maybe<StringQueryOperatorInput>;
  extension: Maybe<StringQueryOperatorInput>;
  size: Maybe<IntQueryOperatorInput>;
  prettySize: Maybe<StringQueryOperatorInput>;
  modifiedTime: Maybe<DateQueryOperatorInput>;
  accessTime: Maybe<DateQueryOperatorInput>;
  changeTime: Maybe<DateQueryOperatorInput>;
  birthTime: Maybe<DateQueryOperatorInput>;
  root: Maybe<StringQueryOperatorInput>;
  dir: Maybe<StringQueryOperatorInput>;
  base: Maybe<StringQueryOperatorInput>;
  ext: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  relativeDirectory: Maybe<StringQueryOperatorInput>;
  dev: Maybe<IntQueryOperatorInput>;
  mode: Maybe<IntQueryOperatorInput>;
  nlink: Maybe<IntQueryOperatorInput>;
  uid: Maybe<IntQueryOperatorInput>;
  gid: Maybe<IntQueryOperatorInput>;
  rdev: Maybe<IntQueryOperatorInput>;
  ino: Maybe<FloatQueryOperatorInput>;
  atimeMs: Maybe<FloatQueryOperatorInput>;
  mtimeMs: Maybe<FloatQueryOperatorInput>;
  ctimeMs: Maybe<FloatQueryOperatorInput>;
  atime: Maybe<DateQueryOperatorInput>;
  mtime: Maybe<DateQueryOperatorInput>;
  ctime: Maybe<DateQueryOperatorInput>;
  birthtime: Maybe<DateQueryOperatorInput>;
  birthtimeMs: Maybe<FloatQueryOperatorInput>;
  blksize: Maybe<IntQueryOperatorInput>;
  blocks: Maybe<IntQueryOperatorInput>;
  url: Maybe<StringQueryOperatorInput>;
  publicURL: Maybe<StringQueryOperatorInput>;
  childrenImageSharp: Maybe<ImageSharpFilterListInput>;
  childImageSharp: Maybe<ImageSharpFilterInput>;
  childrenMdx: Maybe<MdxFilterListInput>;
  childMdx: Maybe<MdxFilterInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allFileArgs = {
  filter: Maybe<FileFilterInput>;
  sort: Maybe<FileSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_directoryArgs = {
  sourceInstanceName: Maybe<StringQueryOperatorInput>;
  absolutePath: Maybe<StringQueryOperatorInput>;
  relativePath: Maybe<StringQueryOperatorInput>;
  extension: Maybe<StringQueryOperatorInput>;
  size: Maybe<IntQueryOperatorInput>;
  prettySize: Maybe<StringQueryOperatorInput>;
  modifiedTime: Maybe<DateQueryOperatorInput>;
  accessTime: Maybe<DateQueryOperatorInput>;
  changeTime: Maybe<DateQueryOperatorInput>;
  birthTime: Maybe<DateQueryOperatorInput>;
  root: Maybe<StringQueryOperatorInput>;
  dir: Maybe<StringQueryOperatorInput>;
  base: Maybe<StringQueryOperatorInput>;
  ext: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  relativeDirectory: Maybe<StringQueryOperatorInput>;
  dev: Maybe<IntQueryOperatorInput>;
  mode: Maybe<IntQueryOperatorInput>;
  nlink: Maybe<IntQueryOperatorInput>;
  uid: Maybe<IntQueryOperatorInput>;
  gid: Maybe<IntQueryOperatorInput>;
  rdev: Maybe<IntQueryOperatorInput>;
  ino: Maybe<FloatQueryOperatorInput>;
  atimeMs: Maybe<FloatQueryOperatorInput>;
  mtimeMs: Maybe<FloatQueryOperatorInput>;
  ctimeMs: Maybe<FloatQueryOperatorInput>;
  atime: Maybe<DateQueryOperatorInput>;
  mtime: Maybe<DateQueryOperatorInput>;
  ctime: Maybe<DateQueryOperatorInput>;
  birthtime: Maybe<DateQueryOperatorInput>;
  birthtimeMs: Maybe<FloatQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allDirectoryArgs = {
  filter: Maybe<DirectoryFilterInput>;
  sort: Maybe<DirectorySortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_siteArgs = {
  buildTime: Maybe<DateQueryOperatorInput>;
  siteMetadata: Maybe<SiteSiteMetadataFilterInput>;
  port: Maybe<IntQueryOperatorInput>;
  host: Maybe<StringQueryOperatorInput>;
  polyfill: Maybe<BooleanQueryOperatorInput>;
  pathPrefix: Maybe<StringQueryOperatorInput>;
  jsxRuntime: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allSiteArgs = {
  filter: Maybe<SiteFilterInput>;
  sort: Maybe<SiteSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_siteFunctionArgs = {
  functionRoute: Maybe<StringQueryOperatorInput>;
  pluginName: Maybe<StringQueryOperatorInput>;
  originalAbsoluteFilePath: Maybe<StringQueryOperatorInput>;
  originalRelativeFilePath: Maybe<StringQueryOperatorInput>;
  relativeCompiledFilePath: Maybe<StringQueryOperatorInput>;
  absoluteCompiledFilePath: Maybe<StringQueryOperatorInput>;
  matchPath: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allSiteFunctionArgs = {
  filter: Maybe<SiteFunctionFilterInput>;
  sort: Maybe<SiteFunctionSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_sitePageArgs = {
  path: Maybe<StringQueryOperatorInput>;
  component: Maybe<StringQueryOperatorInput>;
  internalComponentName: Maybe<StringQueryOperatorInput>;
  componentChunkName: Maybe<StringQueryOperatorInput>;
  matchPath: Maybe<StringQueryOperatorInput>;
  pageContext: Maybe<JSONQueryOperatorInput>;
  pluginCreator: Maybe<SitePluginFilterInput>;
  fields: Maybe<SitePageFieldsFilterInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allSitePageArgs = {
  filter: Maybe<SitePageFilterInput>;
  sort: Maybe<SitePageSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_sitePluginArgs = {
  resolve: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  version: Maybe<StringQueryOperatorInput>;
  nodeAPIs: Maybe<StringQueryOperatorInput>;
  browserAPIs: Maybe<StringQueryOperatorInput>;
  ssrAPIs: Maybe<StringQueryOperatorInput>;
  pluginFilepath: Maybe<StringQueryOperatorInput>;
  pluginOptions: Maybe<JSONQueryOperatorInput>;
  packageJson: Maybe<JSONQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allSitePluginArgs = {
  filter: Maybe<SitePluginFilterInput>;
  sort: Maybe<SitePluginSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_siteBuildMetadataArgs = {
  buildTime: Maybe<DateQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allSiteBuildMetadataArgs = {
  filter: Maybe<SiteBuildMetadataFilterInput>;
  sort: Maybe<SiteBuildMetadataSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_imageSharpArgs = {
  fixed: Maybe<ImageSharpFixedFilterInput>;
  fluid: Maybe<ImageSharpFluidFilterInput>;
  gatsbyImageData: Maybe<JSONQueryOperatorInput>;
  original: Maybe<ImageSharpOriginalFilterInput>;
  resize: Maybe<ImageSharpResizeFilterInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allImageSharpArgs = {
  filter: Maybe<ImageSharpFilterInput>;
  sort: Maybe<ImageSharpSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_goodreadsBookArgs = {
  title: Maybe<StringQueryOperatorInput>;
  author: Maybe<StringQueryOperatorInput>;
  isbn: Maybe<StringQueryOperatorInput>;
  isbn13: Maybe<StringQueryOperatorInput>;
  asin: Maybe<StringQueryOperatorInput>;
  pages: Maybe<IntQueryOperatorInput>;
  published: Maybe<DateQueryOperatorInput>;
  started: Maybe<DateQueryOperatorInput>;
  finished: Maybe<DateQueryOperatorInput>;
  cover: Maybe<StringQueryOperatorInput>;
  coverImage: Maybe<FileFilterInput>;
  url: Maybe<StringQueryOperatorInput>;
  shelf: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allGoodreadsBookArgs = {
  filter: Maybe<GoodreadsBookFilterInput>;
  sort: Maybe<GoodreadsBookSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_mdxArgs = {
  rawBody: Maybe<StringQueryOperatorInput>;
  fileAbsolutePath: Maybe<StringQueryOperatorInput>;
  frontmatter: Maybe<MdxFrontmatterFilterInput>;
  slug: Maybe<StringQueryOperatorInput>;
  body: Maybe<StringQueryOperatorInput>;
  excerpt: Maybe<StringQueryOperatorInput>;
  headings: Maybe<MdxHeadingMdxFilterListInput>;
  html: Maybe<StringQueryOperatorInput>;
  mdxAST: Maybe<JSONQueryOperatorInput>;
  tableOfContents: Maybe<JSONQueryOperatorInput>;
  timeToRead: Maybe<IntQueryOperatorInput>;
  wordCount: Maybe<MdxWordCountFilterInput>;
  collection: Maybe<StringQueryOperatorInput>;
  fields: Maybe<MdxFieldsFilterInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allMdxArgs = {
  filter: Maybe<MdxFilterInput>;
  sort: Maybe<MdxSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_downloadedImageArgs = {
  url: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  image: Maybe<FileFilterInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allDownloadedImageArgs = {
  filter: Maybe<DownloadedImageFilterInput>;
  sort: Maybe<DownloadedImageSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_feelingsArgs = {
  time: Maybe<StringQueryOperatorInput>;
  mood: Maybe<StringQueryOperatorInput>;
  activities: Maybe<StringQueryOperatorInput>;
  notes: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allFeelingsArgs = {
  filter: Maybe<feelingsFilterInput>;
  sort: Maybe<feelingsSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_lastfmTrackArgs = {
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
  name: Maybe<StringQueryOperatorInput>;
  loved: Maybe<StringQueryOperatorInput>;
  mbid: Maybe<StringQueryOperatorInput>;
  streamable: Maybe<StringQueryOperatorInput>;
  url: Maybe<StringQueryOperatorInput>;
  image: Maybe<LastfmTrackImageFilterListInput>;
  playbacks: Maybe<LastfmPlaybackFilterListInput>;
  artist: Maybe<LastfmArtistFilterInput>;
  album: Maybe<LastfmAlbumFilterInput>;
};


type Query_allLastfmTrackArgs = {
  filter: Maybe<LastfmTrackFilterInput>;
  sort: Maybe<LastfmTrackSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_lastfmPlaybackArgs = {
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
  date: Maybe<StringQueryOperatorInput>;
  track: Maybe<LastfmTrackFilterInput>;
};


type Query_allLastfmPlaybackArgs = {
  filter: Maybe<LastfmPlaybackFilterInput>;
  sort: Maybe<LastfmPlaybackSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_lastfmMetaArgs = {
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
  total_playbacks: Maybe<StringQueryOperatorInput>;
};


type Query_allLastfmMetaArgs = {
  filter: Maybe<LastfmMetaFilterInput>;
  sort: Maybe<LastfmMetaSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_lastfmArtistArgs = {
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
  name: Maybe<StringQueryOperatorInput>;
  mbid: Maybe<StringQueryOperatorInput>;
  url: Maybe<StringQueryOperatorInput>;
  image: Maybe<LastfmArtistImageFilterListInput>;
  playbacks: Maybe<LastfmPlaybackFilterListInput>;
  albums: Maybe<LastfmAlbumFilterListInput>;
  tracks: Maybe<LastfmTrackFilterListInput>;
};


type Query_allLastfmArtistArgs = {
  filter: Maybe<LastfmArtistFilterInput>;
  sort: Maybe<LastfmArtistSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_lastfmAlbumArgs = {
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
  name: Maybe<StringQueryOperatorInput>;
  mbid: Maybe<StringQueryOperatorInput>;
  url: Maybe<StringQueryOperatorInput>;
  playbacks: Maybe<LastfmPlaybackFilterListInput>;
  artist: Maybe<LastfmArtistFilterInput>;
  tracks: Maybe<LastfmTrackFilterListInput>;
};


type Query_allLastfmAlbumArgs = {
  filter: Maybe<LastfmAlbumFilterInput>;
  sort: Maybe<LastfmAlbumSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};

type StringQueryOperatorInput = {
  readonly eq: Maybe<Scalars['String']>;
  readonly ne: Maybe<Scalars['String']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly regex: Maybe<Scalars['String']>;
  readonly glob: Maybe<Scalars['String']>;
};

type IntQueryOperatorInput = {
  readonly eq: Maybe<Scalars['Int']>;
  readonly ne: Maybe<Scalars['Int']>;
  readonly gt: Maybe<Scalars['Int']>;
  readonly gte: Maybe<Scalars['Int']>;
  readonly lt: Maybe<Scalars['Int']>;
  readonly lte: Maybe<Scalars['Int']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>;
};

type DateQueryOperatorInput = {
  readonly eq: Maybe<Scalars['Date']>;
  readonly ne: Maybe<Scalars['Date']>;
  readonly gt: Maybe<Scalars['Date']>;
  readonly gte: Maybe<Scalars['Date']>;
  readonly lt: Maybe<Scalars['Date']>;
  readonly lte: Maybe<Scalars['Date']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['Date']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['Date']>>>;
};

type FloatQueryOperatorInput = {
  readonly eq: Maybe<Scalars['Float']>;
  readonly ne: Maybe<Scalars['Float']>;
  readonly gt: Maybe<Scalars['Float']>;
  readonly gte: Maybe<Scalars['Float']>;
  readonly lt: Maybe<Scalars['Float']>;
  readonly lte: Maybe<Scalars['Float']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['Float']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['Float']>>>;
};

type ImageSharpFilterListInput = {
  readonly elemMatch: Maybe<ImageSharpFilterInput>;
};

type ImageSharpFilterInput = {
  readonly fixed: Maybe<ImageSharpFixedFilterInput>;
  readonly fluid: Maybe<ImageSharpFluidFilterInput>;
  readonly gatsbyImageData: Maybe<JSONQueryOperatorInput>;
  readonly original: Maybe<ImageSharpOriginalFilterInput>;
  readonly resize: Maybe<ImageSharpResizeFilterInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type ImageSharpFixedFilterInput = {
  readonly base64: Maybe<StringQueryOperatorInput>;
  readonly tracedSVG: Maybe<StringQueryOperatorInput>;
  readonly aspectRatio: Maybe<FloatQueryOperatorInput>;
  readonly width: Maybe<FloatQueryOperatorInput>;
  readonly height: Maybe<FloatQueryOperatorInput>;
  readonly src: Maybe<StringQueryOperatorInput>;
  readonly srcSet: Maybe<StringQueryOperatorInput>;
  readonly srcWebp: Maybe<StringQueryOperatorInput>;
  readonly srcSetWebp: Maybe<StringQueryOperatorInput>;
  readonly originalName: Maybe<StringQueryOperatorInput>;
};

type ImageSharpFluidFilterInput = {
  readonly base64: Maybe<StringQueryOperatorInput>;
  readonly tracedSVG: Maybe<StringQueryOperatorInput>;
  readonly aspectRatio: Maybe<FloatQueryOperatorInput>;
  readonly src: Maybe<StringQueryOperatorInput>;
  readonly srcSet: Maybe<StringQueryOperatorInput>;
  readonly srcWebp: Maybe<StringQueryOperatorInput>;
  readonly srcSetWebp: Maybe<StringQueryOperatorInput>;
  readonly sizes: Maybe<StringQueryOperatorInput>;
  readonly originalImg: Maybe<StringQueryOperatorInput>;
  readonly originalName: Maybe<StringQueryOperatorInput>;
  readonly presentationWidth: Maybe<IntQueryOperatorInput>;
  readonly presentationHeight: Maybe<IntQueryOperatorInput>;
};

type JSONQueryOperatorInput = {
  readonly eq: Maybe<Scalars['JSON']>;
  readonly ne: Maybe<Scalars['JSON']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['JSON']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['JSON']>>>;
  readonly regex: Maybe<Scalars['JSON']>;
  readonly glob: Maybe<Scalars['JSON']>;
};

type ImageSharpOriginalFilterInput = {
  readonly width: Maybe<FloatQueryOperatorInput>;
  readonly height: Maybe<FloatQueryOperatorInput>;
  readonly src: Maybe<StringQueryOperatorInput>;
};

type ImageSharpResizeFilterInput = {
  readonly src: Maybe<StringQueryOperatorInput>;
  readonly tracedSVG: Maybe<StringQueryOperatorInput>;
  readonly width: Maybe<IntQueryOperatorInput>;
  readonly height: Maybe<IntQueryOperatorInput>;
  readonly aspectRatio: Maybe<FloatQueryOperatorInput>;
  readonly originalName: Maybe<StringQueryOperatorInput>;
};

type NodeFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type NodeFilterListInput = {
  readonly elemMatch: Maybe<NodeFilterInput>;
};

type InternalFilterInput = {
  readonly content: Maybe<StringQueryOperatorInput>;
  readonly contentDigest: Maybe<StringQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly fieldOwners: Maybe<StringQueryOperatorInput>;
  readonly ignoreType: Maybe<BooleanQueryOperatorInput>;
  readonly mediaType: Maybe<StringQueryOperatorInput>;
  readonly owner: Maybe<StringQueryOperatorInput>;
  readonly type: Maybe<StringQueryOperatorInput>;
};

type BooleanQueryOperatorInput = {
  readonly eq: Maybe<Scalars['Boolean']>;
  readonly ne: Maybe<Scalars['Boolean']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['Boolean']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['Boolean']>>>;
};

type MdxFilterListInput = {
  readonly elemMatch: Maybe<MdxFilterInput>;
};

type MdxFilterInput = {
  readonly rawBody: Maybe<StringQueryOperatorInput>;
  readonly fileAbsolutePath: Maybe<StringQueryOperatorInput>;
  readonly frontmatter: Maybe<MdxFrontmatterFilterInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly body: Maybe<StringQueryOperatorInput>;
  readonly excerpt: Maybe<StringQueryOperatorInput>;
  readonly headings: Maybe<MdxHeadingMdxFilterListInput>;
  readonly html: Maybe<StringQueryOperatorInput>;
  readonly mdxAST: Maybe<JSONQueryOperatorInput>;
  readonly tableOfContents: Maybe<JSONQueryOperatorInput>;
  readonly timeToRead: Maybe<IntQueryOperatorInput>;
  readonly wordCount: Maybe<MdxWordCountFilterInput>;
  readonly collection: Maybe<StringQueryOperatorInput>;
  readonly fields: Maybe<MdxFieldsFilterInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type MdxFrontmatterFilterInput = {
  readonly title: Maybe<StringQueryOperatorInput>;
  readonly date: Maybe<DateQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly cover: Maybe<FileFilterInput>;
  readonly tags: Maybe<StringQueryOperatorInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly location: Maybe<StringQueryOperatorInput>;
  readonly draft: Maybe<BooleanQueryOperatorInput>;
};

type FileFilterInput = {
  readonly sourceInstanceName: Maybe<StringQueryOperatorInput>;
  readonly absolutePath: Maybe<StringQueryOperatorInput>;
  readonly relativePath: Maybe<StringQueryOperatorInput>;
  readonly extension: Maybe<StringQueryOperatorInput>;
  readonly size: Maybe<IntQueryOperatorInput>;
  readonly prettySize: Maybe<StringQueryOperatorInput>;
  readonly modifiedTime: Maybe<DateQueryOperatorInput>;
  readonly accessTime: Maybe<DateQueryOperatorInput>;
  readonly changeTime: Maybe<DateQueryOperatorInput>;
  readonly birthTime: Maybe<DateQueryOperatorInput>;
  readonly root: Maybe<StringQueryOperatorInput>;
  readonly dir: Maybe<StringQueryOperatorInput>;
  readonly base: Maybe<StringQueryOperatorInput>;
  readonly ext: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly relativeDirectory: Maybe<StringQueryOperatorInput>;
  readonly dev: Maybe<IntQueryOperatorInput>;
  readonly mode: Maybe<IntQueryOperatorInput>;
  readonly nlink: Maybe<IntQueryOperatorInput>;
  readonly uid: Maybe<IntQueryOperatorInput>;
  readonly gid: Maybe<IntQueryOperatorInput>;
  readonly rdev: Maybe<IntQueryOperatorInput>;
  readonly ino: Maybe<FloatQueryOperatorInput>;
  readonly atimeMs: Maybe<FloatQueryOperatorInput>;
  readonly mtimeMs: Maybe<FloatQueryOperatorInput>;
  readonly ctimeMs: Maybe<FloatQueryOperatorInput>;
  readonly atime: Maybe<DateQueryOperatorInput>;
  readonly mtime: Maybe<DateQueryOperatorInput>;
  readonly ctime: Maybe<DateQueryOperatorInput>;
  readonly birthtime: Maybe<DateQueryOperatorInput>;
  readonly birthtimeMs: Maybe<FloatQueryOperatorInput>;
  readonly blksize: Maybe<IntQueryOperatorInput>;
  readonly blocks: Maybe<IntQueryOperatorInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
  readonly publicURL: Maybe<StringQueryOperatorInput>;
  readonly childrenImageSharp: Maybe<ImageSharpFilterListInput>;
  readonly childImageSharp: Maybe<ImageSharpFilterInput>;
  readonly childrenMdx: Maybe<MdxFilterListInput>;
  readonly childMdx: Maybe<MdxFilterInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type MdxHeadingMdxFilterListInput = {
  readonly elemMatch: Maybe<MdxHeadingMdxFilterInput>;
};

type MdxHeadingMdxFilterInput = {
  readonly value: Maybe<StringQueryOperatorInput>;
  readonly depth: Maybe<IntQueryOperatorInput>;
};

type MdxWordCountFilterInput = {
  readonly paragraphs: Maybe<IntQueryOperatorInput>;
  readonly sentences: Maybe<IntQueryOperatorInput>;
  readonly words: Maybe<IntQueryOperatorInput>;
};

type MdxFieldsFilterInput = {
  readonly date: Maybe<DateQueryOperatorInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly latestCommit: Maybe<MdxFieldsLatestCommitFilterInput>;
};

type MdxFieldsLatestCommitFilterInput = {
  readonly date: Maybe<DateQueryOperatorInput>;
  readonly message: Maybe<StringQueryOperatorInput>;
  readonly hash: Maybe<StringQueryOperatorInput>;
};

type FileConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<FileEdge>;
  readonly nodes: ReadonlyArray<File>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<FileGroupConnection>;
};


type FileConnection_distinctArgs = {
  field: FileFieldsEnum;
};


type FileConnection_maxArgs = {
  field: FileFieldsEnum;
};


type FileConnection_minArgs = {
  field: FileFieldsEnum;
};


type FileConnection_sumArgs = {
  field: FileFieldsEnum;
};


type FileConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: FileFieldsEnum;
};

type FileEdge = {
  readonly next: Maybe<File>;
  readonly node: File;
  readonly previous: Maybe<File>;
};

type PageInfo = {
  readonly currentPage: Scalars['Int'];
  readonly hasPreviousPage: Scalars['Boolean'];
  readonly hasNextPage: Scalars['Boolean'];
  readonly itemCount: Scalars['Int'];
  readonly pageCount: Scalars['Int'];
  readonly perPage: Maybe<Scalars['Int']>;
  readonly totalCount: Scalars['Int'];
};

type FileFieldsEnum =
  | 'sourceInstanceName'
  | 'absolutePath'
  | 'relativePath'
  | 'extension'
  | 'size'
  | 'prettySize'
  | 'modifiedTime'
  | 'accessTime'
  | 'changeTime'
  | 'birthTime'
  | 'root'
  | 'dir'
  | 'base'
  | 'ext'
  | 'name'
  | 'relativeDirectory'
  | 'dev'
  | 'mode'
  | 'nlink'
  | 'uid'
  | 'gid'
  | 'rdev'
  | 'ino'
  | 'atimeMs'
  | 'mtimeMs'
  | 'ctimeMs'
  | 'atime'
  | 'mtime'
  | 'ctime'
  | 'birthtime'
  | 'birthtimeMs'
  | 'blksize'
  | 'blocks'
  | 'url'
  | 'publicURL'
  | 'childrenImageSharp'
  | 'childrenImageSharp.fixed.base64'
  | 'childrenImageSharp.fixed.tracedSVG'
  | 'childrenImageSharp.fixed.aspectRatio'
  | 'childrenImageSharp.fixed.width'
  | 'childrenImageSharp.fixed.height'
  | 'childrenImageSharp.fixed.src'
  | 'childrenImageSharp.fixed.srcSet'
  | 'childrenImageSharp.fixed.srcWebp'
  | 'childrenImageSharp.fixed.srcSetWebp'
  | 'childrenImageSharp.fixed.originalName'
  | 'childrenImageSharp.fluid.base64'
  | 'childrenImageSharp.fluid.tracedSVG'
  | 'childrenImageSharp.fluid.aspectRatio'
  | 'childrenImageSharp.fluid.src'
  | 'childrenImageSharp.fluid.srcSet'
  | 'childrenImageSharp.fluid.srcWebp'
  | 'childrenImageSharp.fluid.srcSetWebp'
  | 'childrenImageSharp.fluid.sizes'
  | 'childrenImageSharp.fluid.originalImg'
  | 'childrenImageSharp.fluid.originalName'
  | 'childrenImageSharp.fluid.presentationWidth'
  | 'childrenImageSharp.fluid.presentationHeight'
  | 'childrenImageSharp.gatsbyImageData'
  | 'childrenImageSharp.original.width'
  | 'childrenImageSharp.original.height'
  | 'childrenImageSharp.original.src'
  | 'childrenImageSharp.resize.src'
  | 'childrenImageSharp.resize.tracedSVG'
  | 'childrenImageSharp.resize.width'
  | 'childrenImageSharp.resize.height'
  | 'childrenImageSharp.resize.aspectRatio'
  | 'childrenImageSharp.resize.originalName'
  | 'childrenImageSharp.id'
  | 'childrenImageSharp.parent.id'
  | 'childrenImageSharp.parent.parent.id'
  | 'childrenImageSharp.parent.parent.children'
  | 'childrenImageSharp.parent.children'
  | 'childrenImageSharp.parent.children.id'
  | 'childrenImageSharp.parent.children.children'
  | 'childrenImageSharp.parent.internal.content'
  | 'childrenImageSharp.parent.internal.contentDigest'
  | 'childrenImageSharp.parent.internal.description'
  | 'childrenImageSharp.parent.internal.fieldOwners'
  | 'childrenImageSharp.parent.internal.ignoreType'
  | 'childrenImageSharp.parent.internal.mediaType'
  | 'childrenImageSharp.parent.internal.owner'
  | 'childrenImageSharp.parent.internal.type'
  | 'childrenImageSharp.children'
  | 'childrenImageSharp.children.id'
  | 'childrenImageSharp.children.parent.id'
  | 'childrenImageSharp.children.parent.children'
  | 'childrenImageSharp.children.children'
  | 'childrenImageSharp.children.children.id'
  | 'childrenImageSharp.children.children.children'
  | 'childrenImageSharp.children.internal.content'
  | 'childrenImageSharp.children.internal.contentDigest'
  | 'childrenImageSharp.children.internal.description'
  | 'childrenImageSharp.children.internal.fieldOwners'
  | 'childrenImageSharp.children.internal.ignoreType'
  | 'childrenImageSharp.children.internal.mediaType'
  | 'childrenImageSharp.children.internal.owner'
  | 'childrenImageSharp.children.internal.type'
  | 'childrenImageSharp.internal.content'
  | 'childrenImageSharp.internal.contentDigest'
  | 'childrenImageSharp.internal.description'
  | 'childrenImageSharp.internal.fieldOwners'
  | 'childrenImageSharp.internal.ignoreType'
  | 'childrenImageSharp.internal.mediaType'
  | 'childrenImageSharp.internal.owner'
  | 'childrenImageSharp.internal.type'
  | 'childImageSharp.fixed.base64'
  | 'childImageSharp.fixed.tracedSVG'
  | 'childImageSharp.fixed.aspectRatio'
  | 'childImageSharp.fixed.width'
  | 'childImageSharp.fixed.height'
  | 'childImageSharp.fixed.src'
  | 'childImageSharp.fixed.srcSet'
  | 'childImageSharp.fixed.srcWebp'
  | 'childImageSharp.fixed.srcSetWebp'
  | 'childImageSharp.fixed.originalName'
  | 'childImageSharp.fluid.base64'
  | 'childImageSharp.fluid.tracedSVG'
  | 'childImageSharp.fluid.aspectRatio'
  | 'childImageSharp.fluid.src'
  | 'childImageSharp.fluid.srcSet'
  | 'childImageSharp.fluid.srcWebp'
  | 'childImageSharp.fluid.srcSetWebp'
  | 'childImageSharp.fluid.sizes'
  | 'childImageSharp.fluid.originalImg'
  | 'childImageSharp.fluid.originalName'
  | 'childImageSharp.fluid.presentationWidth'
  | 'childImageSharp.fluid.presentationHeight'
  | 'childImageSharp.gatsbyImageData'
  | 'childImageSharp.original.width'
  | 'childImageSharp.original.height'
  | 'childImageSharp.original.src'
  | 'childImageSharp.resize.src'
  | 'childImageSharp.resize.tracedSVG'
  | 'childImageSharp.resize.width'
  | 'childImageSharp.resize.height'
  | 'childImageSharp.resize.aspectRatio'
  | 'childImageSharp.resize.originalName'
  | 'childImageSharp.id'
  | 'childImageSharp.parent.id'
  | 'childImageSharp.parent.parent.id'
  | 'childImageSharp.parent.parent.children'
  | 'childImageSharp.parent.children'
  | 'childImageSharp.parent.children.id'
  | 'childImageSharp.parent.children.children'
  | 'childImageSharp.parent.internal.content'
  | 'childImageSharp.parent.internal.contentDigest'
  | 'childImageSharp.parent.internal.description'
  | 'childImageSharp.parent.internal.fieldOwners'
  | 'childImageSharp.parent.internal.ignoreType'
  | 'childImageSharp.parent.internal.mediaType'
  | 'childImageSharp.parent.internal.owner'
  | 'childImageSharp.parent.internal.type'
  | 'childImageSharp.children'
  | 'childImageSharp.children.id'
  | 'childImageSharp.children.parent.id'
  | 'childImageSharp.children.parent.children'
  | 'childImageSharp.children.children'
  | 'childImageSharp.children.children.id'
  | 'childImageSharp.children.children.children'
  | 'childImageSharp.children.internal.content'
  | 'childImageSharp.children.internal.contentDigest'
  | 'childImageSharp.children.internal.description'
  | 'childImageSharp.children.internal.fieldOwners'
  | 'childImageSharp.children.internal.ignoreType'
  | 'childImageSharp.children.internal.mediaType'
  | 'childImageSharp.children.internal.owner'
  | 'childImageSharp.children.internal.type'
  | 'childImageSharp.internal.content'
  | 'childImageSharp.internal.contentDigest'
  | 'childImageSharp.internal.description'
  | 'childImageSharp.internal.fieldOwners'
  | 'childImageSharp.internal.ignoreType'
  | 'childImageSharp.internal.mediaType'
  | 'childImageSharp.internal.owner'
  | 'childImageSharp.internal.type'
  | 'childrenMdx'
  | 'childrenMdx.rawBody'
  | 'childrenMdx.fileAbsolutePath'
  | 'childrenMdx.frontmatter.title'
  | 'childrenMdx.frontmatter.date'
  | 'childrenMdx.frontmatter.description'
  | 'childrenMdx.frontmatter.cover.sourceInstanceName'
  | 'childrenMdx.frontmatter.cover.absolutePath'
  | 'childrenMdx.frontmatter.cover.relativePath'
  | 'childrenMdx.frontmatter.cover.extension'
  | 'childrenMdx.frontmatter.cover.size'
  | 'childrenMdx.frontmatter.cover.prettySize'
  | 'childrenMdx.frontmatter.cover.modifiedTime'
  | 'childrenMdx.frontmatter.cover.accessTime'
  | 'childrenMdx.frontmatter.cover.changeTime'
  | 'childrenMdx.frontmatter.cover.birthTime'
  | 'childrenMdx.frontmatter.cover.root'
  | 'childrenMdx.frontmatter.cover.dir'
  | 'childrenMdx.frontmatter.cover.base'
  | 'childrenMdx.frontmatter.cover.ext'
  | 'childrenMdx.frontmatter.cover.name'
  | 'childrenMdx.frontmatter.cover.relativeDirectory'
  | 'childrenMdx.frontmatter.cover.dev'
  | 'childrenMdx.frontmatter.cover.mode'
  | 'childrenMdx.frontmatter.cover.nlink'
  | 'childrenMdx.frontmatter.cover.uid'
  | 'childrenMdx.frontmatter.cover.gid'
  | 'childrenMdx.frontmatter.cover.rdev'
  | 'childrenMdx.frontmatter.cover.ino'
  | 'childrenMdx.frontmatter.cover.atimeMs'
  | 'childrenMdx.frontmatter.cover.mtimeMs'
  | 'childrenMdx.frontmatter.cover.ctimeMs'
  | 'childrenMdx.frontmatter.cover.atime'
  | 'childrenMdx.frontmatter.cover.mtime'
  | 'childrenMdx.frontmatter.cover.ctime'
  | 'childrenMdx.frontmatter.cover.birthtime'
  | 'childrenMdx.frontmatter.cover.birthtimeMs'
  | 'childrenMdx.frontmatter.cover.blksize'
  | 'childrenMdx.frontmatter.cover.blocks'
  | 'childrenMdx.frontmatter.cover.url'
  | 'childrenMdx.frontmatter.cover.publicURL'
  | 'childrenMdx.frontmatter.cover.childrenImageSharp'
  | 'childrenMdx.frontmatter.cover.childrenMdx'
  | 'childrenMdx.frontmatter.cover.id'
  | 'childrenMdx.frontmatter.cover.children'
  | 'childrenMdx.frontmatter.tags'
  | 'childrenMdx.frontmatter.slug'
  | 'childrenMdx.frontmatter.location'
  | 'childrenMdx.frontmatter.draft'
  | 'childrenMdx.slug'
  | 'childrenMdx.body'
  | 'childrenMdx.excerpt'
  | 'childrenMdx.headings'
  | 'childrenMdx.headings.value'
  | 'childrenMdx.headings.depth'
  | 'childrenMdx.html'
  | 'childrenMdx.mdxAST'
  | 'childrenMdx.tableOfContents'
  | 'childrenMdx.timeToRead'
  | 'childrenMdx.wordCount.paragraphs'
  | 'childrenMdx.wordCount.sentences'
  | 'childrenMdx.wordCount.words'
  | 'childrenMdx.collection'
  | 'childrenMdx.fields.date'
  | 'childrenMdx.fields.slug'
  | 'childrenMdx.fields.latestCommit.date'
  | 'childrenMdx.fields.latestCommit.message'
  | 'childrenMdx.fields.latestCommit.hash'
  | 'childrenMdx.id'
  | 'childrenMdx.parent.id'
  | 'childrenMdx.parent.parent.id'
  | 'childrenMdx.parent.parent.children'
  | 'childrenMdx.parent.children'
  | 'childrenMdx.parent.children.id'
  | 'childrenMdx.parent.children.children'
  | 'childrenMdx.parent.internal.content'
  | 'childrenMdx.parent.internal.contentDigest'
  | 'childrenMdx.parent.internal.description'
  | 'childrenMdx.parent.internal.fieldOwners'
  | 'childrenMdx.parent.internal.ignoreType'
  | 'childrenMdx.parent.internal.mediaType'
  | 'childrenMdx.parent.internal.owner'
  | 'childrenMdx.parent.internal.type'
  | 'childrenMdx.children'
  | 'childrenMdx.children.id'
  | 'childrenMdx.children.parent.id'
  | 'childrenMdx.children.parent.children'
  | 'childrenMdx.children.children'
  | 'childrenMdx.children.children.id'
  | 'childrenMdx.children.children.children'
  | 'childrenMdx.children.internal.content'
  | 'childrenMdx.children.internal.contentDigest'
  | 'childrenMdx.children.internal.description'
  | 'childrenMdx.children.internal.fieldOwners'
  | 'childrenMdx.children.internal.ignoreType'
  | 'childrenMdx.children.internal.mediaType'
  | 'childrenMdx.children.internal.owner'
  | 'childrenMdx.children.internal.type'
  | 'childrenMdx.internal.content'
  | 'childrenMdx.internal.contentDigest'
  | 'childrenMdx.internal.description'
  | 'childrenMdx.internal.fieldOwners'
  | 'childrenMdx.internal.ignoreType'
  | 'childrenMdx.internal.mediaType'
  | 'childrenMdx.internal.owner'
  | 'childrenMdx.internal.type'
  | 'childMdx.rawBody'
  | 'childMdx.fileAbsolutePath'
  | 'childMdx.frontmatter.title'
  | 'childMdx.frontmatter.date'
  | 'childMdx.frontmatter.description'
  | 'childMdx.frontmatter.cover.sourceInstanceName'
  | 'childMdx.frontmatter.cover.absolutePath'
  | 'childMdx.frontmatter.cover.relativePath'
  | 'childMdx.frontmatter.cover.extension'
  | 'childMdx.frontmatter.cover.size'
  | 'childMdx.frontmatter.cover.prettySize'
  | 'childMdx.frontmatter.cover.modifiedTime'
  | 'childMdx.frontmatter.cover.accessTime'
  | 'childMdx.frontmatter.cover.changeTime'
  | 'childMdx.frontmatter.cover.birthTime'
  | 'childMdx.frontmatter.cover.root'
  | 'childMdx.frontmatter.cover.dir'
  | 'childMdx.frontmatter.cover.base'
  | 'childMdx.frontmatter.cover.ext'
  | 'childMdx.frontmatter.cover.name'
  | 'childMdx.frontmatter.cover.relativeDirectory'
  | 'childMdx.frontmatter.cover.dev'
  | 'childMdx.frontmatter.cover.mode'
  | 'childMdx.frontmatter.cover.nlink'
  | 'childMdx.frontmatter.cover.uid'
  | 'childMdx.frontmatter.cover.gid'
  | 'childMdx.frontmatter.cover.rdev'
  | 'childMdx.frontmatter.cover.ino'
  | 'childMdx.frontmatter.cover.atimeMs'
  | 'childMdx.frontmatter.cover.mtimeMs'
  | 'childMdx.frontmatter.cover.ctimeMs'
  | 'childMdx.frontmatter.cover.atime'
  | 'childMdx.frontmatter.cover.mtime'
  | 'childMdx.frontmatter.cover.ctime'
  | 'childMdx.frontmatter.cover.birthtime'
  | 'childMdx.frontmatter.cover.birthtimeMs'
  | 'childMdx.frontmatter.cover.blksize'
  | 'childMdx.frontmatter.cover.blocks'
  | 'childMdx.frontmatter.cover.url'
  | 'childMdx.frontmatter.cover.publicURL'
  | 'childMdx.frontmatter.cover.childrenImageSharp'
  | 'childMdx.frontmatter.cover.childrenMdx'
  | 'childMdx.frontmatter.cover.id'
  | 'childMdx.frontmatter.cover.children'
  | 'childMdx.frontmatter.tags'
  | 'childMdx.frontmatter.slug'
  | 'childMdx.frontmatter.location'
  | 'childMdx.frontmatter.draft'
  | 'childMdx.slug'
  | 'childMdx.body'
  | 'childMdx.excerpt'
  | 'childMdx.headings'
  | 'childMdx.headings.value'
  | 'childMdx.headings.depth'
  | 'childMdx.html'
  | 'childMdx.mdxAST'
  | 'childMdx.tableOfContents'
  | 'childMdx.timeToRead'
  | 'childMdx.wordCount.paragraphs'
  | 'childMdx.wordCount.sentences'
  | 'childMdx.wordCount.words'
  | 'childMdx.collection'
  | 'childMdx.fields.date'
  | 'childMdx.fields.slug'
  | 'childMdx.fields.latestCommit.date'
  | 'childMdx.fields.latestCommit.message'
  | 'childMdx.fields.latestCommit.hash'
  | 'childMdx.id'
  | 'childMdx.parent.id'
  | 'childMdx.parent.parent.id'
  | 'childMdx.parent.parent.children'
  | 'childMdx.parent.children'
  | 'childMdx.parent.children.id'
  | 'childMdx.parent.children.children'
  | 'childMdx.parent.internal.content'
  | 'childMdx.parent.internal.contentDigest'
  | 'childMdx.parent.internal.description'
  | 'childMdx.parent.internal.fieldOwners'
  | 'childMdx.parent.internal.ignoreType'
  | 'childMdx.parent.internal.mediaType'
  | 'childMdx.parent.internal.owner'
  | 'childMdx.parent.internal.type'
  | 'childMdx.children'
  | 'childMdx.children.id'
  | 'childMdx.children.parent.id'
  | 'childMdx.children.parent.children'
  | 'childMdx.children.children'
  | 'childMdx.children.children.id'
  | 'childMdx.children.children.children'
  | 'childMdx.children.internal.content'
  | 'childMdx.children.internal.contentDigest'
  | 'childMdx.children.internal.description'
  | 'childMdx.children.internal.fieldOwners'
  | 'childMdx.children.internal.ignoreType'
  | 'childMdx.children.internal.mediaType'
  | 'childMdx.children.internal.owner'
  | 'childMdx.children.internal.type'
  | 'childMdx.internal.content'
  | 'childMdx.internal.contentDigest'
  | 'childMdx.internal.description'
  | 'childMdx.internal.fieldOwners'
  | 'childMdx.internal.ignoreType'
  | 'childMdx.internal.mediaType'
  | 'childMdx.internal.owner'
  | 'childMdx.internal.type'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type FileGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<FileEdge>;
  readonly nodes: ReadonlyArray<File>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<FileGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type FileGroupConnection_distinctArgs = {
  field: FileFieldsEnum;
};


type FileGroupConnection_maxArgs = {
  field: FileFieldsEnum;
};


type FileGroupConnection_minArgs = {
  field: FileFieldsEnum;
};


type FileGroupConnection_sumArgs = {
  field: FileFieldsEnum;
};


type FileGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: FileFieldsEnum;
};

type FileSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<FileFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type SortOrderEnum =
  | 'ASC'
  | 'DESC';

type DirectoryConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<DirectoryEdge>;
  readonly nodes: ReadonlyArray<Directory>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<DirectoryGroupConnection>;
};


type DirectoryConnection_distinctArgs = {
  field: DirectoryFieldsEnum;
};


type DirectoryConnection_maxArgs = {
  field: DirectoryFieldsEnum;
};


type DirectoryConnection_minArgs = {
  field: DirectoryFieldsEnum;
};


type DirectoryConnection_sumArgs = {
  field: DirectoryFieldsEnum;
};


type DirectoryConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: DirectoryFieldsEnum;
};

type DirectoryEdge = {
  readonly next: Maybe<Directory>;
  readonly node: Directory;
  readonly previous: Maybe<Directory>;
};

type DirectoryFieldsEnum =
  | 'sourceInstanceName'
  | 'absolutePath'
  | 'relativePath'
  | 'extension'
  | 'size'
  | 'prettySize'
  | 'modifiedTime'
  | 'accessTime'
  | 'changeTime'
  | 'birthTime'
  | 'root'
  | 'dir'
  | 'base'
  | 'ext'
  | 'name'
  | 'relativeDirectory'
  | 'dev'
  | 'mode'
  | 'nlink'
  | 'uid'
  | 'gid'
  | 'rdev'
  | 'ino'
  | 'atimeMs'
  | 'mtimeMs'
  | 'ctimeMs'
  | 'atime'
  | 'mtime'
  | 'ctime'
  | 'birthtime'
  | 'birthtimeMs'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type DirectoryGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<DirectoryEdge>;
  readonly nodes: ReadonlyArray<Directory>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<DirectoryGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type DirectoryGroupConnection_distinctArgs = {
  field: DirectoryFieldsEnum;
};


type DirectoryGroupConnection_maxArgs = {
  field: DirectoryFieldsEnum;
};


type DirectoryGroupConnection_minArgs = {
  field: DirectoryFieldsEnum;
};


type DirectoryGroupConnection_sumArgs = {
  field: DirectoryFieldsEnum;
};


type DirectoryGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: DirectoryFieldsEnum;
};

type DirectoryFilterInput = {
  readonly sourceInstanceName: Maybe<StringQueryOperatorInput>;
  readonly absolutePath: Maybe<StringQueryOperatorInput>;
  readonly relativePath: Maybe<StringQueryOperatorInput>;
  readonly extension: Maybe<StringQueryOperatorInput>;
  readonly size: Maybe<IntQueryOperatorInput>;
  readonly prettySize: Maybe<StringQueryOperatorInput>;
  readonly modifiedTime: Maybe<DateQueryOperatorInput>;
  readonly accessTime: Maybe<DateQueryOperatorInput>;
  readonly changeTime: Maybe<DateQueryOperatorInput>;
  readonly birthTime: Maybe<DateQueryOperatorInput>;
  readonly root: Maybe<StringQueryOperatorInput>;
  readonly dir: Maybe<StringQueryOperatorInput>;
  readonly base: Maybe<StringQueryOperatorInput>;
  readonly ext: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly relativeDirectory: Maybe<StringQueryOperatorInput>;
  readonly dev: Maybe<IntQueryOperatorInput>;
  readonly mode: Maybe<IntQueryOperatorInput>;
  readonly nlink: Maybe<IntQueryOperatorInput>;
  readonly uid: Maybe<IntQueryOperatorInput>;
  readonly gid: Maybe<IntQueryOperatorInput>;
  readonly rdev: Maybe<IntQueryOperatorInput>;
  readonly ino: Maybe<FloatQueryOperatorInput>;
  readonly atimeMs: Maybe<FloatQueryOperatorInput>;
  readonly mtimeMs: Maybe<FloatQueryOperatorInput>;
  readonly ctimeMs: Maybe<FloatQueryOperatorInput>;
  readonly atime: Maybe<DateQueryOperatorInput>;
  readonly mtime: Maybe<DateQueryOperatorInput>;
  readonly ctime: Maybe<DateQueryOperatorInput>;
  readonly birthtime: Maybe<DateQueryOperatorInput>;
  readonly birthtimeMs: Maybe<FloatQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type DirectorySortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<DirectoryFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type SiteSiteMetadataFilterInput = {
  readonly title: Maybe<StringQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly siteUrl: Maybe<StringQueryOperatorInput>;
  readonly rssMetadata: Maybe<SiteSiteMetadataRssMetadataFilterInput>;
};

type SiteSiteMetadataRssMetadataFilterInput = {
  readonly site_url: Maybe<StringQueryOperatorInput>;
  readonly feed_url: Maybe<StringQueryOperatorInput>;
  readonly title: Maybe<StringQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly copyright: Maybe<StringQueryOperatorInput>;
};

type SiteConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SiteEdge>;
  readonly nodes: ReadonlyArray<Site>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<SiteGroupConnection>;
};


type SiteConnection_distinctArgs = {
  field: SiteFieldsEnum;
};


type SiteConnection_maxArgs = {
  field: SiteFieldsEnum;
};


type SiteConnection_minArgs = {
  field: SiteFieldsEnum;
};


type SiteConnection_sumArgs = {
  field: SiteFieldsEnum;
};


type SiteConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SiteFieldsEnum;
};

type SiteEdge = {
  readonly next: Maybe<Site>;
  readonly node: Site;
  readonly previous: Maybe<Site>;
};

type SiteFieldsEnum =
  | 'buildTime'
  | 'siteMetadata.title'
  | 'siteMetadata.description'
  | 'siteMetadata.siteUrl'
  | 'siteMetadata.rssMetadata.site_url'
  | 'siteMetadata.rssMetadata.feed_url'
  | 'siteMetadata.rssMetadata.title'
  | 'siteMetadata.rssMetadata.description'
  | 'siteMetadata.rssMetadata.copyright'
  | 'port'
  | 'host'
  | 'polyfill'
  | 'pathPrefix'
  | 'jsxRuntime'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type SiteGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SiteEdge>;
  readonly nodes: ReadonlyArray<Site>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<SiteGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type SiteGroupConnection_distinctArgs = {
  field: SiteFieldsEnum;
};


type SiteGroupConnection_maxArgs = {
  field: SiteFieldsEnum;
};


type SiteGroupConnection_minArgs = {
  field: SiteFieldsEnum;
};


type SiteGroupConnection_sumArgs = {
  field: SiteFieldsEnum;
};


type SiteGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SiteFieldsEnum;
};

type SiteFilterInput = {
  readonly buildTime: Maybe<DateQueryOperatorInput>;
  readonly siteMetadata: Maybe<SiteSiteMetadataFilterInput>;
  readonly port: Maybe<IntQueryOperatorInput>;
  readonly host: Maybe<StringQueryOperatorInput>;
  readonly polyfill: Maybe<BooleanQueryOperatorInput>;
  readonly pathPrefix: Maybe<StringQueryOperatorInput>;
  readonly jsxRuntime: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type SiteSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<SiteFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type SiteFunctionConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SiteFunctionEdge>;
  readonly nodes: ReadonlyArray<SiteFunction>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<SiteFunctionGroupConnection>;
};


type SiteFunctionConnection_distinctArgs = {
  field: SiteFunctionFieldsEnum;
};


type SiteFunctionConnection_maxArgs = {
  field: SiteFunctionFieldsEnum;
};


type SiteFunctionConnection_minArgs = {
  field: SiteFunctionFieldsEnum;
};


type SiteFunctionConnection_sumArgs = {
  field: SiteFunctionFieldsEnum;
};


type SiteFunctionConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SiteFunctionFieldsEnum;
};

type SiteFunctionEdge = {
  readonly next: Maybe<SiteFunction>;
  readonly node: SiteFunction;
  readonly previous: Maybe<SiteFunction>;
};

type SiteFunctionFieldsEnum =
  | 'functionRoute'
  | 'pluginName'
  | 'originalAbsoluteFilePath'
  | 'originalRelativeFilePath'
  | 'relativeCompiledFilePath'
  | 'absoluteCompiledFilePath'
  | 'matchPath'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type SiteFunctionGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SiteFunctionEdge>;
  readonly nodes: ReadonlyArray<SiteFunction>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<SiteFunctionGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type SiteFunctionGroupConnection_distinctArgs = {
  field: SiteFunctionFieldsEnum;
};


type SiteFunctionGroupConnection_maxArgs = {
  field: SiteFunctionFieldsEnum;
};


type SiteFunctionGroupConnection_minArgs = {
  field: SiteFunctionFieldsEnum;
};


type SiteFunctionGroupConnection_sumArgs = {
  field: SiteFunctionFieldsEnum;
};


type SiteFunctionGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SiteFunctionFieldsEnum;
};

type SiteFunctionFilterInput = {
  readonly functionRoute: Maybe<StringQueryOperatorInput>;
  readonly pluginName: Maybe<StringQueryOperatorInput>;
  readonly originalAbsoluteFilePath: Maybe<StringQueryOperatorInput>;
  readonly originalRelativeFilePath: Maybe<StringQueryOperatorInput>;
  readonly relativeCompiledFilePath: Maybe<StringQueryOperatorInput>;
  readonly absoluteCompiledFilePath: Maybe<StringQueryOperatorInput>;
  readonly matchPath: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type SiteFunctionSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<SiteFunctionFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type SitePluginFilterInput = {
  readonly resolve: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly version: Maybe<StringQueryOperatorInput>;
  readonly nodeAPIs: Maybe<StringQueryOperatorInput>;
  readonly browserAPIs: Maybe<StringQueryOperatorInput>;
  readonly ssrAPIs: Maybe<StringQueryOperatorInput>;
  readonly pluginFilepath: Maybe<StringQueryOperatorInput>;
  readonly pluginOptions: Maybe<JSONQueryOperatorInput>;
  readonly packageJson: Maybe<JSONQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type SitePageFieldsFilterInput = {
  readonly latestCommit: Maybe<GitCommitFilterInput>;
};

type GitCommitFilterInput = {
  readonly date: Maybe<DateQueryOperatorInput>;
  readonly message: Maybe<StringQueryOperatorInput>;
  readonly hash: Maybe<StringQueryOperatorInput>;
};

type SitePageConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SitePageEdge>;
  readonly nodes: ReadonlyArray<SitePage>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<SitePageGroupConnection>;
};


type SitePageConnection_distinctArgs = {
  field: SitePageFieldsEnum;
};


type SitePageConnection_maxArgs = {
  field: SitePageFieldsEnum;
};


type SitePageConnection_minArgs = {
  field: SitePageFieldsEnum;
};


type SitePageConnection_sumArgs = {
  field: SitePageFieldsEnum;
};


type SitePageConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SitePageFieldsEnum;
};

type SitePageEdge = {
  readonly next: Maybe<SitePage>;
  readonly node: SitePage;
  readonly previous: Maybe<SitePage>;
};

type SitePageFieldsEnum =
  | 'path'
  | 'component'
  | 'internalComponentName'
  | 'componentChunkName'
  | 'matchPath'
  | 'pageContext'
  | 'pluginCreator.resolve'
  | 'pluginCreator.name'
  | 'pluginCreator.version'
  | 'pluginCreator.nodeAPIs'
  | 'pluginCreator.browserAPIs'
  | 'pluginCreator.ssrAPIs'
  | 'pluginCreator.pluginFilepath'
  | 'pluginCreator.pluginOptions'
  | 'pluginCreator.packageJson'
  | 'pluginCreator.id'
  | 'pluginCreator.parent.id'
  | 'pluginCreator.parent.parent.id'
  | 'pluginCreator.parent.parent.children'
  | 'pluginCreator.parent.children'
  | 'pluginCreator.parent.children.id'
  | 'pluginCreator.parent.children.children'
  | 'pluginCreator.parent.internal.content'
  | 'pluginCreator.parent.internal.contentDigest'
  | 'pluginCreator.parent.internal.description'
  | 'pluginCreator.parent.internal.fieldOwners'
  | 'pluginCreator.parent.internal.ignoreType'
  | 'pluginCreator.parent.internal.mediaType'
  | 'pluginCreator.parent.internal.owner'
  | 'pluginCreator.parent.internal.type'
  | 'pluginCreator.children'
  | 'pluginCreator.children.id'
  | 'pluginCreator.children.parent.id'
  | 'pluginCreator.children.parent.children'
  | 'pluginCreator.children.children'
  | 'pluginCreator.children.children.id'
  | 'pluginCreator.children.children.children'
  | 'pluginCreator.children.internal.content'
  | 'pluginCreator.children.internal.contentDigest'
  | 'pluginCreator.children.internal.description'
  | 'pluginCreator.children.internal.fieldOwners'
  | 'pluginCreator.children.internal.ignoreType'
  | 'pluginCreator.children.internal.mediaType'
  | 'pluginCreator.children.internal.owner'
  | 'pluginCreator.children.internal.type'
  | 'pluginCreator.internal.content'
  | 'pluginCreator.internal.contentDigest'
  | 'pluginCreator.internal.description'
  | 'pluginCreator.internal.fieldOwners'
  | 'pluginCreator.internal.ignoreType'
  | 'pluginCreator.internal.mediaType'
  | 'pluginCreator.internal.owner'
  | 'pluginCreator.internal.type'
  | 'fields.latestCommit.date'
  | 'fields.latestCommit.message'
  | 'fields.latestCommit.hash'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type SitePageGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SitePageEdge>;
  readonly nodes: ReadonlyArray<SitePage>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<SitePageGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type SitePageGroupConnection_distinctArgs = {
  field: SitePageFieldsEnum;
};


type SitePageGroupConnection_maxArgs = {
  field: SitePageFieldsEnum;
};


type SitePageGroupConnection_minArgs = {
  field: SitePageFieldsEnum;
};


type SitePageGroupConnection_sumArgs = {
  field: SitePageFieldsEnum;
};


type SitePageGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SitePageFieldsEnum;
};

type SitePageFilterInput = {
  readonly path: Maybe<StringQueryOperatorInput>;
  readonly component: Maybe<StringQueryOperatorInput>;
  readonly internalComponentName: Maybe<StringQueryOperatorInput>;
  readonly componentChunkName: Maybe<StringQueryOperatorInput>;
  readonly matchPath: Maybe<StringQueryOperatorInput>;
  readonly pageContext: Maybe<JSONQueryOperatorInput>;
  readonly pluginCreator: Maybe<SitePluginFilterInput>;
  readonly fields: Maybe<SitePageFieldsFilterInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type SitePageSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<SitePageFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type SitePluginConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SitePluginEdge>;
  readonly nodes: ReadonlyArray<SitePlugin>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<SitePluginGroupConnection>;
};


type SitePluginConnection_distinctArgs = {
  field: SitePluginFieldsEnum;
};


type SitePluginConnection_maxArgs = {
  field: SitePluginFieldsEnum;
};


type SitePluginConnection_minArgs = {
  field: SitePluginFieldsEnum;
};


type SitePluginConnection_sumArgs = {
  field: SitePluginFieldsEnum;
};


type SitePluginConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SitePluginFieldsEnum;
};

type SitePluginEdge = {
  readonly next: Maybe<SitePlugin>;
  readonly node: SitePlugin;
  readonly previous: Maybe<SitePlugin>;
};

type SitePluginFieldsEnum =
  | 'resolve'
  | 'name'
  | 'version'
  | 'nodeAPIs'
  | 'browserAPIs'
  | 'ssrAPIs'
  | 'pluginFilepath'
  | 'pluginOptions'
  | 'packageJson'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type SitePluginGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SitePluginEdge>;
  readonly nodes: ReadonlyArray<SitePlugin>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<SitePluginGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type SitePluginGroupConnection_distinctArgs = {
  field: SitePluginFieldsEnum;
};


type SitePluginGroupConnection_maxArgs = {
  field: SitePluginFieldsEnum;
};


type SitePluginGroupConnection_minArgs = {
  field: SitePluginFieldsEnum;
};


type SitePluginGroupConnection_sumArgs = {
  field: SitePluginFieldsEnum;
};


type SitePluginGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SitePluginFieldsEnum;
};

type SitePluginSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<SitePluginFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type SiteBuildMetadataConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SiteBuildMetadataEdge>;
  readonly nodes: ReadonlyArray<SiteBuildMetadata>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<SiteBuildMetadataGroupConnection>;
};


type SiteBuildMetadataConnection_distinctArgs = {
  field: SiteBuildMetadataFieldsEnum;
};


type SiteBuildMetadataConnection_maxArgs = {
  field: SiteBuildMetadataFieldsEnum;
};


type SiteBuildMetadataConnection_minArgs = {
  field: SiteBuildMetadataFieldsEnum;
};


type SiteBuildMetadataConnection_sumArgs = {
  field: SiteBuildMetadataFieldsEnum;
};


type SiteBuildMetadataConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SiteBuildMetadataFieldsEnum;
};

type SiteBuildMetadataEdge = {
  readonly next: Maybe<SiteBuildMetadata>;
  readonly node: SiteBuildMetadata;
  readonly previous: Maybe<SiteBuildMetadata>;
};

type SiteBuildMetadataFieldsEnum =
  | 'buildTime'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type SiteBuildMetadataGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SiteBuildMetadataEdge>;
  readonly nodes: ReadonlyArray<SiteBuildMetadata>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<SiteBuildMetadataGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type SiteBuildMetadataGroupConnection_distinctArgs = {
  field: SiteBuildMetadataFieldsEnum;
};


type SiteBuildMetadataGroupConnection_maxArgs = {
  field: SiteBuildMetadataFieldsEnum;
};


type SiteBuildMetadataGroupConnection_minArgs = {
  field: SiteBuildMetadataFieldsEnum;
};


type SiteBuildMetadataGroupConnection_sumArgs = {
  field: SiteBuildMetadataFieldsEnum;
};


type SiteBuildMetadataGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SiteBuildMetadataFieldsEnum;
};

type SiteBuildMetadataFilterInput = {
  readonly buildTime: Maybe<DateQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type SiteBuildMetadataSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<SiteBuildMetadataFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type ImageSharpConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<ImageSharpEdge>;
  readonly nodes: ReadonlyArray<ImageSharp>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<ImageSharpGroupConnection>;
};


type ImageSharpConnection_distinctArgs = {
  field: ImageSharpFieldsEnum;
};


type ImageSharpConnection_maxArgs = {
  field: ImageSharpFieldsEnum;
};


type ImageSharpConnection_minArgs = {
  field: ImageSharpFieldsEnum;
};


type ImageSharpConnection_sumArgs = {
  field: ImageSharpFieldsEnum;
};


type ImageSharpConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: ImageSharpFieldsEnum;
};

type ImageSharpEdge = {
  readonly next: Maybe<ImageSharp>;
  readonly node: ImageSharp;
  readonly previous: Maybe<ImageSharp>;
};

type ImageSharpFieldsEnum =
  | 'fixed.base64'
  | 'fixed.tracedSVG'
  | 'fixed.aspectRatio'
  | 'fixed.width'
  | 'fixed.height'
  | 'fixed.src'
  | 'fixed.srcSet'
  | 'fixed.srcWebp'
  | 'fixed.srcSetWebp'
  | 'fixed.originalName'
  | 'fluid.base64'
  | 'fluid.tracedSVG'
  | 'fluid.aspectRatio'
  | 'fluid.src'
  | 'fluid.srcSet'
  | 'fluid.srcWebp'
  | 'fluid.srcSetWebp'
  | 'fluid.sizes'
  | 'fluid.originalImg'
  | 'fluid.originalName'
  | 'fluid.presentationWidth'
  | 'fluid.presentationHeight'
  | 'gatsbyImageData'
  | 'original.width'
  | 'original.height'
  | 'original.src'
  | 'resize.src'
  | 'resize.tracedSVG'
  | 'resize.width'
  | 'resize.height'
  | 'resize.aspectRatio'
  | 'resize.originalName'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type ImageSharpGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<ImageSharpEdge>;
  readonly nodes: ReadonlyArray<ImageSharp>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<ImageSharpGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type ImageSharpGroupConnection_distinctArgs = {
  field: ImageSharpFieldsEnum;
};


type ImageSharpGroupConnection_maxArgs = {
  field: ImageSharpFieldsEnum;
};


type ImageSharpGroupConnection_minArgs = {
  field: ImageSharpFieldsEnum;
};


type ImageSharpGroupConnection_sumArgs = {
  field: ImageSharpFieldsEnum;
};


type ImageSharpGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: ImageSharpFieldsEnum;
};

type ImageSharpSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<ImageSharpFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type GoodreadsBookConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<GoodreadsBookEdge>;
  readonly nodes: ReadonlyArray<GoodreadsBook>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<GoodreadsBookGroupConnection>;
};


type GoodreadsBookConnection_distinctArgs = {
  field: GoodreadsBookFieldsEnum;
};


type GoodreadsBookConnection_maxArgs = {
  field: GoodreadsBookFieldsEnum;
};


type GoodreadsBookConnection_minArgs = {
  field: GoodreadsBookFieldsEnum;
};


type GoodreadsBookConnection_sumArgs = {
  field: GoodreadsBookFieldsEnum;
};


type GoodreadsBookConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: GoodreadsBookFieldsEnum;
};

type GoodreadsBookEdge = {
  readonly next: Maybe<GoodreadsBook>;
  readonly node: GoodreadsBook;
  readonly previous: Maybe<GoodreadsBook>;
};

type GoodreadsBookFieldsEnum =
  | 'title'
  | 'author'
  | 'isbn'
  | 'isbn13'
  | 'asin'
  | 'pages'
  | 'published'
  | 'started'
  | 'finished'
  | 'cover'
  | 'coverImage.sourceInstanceName'
  | 'coverImage.absolutePath'
  | 'coverImage.relativePath'
  | 'coverImage.extension'
  | 'coverImage.size'
  | 'coverImage.prettySize'
  | 'coverImage.modifiedTime'
  | 'coverImage.accessTime'
  | 'coverImage.changeTime'
  | 'coverImage.birthTime'
  | 'coverImage.root'
  | 'coverImage.dir'
  | 'coverImage.base'
  | 'coverImage.ext'
  | 'coverImage.name'
  | 'coverImage.relativeDirectory'
  | 'coverImage.dev'
  | 'coverImage.mode'
  | 'coverImage.nlink'
  | 'coverImage.uid'
  | 'coverImage.gid'
  | 'coverImage.rdev'
  | 'coverImage.ino'
  | 'coverImage.atimeMs'
  | 'coverImage.mtimeMs'
  | 'coverImage.ctimeMs'
  | 'coverImage.atime'
  | 'coverImage.mtime'
  | 'coverImage.ctime'
  | 'coverImage.birthtime'
  | 'coverImage.birthtimeMs'
  | 'coverImage.blksize'
  | 'coverImage.blocks'
  | 'coverImage.url'
  | 'coverImage.publicURL'
  | 'coverImage.childrenImageSharp'
  | 'coverImage.childrenImageSharp.fixed.base64'
  | 'coverImage.childrenImageSharp.fixed.tracedSVG'
  | 'coverImage.childrenImageSharp.fixed.aspectRatio'
  | 'coverImage.childrenImageSharp.fixed.width'
  | 'coverImage.childrenImageSharp.fixed.height'
  | 'coverImage.childrenImageSharp.fixed.src'
  | 'coverImage.childrenImageSharp.fixed.srcSet'
  | 'coverImage.childrenImageSharp.fixed.srcWebp'
  | 'coverImage.childrenImageSharp.fixed.srcSetWebp'
  | 'coverImage.childrenImageSharp.fixed.originalName'
  | 'coverImage.childrenImageSharp.fluid.base64'
  | 'coverImage.childrenImageSharp.fluid.tracedSVG'
  | 'coverImage.childrenImageSharp.fluid.aspectRatio'
  | 'coverImage.childrenImageSharp.fluid.src'
  | 'coverImage.childrenImageSharp.fluid.srcSet'
  | 'coverImage.childrenImageSharp.fluid.srcWebp'
  | 'coverImage.childrenImageSharp.fluid.srcSetWebp'
  | 'coverImage.childrenImageSharp.fluid.sizes'
  | 'coverImage.childrenImageSharp.fluid.originalImg'
  | 'coverImage.childrenImageSharp.fluid.originalName'
  | 'coverImage.childrenImageSharp.fluid.presentationWidth'
  | 'coverImage.childrenImageSharp.fluid.presentationHeight'
  | 'coverImage.childrenImageSharp.gatsbyImageData'
  | 'coverImage.childrenImageSharp.original.width'
  | 'coverImage.childrenImageSharp.original.height'
  | 'coverImage.childrenImageSharp.original.src'
  | 'coverImage.childrenImageSharp.resize.src'
  | 'coverImage.childrenImageSharp.resize.tracedSVG'
  | 'coverImage.childrenImageSharp.resize.width'
  | 'coverImage.childrenImageSharp.resize.height'
  | 'coverImage.childrenImageSharp.resize.aspectRatio'
  | 'coverImage.childrenImageSharp.resize.originalName'
  | 'coverImage.childrenImageSharp.id'
  | 'coverImage.childrenImageSharp.parent.id'
  | 'coverImage.childrenImageSharp.parent.children'
  | 'coverImage.childrenImageSharp.children'
  | 'coverImage.childrenImageSharp.children.id'
  | 'coverImage.childrenImageSharp.children.children'
  | 'coverImage.childrenImageSharp.internal.content'
  | 'coverImage.childrenImageSharp.internal.contentDigest'
  | 'coverImage.childrenImageSharp.internal.description'
  | 'coverImage.childrenImageSharp.internal.fieldOwners'
  | 'coverImage.childrenImageSharp.internal.ignoreType'
  | 'coverImage.childrenImageSharp.internal.mediaType'
  | 'coverImage.childrenImageSharp.internal.owner'
  | 'coverImage.childrenImageSharp.internal.type'
  | 'coverImage.childImageSharp.fixed.base64'
  | 'coverImage.childImageSharp.fixed.tracedSVG'
  | 'coverImage.childImageSharp.fixed.aspectRatio'
  | 'coverImage.childImageSharp.fixed.width'
  | 'coverImage.childImageSharp.fixed.height'
  | 'coverImage.childImageSharp.fixed.src'
  | 'coverImage.childImageSharp.fixed.srcSet'
  | 'coverImage.childImageSharp.fixed.srcWebp'
  | 'coverImage.childImageSharp.fixed.srcSetWebp'
  | 'coverImage.childImageSharp.fixed.originalName'
  | 'coverImage.childImageSharp.fluid.base64'
  | 'coverImage.childImageSharp.fluid.tracedSVG'
  | 'coverImage.childImageSharp.fluid.aspectRatio'
  | 'coverImage.childImageSharp.fluid.src'
  | 'coverImage.childImageSharp.fluid.srcSet'
  | 'coverImage.childImageSharp.fluid.srcWebp'
  | 'coverImage.childImageSharp.fluid.srcSetWebp'
  | 'coverImage.childImageSharp.fluid.sizes'
  | 'coverImage.childImageSharp.fluid.originalImg'
  | 'coverImage.childImageSharp.fluid.originalName'
  | 'coverImage.childImageSharp.fluid.presentationWidth'
  | 'coverImage.childImageSharp.fluid.presentationHeight'
  | 'coverImage.childImageSharp.gatsbyImageData'
  | 'coverImage.childImageSharp.original.width'
  | 'coverImage.childImageSharp.original.height'
  | 'coverImage.childImageSharp.original.src'
  | 'coverImage.childImageSharp.resize.src'
  | 'coverImage.childImageSharp.resize.tracedSVG'
  | 'coverImage.childImageSharp.resize.width'
  | 'coverImage.childImageSharp.resize.height'
  | 'coverImage.childImageSharp.resize.aspectRatio'
  | 'coverImage.childImageSharp.resize.originalName'
  | 'coverImage.childImageSharp.id'
  | 'coverImage.childImageSharp.parent.id'
  | 'coverImage.childImageSharp.parent.children'
  | 'coverImage.childImageSharp.children'
  | 'coverImage.childImageSharp.children.id'
  | 'coverImage.childImageSharp.children.children'
  | 'coverImage.childImageSharp.internal.content'
  | 'coverImage.childImageSharp.internal.contentDigest'
  | 'coverImage.childImageSharp.internal.description'
  | 'coverImage.childImageSharp.internal.fieldOwners'
  | 'coverImage.childImageSharp.internal.ignoreType'
  | 'coverImage.childImageSharp.internal.mediaType'
  | 'coverImage.childImageSharp.internal.owner'
  | 'coverImage.childImageSharp.internal.type'
  | 'coverImage.childrenMdx'
  | 'coverImage.childrenMdx.rawBody'
  | 'coverImage.childrenMdx.fileAbsolutePath'
  | 'coverImage.childrenMdx.frontmatter.title'
  | 'coverImage.childrenMdx.frontmatter.date'
  | 'coverImage.childrenMdx.frontmatter.description'
  | 'coverImage.childrenMdx.frontmatter.tags'
  | 'coverImage.childrenMdx.frontmatter.slug'
  | 'coverImage.childrenMdx.frontmatter.location'
  | 'coverImage.childrenMdx.frontmatter.draft'
  | 'coverImage.childrenMdx.slug'
  | 'coverImage.childrenMdx.body'
  | 'coverImage.childrenMdx.excerpt'
  | 'coverImage.childrenMdx.headings'
  | 'coverImage.childrenMdx.headings.value'
  | 'coverImage.childrenMdx.headings.depth'
  | 'coverImage.childrenMdx.html'
  | 'coverImage.childrenMdx.mdxAST'
  | 'coverImage.childrenMdx.tableOfContents'
  | 'coverImage.childrenMdx.timeToRead'
  | 'coverImage.childrenMdx.wordCount.paragraphs'
  | 'coverImage.childrenMdx.wordCount.sentences'
  | 'coverImage.childrenMdx.wordCount.words'
  | 'coverImage.childrenMdx.collection'
  | 'coverImage.childrenMdx.fields.date'
  | 'coverImage.childrenMdx.fields.slug'
  | 'coverImage.childrenMdx.id'
  | 'coverImage.childrenMdx.parent.id'
  | 'coverImage.childrenMdx.parent.children'
  | 'coverImage.childrenMdx.children'
  | 'coverImage.childrenMdx.children.id'
  | 'coverImage.childrenMdx.children.children'
  | 'coverImage.childrenMdx.internal.content'
  | 'coverImage.childrenMdx.internal.contentDigest'
  | 'coverImage.childrenMdx.internal.description'
  | 'coverImage.childrenMdx.internal.fieldOwners'
  | 'coverImage.childrenMdx.internal.ignoreType'
  | 'coverImage.childrenMdx.internal.mediaType'
  | 'coverImage.childrenMdx.internal.owner'
  | 'coverImage.childrenMdx.internal.type'
  | 'coverImage.childMdx.rawBody'
  | 'coverImage.childMdx.fileAbsolutePath'
  | 'coverImage.childMdx.frontmatter.title'
  | 'coverImage.childMdx.frontmatter.date'
  | 'coverImage.childMdx.frontmatter.description'
  | 'coverImage.childMdx.frontmatter.tags'
  | 'coverImage.childMdx.frontmatter.slug'
  | 'coverImage.childMdx.frontmatter.location'
  | 'coverImage.childMdx.frontmatter.draft'
  | 'coverImage.childMdx.slug'
  | 'coverImage.childMdx.body'
  | 'coverImage.childMdx.excerpt'
  | 'coverImage.childMdx.headings'
  | 'coverImage.childMdx.headings.value'
  | 'coverImage.childMdx.headings.depth'
  | 'coverImage.childMdx.html'
  | 'coverImage.childMdx.mdxAST'
  | 'coverImage.childMdx.tableOfContents'
  | 'coverImage.childMdx.timeToRead'
  | 'coverImage.childMdx.wordCount.paragraphs'
  | 'coverImage.childMdx.wordCount.sentences'
  | 'coverImage.childMdx.wordCount.words'
  | 'coverImage.childMdx.collection'
  | 'coverImage.childMdx.fields.date'
  | 'coverImage.childMdx.fields.slug'
  | 'coverImage.childMdx.id'
  | 'coverImage.childMdx.parent.id'
  | 'coverImage.childMdx.parent.children'
  | 'coverImage.childMdx.children'
  | 'coverImage.childMdx.children.id'
  | 'coverImage.childMdx.children.children'
  | 'coverImage.childMdx.internal.content'
  | 'coverImage.childMdx.internal.contentDigest'
  | 'coverImage.childMdx.internal.description'
  | 'coverImage.childMdx.internal.fieldOwners'
  | 'coverImage.childMdx.internal.ignoreType'
  | 'coverImage.childMdx.internal.mediaType'
  | 'coverImage.childMdx.internal.owner'
  | 'coverImage.childMdx.internal.type'
  | 'coverImage.id'
  | 'coverImage.parent.id'
  | 'coverImage.parent.parent.id'
  | 'coverImage.parent.parent.children'
  | 'coverImage.parent.children'
  | 'coverImage.parent.children.id'
  | 'coverImage.parent.children.children'
  | 'coverImage.parent.internal.content'
  | 'coverImage.parent.internal.contentDigest'
  | 'coverImage.parent.internal.description'
  | 'coverImage.parent.internal.fieldOwners'
  | 'coverImage.parent.internal.ignoreType'
  | 'coverImage.parent.internal.mediaType'
  | 'coverImage.parent.internal.owner'
  | 'coverImage.parent.internal.type'
  | 'coverImage.children'
  | 'coverImage.children.id'
  | 'coverImage.children.parent.id'
  | 'coverImage.children.parent.children'
  | 'coverImage.children.children'
  | 'coverImage.children.children.id'
  | 'coverImage.children.children.children'
  | 'coverImage.children.internal.content'
  | 'coverImage.children.internal.contentDigest'
  | 'coverImage.children.internal.description'
  | 'coverImage.children.internal.fieldOwners'
  | 'coverImage.children.internal.ignoreType'
  | 'coverImage.children.internal.mediaType'
  | 'coverImage.children.internal.owner'
  | 'coverImage.children.internal.type'
  | 'coverImage.internal.content'
  | 'coverImage.internal.contentDigest'
  | 'coverImage.internal.description'
  | 'coverImage.internal.fieldOwners'
  | 'coverImage.internal.ignoreType'
  | 'coverImage.internal.mediaType'
  | 'coverImage.internal.owner'
  | 'coverImage.internal.type'
  | 'url'
  | 'shelf'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type GoodreadsBookGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<GoodreadsBookEdge>;
  readonly nodes: ReadonlyArray<GoodreadsBook>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<GoodreadsBookGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type GoodreadsBookGroupConnection_distinctArgs = {
  field: GoodreadsBookFieldsEnum;
};


type GoodreadsBookGroupConnection_maxArgs = {
  field: GoodreadsBookFieldsEnum;
};


type GoodreadsBookGroupConnection_minArgs = {
  field: GoodreadsBookFieldsEnum;
};


type GoodreadsBookGroupConnection_sumArgs = {
  field: GoodreadsBookFieldsEnum;
};


type GoodreadsBookGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: GoodreadsBookFieldsEnum;
};

type GoodreadsBookFilterInput = {
  readonly title: Maybe<StringQueryOperatorInput>;
  readonly author: Maybe<StringQueryOperatorInput>;
  readonly isbn: Maybe<StringQueryOperatorInput>;
  readonly isbn13: Maybe<StringQueryOperatorInput>;
  readonly asin: Maybe<StringQueryOperatorInput>;
  readonly pages: Maybe<IntQueryOperatorInput>;
  readonly published: Maybe<DateQueryOperatorInput>;
  readonly started: Maybe<DateQueryOperatorInput>;
  readonly finished: Maybe<DateQueryOperatorInput>;
  readonly cover: Maybe<StringQueryOperatorInput>;
  readonly coverImage: Maybe<FileFilterInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
  readonly shelf: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type GoodreadsBookSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<GoodreadsBookFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type MdxConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<MdxEdge>;
  readonly nodes: ReadonlyArray<Mdx>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<MdxGroupConnection>;
};


type MdxConnection_distinctArgs = {
  field: MdxFieldsEnum;
};


type MdxConnection_maxArgs = {
  field: MdxFieldsEnum;
};


type MdxConnection_minArgs = {
  field: MdxFieldsEnum;
};


type MdxConnection_sumArgs = {
  field: MdxFieldsEnum;
};


type MdxConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: MdxFieldsEnum;
};

type MdxEdge = {
  readonly next: Maybe<Mdx>;
  readonly node: Mdx;
  readonly previous: Maybe<Mdx>;
};

type MdxFieldsEnum =
  | 'rawBody'
  | 'fileAbsolutePath'
  | 'frontmatter.title'
  | 'frontmatter.date'
  | 'frontmatter.description'
  | 'frontmatter.cover.sourceInstanceName'
  | 'frontmatter.cover.absolutePath'
  | 'frontmatter.cover.relativePath'
  | 'frontmatter.cover.extension'
  | 'frontmatter.cover.size'
  | 'frontmatter.cover.prettySize'
  | 'frontmatter.cover.modifiedTime'
  | 'frontmatter.cover.accessTime'
  | 'frontmatter.cover.changeTime'
  | 'frontmatter.cover.birthTime'
  | 'frontmatter.cover.root'
  | 'frontmatter.cover.dir'
  | 'frontmatter.cover.base'
  | 'frontmatter.cover.ext'
  | 'frontmatter.cover.name'
  | 'frontmatter.cover.relativeDirectory'
  | 'frontmatter.cover.dev'
  | 'frontmatter.cover.mode'
  | 'frontmatter.cover.nlink'
  | 'frontmatter.cover.uid'
  | 'frontmatter.cover.gid'
  | 'frontmatter.cover.rdev'
  | 'frontmatter.cover.ino'
  | 'frontmatter.cover.atimeMs'
  | 'frontmatter.cover.mtimeMs'
  | 'frontmatter.cover.ctimeMs'
  | 'frontmatter.cover.atime'
  | 'frontmatter.cover.mtime'
  | 'frontmatter.cover.ctime'
  | 'frontmatter.cover.birthtime'
  | 'frontmatter.cover.birthtimeMs'
  | 'frontmatter.cover.blksize'
  | 'frontmatter.cover.blocks'
  | 'frontmatter.cover.url'
  | 'frontmatter.cover.publicURL'
  | 'frontmatter.cover.childrenImageSharp'
  | 'frontmatter.cover.childrenImageSharp.gatsbyImageData'
  | 'frontmatter.cover.childrenImageSharp.id'
  | 'frontmatter.cover.childrenImageSharp.children'
  | 'frontmatter.cover.childImageSharp.gatsbyImageData'
  | 'frontmatter.cover.childImageSharp.id'
  | 'frontmatter.cover.childImageSharp.children'
  | 'frontmatter.cover.childrenMdx'
  | 'frontmatter.cover.childrenMdx.rawBody'
  | 'frontmatter.cover.childrenMdx.fileAbsolutePath'
  | 'frontmatter.cover.childrenMdx.slug'
  | 'frontmatter.cover.childrenMdx.body'
  | 'frontmatter.cover.childrenMdx.excerpt'
  | 'frontmatter.cover.childrenMdx.headings'
  | 'frontmatter.cover.childrenMdx.html'
  | 'frontmatter.cover.childrenMdx.mdxAST'
  | 'frontmatter.cover.childrenMdx.tableOfContents'
  | 'frontmatter.cover.childrenMdx.timeToRead'
  | 'frontmatter.cover.childrenMdx.collection'
  | 'frontmatter.cover.childrenMdx.id'
  | 'frontmatter.cover.childrenMdx.children'
  | 'frontmatter.cover.childMdx.rawBody'
  | 'frontmatter.cover.childMdx.fileAbsolutePath'
  | 'frontmatter.cover.childMdx.slug'
  | 'frontmatter.cover.childMdx.body'
  | 'frontmatter.cover.childMdx.excerpt'
  | 'frontmatter.cover.childMdx.headings'
  | 'frontmatter.cover.childMdx.html'
  | 'frontmatter.cover.childMdx.mdxAST'
  | 'frontmatter.cover.childMdx.tableOfContents'
  | 'frontmatter.cover.childMdx.timeToRead'
  | 'frontmatter.cover.childMdx.collection'
  | 'frontmatter.cover.childMdx.id'
  | 'frontmatter.cover.childMdx.children'
  | 'frontmatter.cover.id'
  | 'frontmatter.cover.parent.id'
  | 'frontmatter.cover.parent.children'
  | 'frontmatter.cover.children'
  | 'frontmatter.cover.children.id'
  | 'frontmatter.cover.children.children'
  | 'frontmatter.cover.internal.content'
  | 'frontmatter.cover.internal.contentDigest'
  | 'frontmatter.cover.internal.description'
  | 'frontmatter.cover.internal.fieldOwners'
  | 'frontmatter.cover.internal.ignoreType'
  | 'frontmatter.cover.internal.mediaType'
  | 'frontmatter.cover.internal.owner'
  | 'frontmatter.cover.internal.type'
  | 'frontmatter.tags'
  | 'frontmatter.slug'
  | 'frontmatter.location'
  | 'frontmatter.draft'
  | 'slug'
  | 'body'
  | 'excerpt'
  | 'headings'
  | 'headings.value'
  | 'headings.depth'
  | 'html'
  | 'mdxAST'
  | 'tableOfContents'
  | 'timeToRead'
  | 'wordCount.paragraphs'
  | 'wordCount.sentences'
  | 'wordCount.words'
  | 'collection'
  | 'fields.date'
  | 'fields.slug'
  | 'fields.latestCommit.date'
  | 'fields.latestCommit.message'
  | 'fields.latestCommit.hash'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type MdxGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<MdxEdge>;
  readonly nodes: ReadonlyArray<Mdx>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<MdxGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type MdxGroupConnection_distinctArgs = {
  field: MdxFieldsEnum;
};


type MdxGroupConnection_maxArgs = {
  field: MdxFieldsEnum;
};


type MdxGroupConnection_minArgs = {
  field: MdxFieldsEnum;
};


type MdxGroupConnection_sumArgs = {
  field: MdxFieldsEnum;
};


type MdxGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: MdxFieldsEnum;
};

type MdxSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<MdxFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type DownloadedImageConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<DownloadedImageEdge>;
  readonly nodes: ReadonlyArray<DownloadedImage>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<DownloadedImageGroupConnection>;
};


type DownloadedImageConnection_distinctArgs = {
  field: DownloadedImageFieldsEnum;
};


type DownloadedImageConnection_maxArgs = {
  field: DownloadedImageFieldsEnum;
};


type DownloadedImageConnection_minArgs = {
  field: DownloadedImageFieldsEnum;
};


type DownloadedImageConnection_sumArgs = {
  field: DownloadedImageFieldsEnum;
};


type DownloadedImageConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: DownloadedImageFieldsEnum;
};

type DownloadedImageEdge = {
  readonly next: Maybe<DownloadedImage>;
  readonly node: DownloadedImage;
  readonly previous: Maybe<DownloadedImage>;
};

type DownloadedImageFieldsEnum =
  | 'url'
  | 'name'
  | 'image.sourceInstanceName'
  | 'image.absolutePath'
  | 'image.relativePath'
  | 'image.extension'
  | 'image.size'
  | 'image.prettySize'
  | 'image.modifiedTime'
  | 'image.accessTime'
  | 'image.changeTime'
  | 'image.birthTime'
  | 'image.root'
  | 'image.dir'
  | 'image.base'
  | 'image.ext'
  | 'image.name'
  | 'image.relativeDirectory'
  | 'image.dev'
  | 'image.mode'
  | 'image.nlink'
  | 'image.uid'
  | 'image.gid'
  | 'image.rdev'
  | 'image.ino'
  | 'image.atimeMs'
  | 'image.mtimeMs'
  | 'image.ctimeMs'
  | 'image.atime'
  | 'image.mtime'
  | 'image.ctime'
  | 'image.birthtime'
  | 'image.birthtimeMs'
  | 'image.blksize'
  | 'image.blocks'
  | 'image.url'
  | 'image.publicURL'
  | 'image.childrenImageSharp'
  | 'image.childrenImageSharp.fixed.base64'
  | 'image.childrenImageSharp.fixed.tracedSVG'
  | 'image.childrenImageSharp.fixed.aspectRatio'
  | 'image.childrenImageSharp.fixed.width'
  | 'image.childrenImageSharp.fixed.height'
  | 'image.childrenImageSharp.fixed.src'
  | 'image.childrenImageSharp.fixed.srcSet'
  | 'image.childrenImageSharp.fixed.srcWebp'
  | 'image.childrenImageSharp.fixed.srcSetWebp'
  | 'image.childrenImageSharp.fixed.originalName'
  | 'image.childrenImageSharp.fluid.base64'
  | 'image.childrenImageSharp.fluid.tracedSVG'
  | 'image.childrenImageSharp.fluid.aspectRatio'
  | 'image.childrenImageSharp.fluid.src'
  | 'image.childrenImageSharp.fluid.srcSet'
  | 'image.childrenImageSharp.fluid.srcWebp'
  | 'image.childrenImageSharp.fluid.srcSetWebp'
  | 'image.childrenImageSharp.fluid.sizes'
  | 'image.childrenImageSharp.fluid.originalImg'
  | 'image.childrenImageSharp.fluid.originalName'
  | 'image.childrenImageSharp.fluid.presentationWidth'
  | 'image.childrenImageSharp.fluid.presentationHeight'
  | 'image.childrenImageSharp.gatsbyImageData'
  | 'image.childrenImageSharp.original.width'
  | 'image.childrenImageSharp.original.height'
  | 'image.childrenImageSharp.original.src'
  | 'image.childrenImageSharp.resize.src'
  | 'image.childrenImageSharp.resize.tracedSVG'
  | 'image.childrenImageSharp.resize.width'
  | 'image.childrenImageSharp.resize.height'
  | 'image.childrenImageSharp.resize.aspectRatio'
  | 'image.childrenImageSharp.resize.originalName'
  | 'image.childrenImageSharp.id'
  | 'image.childrenImageSharp.parent.id'
  | 'image.childrenImageSharp.parent.children'
  | 'image.childrenImageSharp.children'
  | 'image.childrenImageSharp.children.id'
  | 'image.childrenImageSharp.children.children'
  | 'image.childrenImageSharp.internal.content'
  | 'image.childrenImageSharp.internal.contentDigest'
  | 'image.childrenImageSharp.internal.description'
  | 'image.childrenImageSharp.internal.fieldOwners'
  | 'image.childrenImageSharp.internal.ignoreType'
  | 'image.childrenImageSharp.internal.mediaType'
  | 'image.childrenImageSharp.internal.owner'
  | 'image.childrenImageSharp.internal.type'
  | 'image.childImageSharp.fixed.base64'
  | 'image.childImageSharp.fixed.tracedSVG'
  | 'image.childImageSharp.fixed.aspectRatio'
  | 'image.childImageSharp.fixed.width'
  | 'image.childImageSharp.fixed.height'
  | 'image.childImageSharp.fixed.src'
  | 'image.childImageSharp.fixed.srcSet'
  | 'image.childImageSharp.fixed.srcWebp'
  | 'image.childImageSharp.fixed.srcSetWebp'
  | 'image.childImageSharp.fixed.originalName'
  | 'image.childImageSharp.fluid.base64'
  | 'image.childImageSharp.fluid.tracedSVG'
  | 'image.childImageSharp.fluid.aspectRatio'
  | 'image.childImageSharp.fluid.src'
  | 'image.childImageSharp.fluid.srcSet'
  | 'image.childImageSharp.fluid.srcWebp'
  | 'image.childImageSharp.fluid.srcSetWebp'
  | 'image.childImageSharp.fluid.sizes'
  | 'image.childImageSharp.fluid.originalImg'
  | 'image.childImageSharp.fluid.originalName'
  | 'image.childImageSharp.fluid.presentationWidth'
  | 'image.childImageSharp.fluid.presentationHeight'
  | 'image.childImageSharp.gatsbyImageData'
  | 'image.childImageSharp.original.width'
  | 'image.childImageSharp.original.height'
  | 'image.childImageSharp.original.src'
  | 'image.childImageSharp.resize.src'
  | 'image.childImageSharp.resize.tracedSVG'
  | 'image.childImageSharp.resize.width'
  | 'image.childImageSharp.resize.height'
  | 'image.childImageSharp.resize.aspectRatio'
  | 'image.childImageSharp.resize.originalName'
  | 'image.childImageSharp.id'
  | 'image.childImageSharp.parent.id'
  | 'image.childImageSharp.parent.children'
  | 'image.childImageSharp.children'
  | 'image.childImageSharp.children.id'
  | 'image.childImageSharp.children.children'
  | 'image.childImageSharp.internal.content'
  | 'image.childImageSharp.internal.contentDigest'
  | 'image.childImageSharp.internal.description'
  | 'image.childImageSharp.internal.fieldOwners'
  | 'image.childImageSharp.internal.ignoreType'
  | 'image.childImageSharp.internal.mediaType'
  | 'image.childImageSharp.internal.owner'
  | 'image.childImageSharp.internal.type'
  | 'image.childrenMdx'
  | 'image.childrenMdx.rawBody'
  | 'image.childrenMdx.fileAbsolutePath'
  | 'image.childrenMdx.frontmatter.title'
  | 'image.childrenMdx.frontmatter.date'
  | 'image.childrenMdx.frontmatter.description'
  | 'image.childrenMdx.frontmatter.tags'
  | 'image.childrenMdx.frontmatter.slug'
  | 'image.childrenMdx.frontmatter.location'
  | 'image.childrenMdx.frontmatter.draft'
  | 'image.childrenMdx.slug'
  | 'image.childrenMdx.body'
  | 'image.childrenMdx.excerpt'
  | 'image.childrenMdx.headings'
  | 'image.childrenMdx.headings.value'
  | 'image.childrenMdx.headings.depth'
  | 'image.childrenMdx.html'
  | 'image.childrenMdx.mdxAST'
  | 'image.childrenMdx.tableOfContents'
  | 'image.childrenMdx.timeToRead'
  | 'image.childrenMdx.wordCount.paragraphs'
  | 'image.childrenMdx.wordCount.sentences'
  | 'image.childrenMdx.wordCount.words'
  | 'image.childrenMdx.collection'
  | 'image.childrenMdx.fields.date'
  | 'image.childrenMdx.fields.slug'
  | 'image.childrenMdx.id'
  | 'image.childrenMdx.parent.id'
  | 'image.childrenMdx.parent.children'
  | 'image.childrenMdx.children'
  | 'image.childrenMdx.children.id'
  | 'image.childrenMdx.children.children'
  | 'image.childrenMdx.internal.content'
  | 'image.childrenMdx.internal.contentDigest'
  | 'image.childrenMdx.internal.description'
  | 'image.childrenMdx.internal.fieldOwners'
  | 'image.childrenMdx.internal.ignoreType'
  | 'image.childrenMdx.internal.mediaType'
  | 'image.childrenMdx.internal.owner'
  | 'image.childrenMdx.internal.type'
  | 'image.childMdx.rawBody'
  | 'image.childMdx.fileAbsolutePath'
  | 'image.childMdx.frontmatter.title'
  | 'image.childMdx.frontmatter.date'
  | 'image.childMdx.frontmatter.description'
  | 'image.childMdx.frontmatter.tags'
  | 'image.childMdx.frontmatter.slug'
  | 'image.childMdx.frontmatter.location'
  | 'image.childMdx.frontmatter.draft'
  | 'image.childMdx.slug'
  | 'image.childMdx.body'
  | 'image.childMdx.excerpt'
  | 'image.childMdx.headings'
  | 'image.childMdx.headings.value'
  | 'image.childMdx.headings.depth'
  | 'image.childMdx.html'
  | 'image.childMdx.mdxAST'
  | 'image.childMdx.tableOfContents'
  | 'image.childMdx.timeToRead'
  | 'image.childMdx.wordCount.paragraphs'
  | 'image.childMdx.wordCount.sentences'
  | 'image.childMdx.wordCount.words'
  | 'image.childMdx.collection'
  | 'image.childMdx.fields.date'
  | 'image.childMdx.fields.slug'
  | 'image.childMdx.id'
  | 'image.childMdx.parent.id'
  | 'image.childMdx.parent.children'
  | 'image.childMdx.children'
  | 'image.childMdx.children.id'
  | 'image.childMdx.children.children'
  | 'image.childMdx.internal.content'
  | 'image.childMdx.internal.contentDigest'
  | 'image.childMdx.internal.description'
  | 'image.childMdx.internal.fieldOwners'
  | 'image.childMdx.internal.ignoreType'
  | 'image.childMdx.internal.mediaType'
  | 'image.childMdx.internal.owner'
  | 'image.childMdx.internal.type'
  | 'image.id'
  | 'image.parent.id'
  | 'image.parent.parent.id'
  | 'image.parent.parent.children'
  | 'image.parent.children'
  | 'image.parent.children.id'
  | 'image.parent.children.children'
  | 'image.parent.internal.content'
  | 'image.parent.internal.contentDigest'
  | 'image.parent.internal.description'
  | 'image.parent.internal.fieldOwners'
  | 'image.parent.internal.ignoreType'
  | 'image.parent.internal.mediaType'
  | 'image.parent.internal.owner'
  | 'image.parent.internal.type'
  | 'image.children'
  | 'image.children.id'
  | 'image.children.parent.id'
  | 'image.children.parent.children'
  | 'image.children.children'
  | 'image.children.children.id'
  | 'image.children.children.children'
  | 'image.children.internal.content'
  | 'image.children.internal.contentDigest'
  | 'image.children.internal.description'
  | 'image.children.internal.fieldOwners'
  | 'image.children.internal.ignoreType'
  | 'image.children.internal.mediaType'
  | 'image.children.internal.owner'
  | 'image.children.internal.type'
  | 'image.internal.content'
  | 'image.internal.contentDigest'
  | 'image.internal.description'
  | 'image.internal.fieldOwners'
  | 'image.internal.ignoreType'
  | 'image.internal.mediaType'
  | 'image.internal.owner'
  | 'image.internal.type'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type DownloadedImageGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<DownloadedImageEdge>;
  readonly nodes: ReadonlyArray<DownloadedImage>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<DownloadedImageGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type DownloadedImageGroupConnection_distinctArgs = {
  field: DownloadedImageFieldsEnum;
};


type DownloadedImageGroupConnection_maxArgs = {
  field: DownloadedImageFieldsEnum;
};


type DownloadedImageGroupConnection_minArgs = {
  field: DownloadedImageFieldsEnum;
};


type DownloadedImageGroupConnection_sumArgs = {
  field: DownloadedImageFieldsEnum;
};


type DownloadedImageGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: DownloadedImageFieldsEnum;
};

type DownloadedImageFilterInput = {
  readonly url: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly image: Maybe<FileFilterInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type DownloadedImageSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<DownloadedImageFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type feelingsConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<feelingsEdge>;
  readonly nodes: ReadonlyArray<feelings>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<feelingsGroupConnection>;
};


type feelingsConnection_distinctArgs = {
  field: feelingsFieldsEnum;
};


type feelingsConnection_maxArgs = {
  field: feelingsFieldsEnum;
};


type feelingsConnection_minArgs = {
  field: feelingsFieldsEnum;
};


type feelingsConnection_sumArgs = {
  field: feelingsFieldsEnum;
};


type feelingsConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: feelingsFieldsEnum;
};

type feelingsEdge = {
  readonly next: Maybe<feelings>;
  readonly node: feelings;
  readonly previous: Maybe<feelings>;
};

type feelingsFieldsEnum =
  | 'time'
  | 'mood'
  | 'activities'
  | 'notes'
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type';

type feelingsGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<feelingsEdge>;
  readonly nodes: ReadonlyArray<feelings>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<feelingsGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type feelingsGroupConnection_distinctArgs = {
  field: feelingsFieldsEnum;
};


type feelingsGroupConnection_maxArgs = {
  field: feelingsFieldsEnum;
};


type feelingsGroupConnection_minArgs = {
  field: feelingsFieldsEnum;
};


type feelingsGroupConnection_sumArgs = {
  field: feelingsFieldsEnum;
};


type feelingsGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: feelingsFieldsEnum;
};

type feelingsFilterInput = {
  readonly time: Maybe<StringQueryOperatorInput>;
  readonly mood: Maybe<StringQueryOperatorInput>;
  readonly activities: Maybe<StringQueryOperatorInput>;
  readonly notes: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type feelingsSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<feelingsFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type LastfmTrackImageFilterListInput = {
  readonly elemMatch: Maybe<LastfmTrackImageFilterInput>;
};

type LastfmTrackImageFilterInput = {
  readonly size: Maybe<StringQueryOperatorInput>;
  readonly text: Maybe<StringQueryOperatorInput>;
};

type LastfmPlaybackFilterListInput = {
  readonly elemMatch: Maybe<LastfmPlaybackFilterInput>;
};

type LastfmPlaybackFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
  readonly date: Maybe<StringQueryOperatorInput>;
  readonly track: Maybe<LastfmTrackFilterInput>;
};

type LastfmTrackFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly loved: Maybe<StringQueryOperatorInput>;
  readonly mbid: Maybe<StringQueryOperatorInput>;
  readonly streamable: Maybe<StringQueryOperatorInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
  readonly image: Maybe<LastfmTrackImageFilterListInput>;
  readonly playbacks: Maybe<LastfmPlaybackFilterListInput>;
  readonly artist: Maybe<LastfmArtistFilterInput>;
  readonly album: Maybe<LastfmAlbumFilterInput>;
};

type LastfmArtistFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly mbid: Maybe<StringQueryOperatorInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
  readonly image: Maybe<LastfmArtistImageFilterListInput>;
  readonly playbacks: Maybe<LastfmPlaybackFilterListInput>;
  readonly albums: Maybe<LastfmAlbumFilterListInput>;
  readonly tracks: Maybe<LastfmTrackFilterListInput>;
};

type LastfmArtistImageFilterListInput = {
  readonly elemMatch: Maybe<LastfmArtistImageFilterInput>;
};

type LastfmArtistImageFilterInput = {
  readonly size: Maybe<StringQueryOperatorInput>;
  readonly text: Maybe<StringQueryOperatorInput>;
};

type LastfmAlbumFilterListInput = {
  readonly elemMatch: Maybe<LastfmAlbumFilterInput>;
};

type LastfmAlbumFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly mbid: Maybe<StringQueryOperatorInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
  readonly playbacks: Maybe<LastfmPlaybackFilterListInput>;
  readonly artist: Maybe<LastfmArtistFilterInput>;
  readonly tracks: Maybe<LastfmTrackFilterListInput>;
};

type LastfmTrackFilterListInput = {
  readonly elemMatch: Maybe<LastfmTrackFilterInput>;
};

type LastfmTrackConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<LastfmTrackEdge>;
  readonly nodes: ReadonlyArray<LastfmTrack>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<LastfmTrackGroupConnection>;
};


type LastfmTrackConnection_distinctArgs = {
  field: LastfmTrackFieldsEnum;
};


type LastfmTrackConnection_maxArgs = {
  field: LastfmTrackFieldsEnum;
};


type LastfmTrackConnection_minArgs = {
  field: LastfmTrackFieldsEnum;
};


type LastfmTrackConnection_sumArgs = {
  field: LastfmTrackFieldsEnum;
};


type LastfmTrackConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: LastfmTrackFieldsEnum;
};

type LastfmTrackEdge = {
  readonly next: Maybe<LastfmTrack>;
  readonly node: LastfmTrack;
  readonly previous: Maybe<LastfmTrack>;
};

type LastfmTrackFieldsEnum =
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type'
  | 'name'
  | 'loved'
  | 'mbid'
  | 'streamable'
  | 'url'
  | 'image'
  | 'image.size'
  | 'image.text'
  | 'playbacks'
  | 'playbacks.id'
  | 'playbacks.parent.id'
  | 'playbacks.parent.parent.id'
  | 'playbacks.parent.parent.children'
  | 'playbacks.parent.children'
  | 'playbacks.parent.children.id'
  | 'playbacks.parent.children.children'
  | 'playbacks.parent.internal.content'
  | 'playbacks.parent.internal.contentDigest'
  | 'playbacks.parent.internal.description'
  | 'playbacks.parent.internal.fieldOwners'
  | 'playbacks.parent.internal.ignoreType'
  | 'playbacks.parent.internal.mediaType'
  | 'playbacks.parent.internal.owner'
  | 'playbacks.parent.internal.type'
  | 'playbacks.children'
  | 'playbacks.children.id'
  | 'playbacks.children.parent.id'
  | 'playbacks.children.parent.children'
  | 'playbacks.children.children'
  | 'playbacks.children.children.id'
  | 'playbacks.children.children.children'
  | 'playbacks.children.internal.content'
  | 'playbacks.children.internal.contentDigest'
  | 'playbacks.children.internal.description'
  | 'playbacks.children.internal.fieldOwners'
  | 'playbacks.children.internal.ignoreType'
  | 'playbacks.children.internal.mediaType'
  | 'playbacks.children.internal.owner'
  | 'playbacks.children.internal.type'
  | 'playbacks.internal.content'
  | 'playbacks.internal.contentDigest'
  | 'playbacks.internal.description'
  | 'playbacks.internal.fieldOwners'
  | 'playbacks.internal.ignoreType'
  | 'playbacks.internal.mediaType'
  | 'playbacks.internal.owner'
  | 'playbacks.internal.type'
  | 'playbacks.date'
  | 'playbacks.track.id'
  | 'playbacks.track.parent.id'
  | 'playbacks.track.parent.children'
  | 'playbacks.track.children'
  | 'playbacks.track.children.id'
  | 'playbacks.track.children.children'
  | 'playbacks.track.internal.content'
  | 'playbacks.track.internal.contentDigest'
  | 'playbacks.track.internal.description'
  | 'playbacks.track.internal.fieldOwners'
  | 'playbacks.track.internal.ignoreType'
  | 'playbacks.track.internal.mediaType'
  | 'playbacks.track.internal.owner'
  | 'playbacks.track.internal.type'
  | 'playbacks.track.name'
  | 'playbacks.track.loved'
  | 'playbacks.track.mbid'
  | 'playbacks.track.streamable'
  | 'playbacks.track.url'
  | 'playbacks.track.image'
  | 'playbacks.track.image.size'
  | 'playbacks.track.image.text'
  | 'playbacks.track.playbacks'
  | 'playbacks.track.playbacks.id'
  | 'playbacks.track.playbacks.children'
  | 'playbacks.track.playbacks.date'
  | 'playbacks.track.artist.id'
  | 'playbacks.track.artist.children'
  | 'playbacks.track.artist.name'
  | 'playbacks.track.artist.mbid'
  | 'playbacks.track.artist.url'
  | 'playbacks.track.artist.image'
  | 'playbacks.track.artist.playbacks'
  | 'playbacks.track.artist.albums'
  | 'playbacks.track.artist.tracks'
  | 'playbacks.track.album.id'
  | 'playbacks.track.album.children'
  | 'playbacks.track.album.name'
  | 'playbacks.track.album.mbid'
  | 'playbacks.track.album.url'
  | 'playbacks.track.album.playbacks'
  | 'playbacks.track.album.tracks'
  | 'artist.id'
  | 'artist.parent.id'
  | 'artist.parent.parent.id'
  | 'artist.parent.parent.children'
  | 'artist.parent.children'
  | 'artist.parent.children.id'
  | 'artist.parent.children.children'
  | 'artist.parent.internal.content'
  | 'artist.parent.internal.contentDigest'
  | 'artist.parent.internal.description'
  | 'artist.parent.internal.fieldOwners'
  | 'artist.parent.internal.ignoreType'
  | 'artist.parent.internal.mediaType'
  | 'artist.parent.internal.owner'
  | 'artist.parent.internal.type'
  | 'artist.children'
  | 'artist.children.id'
  | 'artist.children.parent.id'
  | 'artist.children.parent.children'
  | 'artist.children.children'
  | 'artist.children.children.id'
  | 'artist.children.children.children'
  | 'artist.children.internal.content'
  | 'artist.children.internal.contentDigest'
  | 'artist.children.internal.description'
  | 'artist.children.internal.fieldOwners'
  | 'artist.children.internal.ignoreType'
  | 'artist.children.internal.mediaType'
  | 'artist.children.internal.owner'
  | 'artist.children.internal.type'
  | 'artist.internal.content'
  | 'artist.internal.contentDigest'
  | 'artist.internal.description'
  | 'artist.internal.fieldOwners'
  | 'artist.internal.ignoreType'
  | 'artist.internal.mediaType'
  | 'artist.internal.owner'
  | 'artist.internal.type'
  | 'artist.name'
  | 'artist.mbid'
  | 'artist.url'
  | 'artist.image'
  | 'artist.image.size'
  | 'artist.image.text'
  | 'artist.playbacks'
  | 'artist.playbacks.id'
  | 'artist.playbacks.parent.id'
  | 'artist.playbacks.parent.children'
  | 'artist.playbacks.children'
  | 'artist.playbacks.children.id'
  | 'artist.playbacks.children.children'
  | 'artist.playbacks.internal.content'
  | 'artist.playbacks.internal.contentDigest'
  | 'artist.playbacks.internal.description'
  | 'artist.playbacks.internal.fieldOwners'
  | 'artist.playbacks.internal.ignoreType'
  | 'artist.playbacks.internal.mediaType'
  | 'artist.playbacks.internal.owner'
  | 'artist.playbacks.internal.type'
  | 'artist.playbacks.date'
  | 'artist.playbacks.track.id'
  | 'artist.playbacks.track.children'
  | 'artist.playbacks.track.name'
  | 'artist.playbacks.track.loved'
  | 'artist.playbacks.track.mbid'
  | 'artist.playbacks.track.streamable'
  | 'artist.playbacks.track.url'
  | 'artist.playbacks.track.image'
  | 'artist.playbacks.track.playbacks'
  | 'artist.albums'
  | 'artist.albums.id'
  | 'artist.albums.parent.id'
  | 'artist.albums.parent.children'
  | 'artist.albums.children'
  | 'artist.albums.children.id'
  | 'artist.albums.children.children'
  | 'artist.albums.internal.content'
  | 'artist.albums.internal.contentDigest'
  | 'artist.albums.internal.description'
  | 'artist.albums.internal.fieldOwners'
  | 'artist.albums.internal.ignoreType'
  | 'artist.albums.internal.mediaType'
  | 'artist.albums.internal.owner'
  | 'artist.albums.internal.type'
  | 'artist.albums.name'
  | 'artist.albums.mbid'
  | 'artist.albums.url'
  | 'artist.albums.playbacks'
  | 'artist.albums.playbacks.id'
  | 'artist.albums.playbacks.children'
  | 'artist.albums.playbacks.date'
  | 'artist.albums.artist.id'
  | 'artist.albums.artist.children'
  | 'artist.albums.artist.name'
  | 'artist.albums.artist.mbid'
  | 'artist.albums.artist.url'
  | 'artist.albums.artist.image'
  | 'artist.albums.artist.playbacks'
  | 'artist.albums.artist.albums'
  | 'artist.albums.artist.tracks'
  | 'artist.albums.tracks'
  | 'artist.albums.tracks.id'
  | 'artist.albums.tracks.children'
  | 'artist.albums.tracks.name'
  | 'artist.albums.tracks.loved'
  | 'artist.albums.tracks.mbid'
  | 'artist.albums.tracks.streamable'
  | 'artist.albums.tracks.url'
  | 'artist.albums.tracks.image'
  | 'artist.albums.tracks.playbacks'
  | 'artist.tracks'
  | 'artist.tracks.id'
  | 'artist.tracks.parent.id'
  | 'artist.tracks.parent.children'
  | 'artist.tracks.children'
  | 'artist.tracks.children.id'
  | 'artist.tracks.children.children'
  | 'artist.tracks.internal.content'
  | 'artist.tracks.internal.contentDigest'
  | 'artist.tracks.internal.description'
  | 'artist.tracks.internal.fieldOwners'
  | 'artist.tracks.internal.ignoreType'
  | 'artist.tracks.internal.mediaType'
  | 'artist.tracks.internal.owner'
  | 'artist.tracks.internal.type'
  | 'artist.tracks.name'
  | 'artist.tracks.loved'
  | 'artist.tracks.mbid'
  | 'artist.tracks.streamable'
  | 'artist.tracks.url'
  | 'artist.tracks.image'
  | 'artist.tracks.image.size'
  | 'artist.tracks.image.text'
  | 'artist.tracks.playbacks'
  | 'artist.tracks.playbacks.id'
  | 'artist.tracks.playbacks.children'
  | 'artist.tracks.playbacks.date'
  | 'artist.tracks.artist.id'
  | 'artist.tracks.artist.children'
  | 'artist.tracks.artist.name'
  | 'artist.tracks.artist.mbid'
  | 'artist.tracks.artist.url'
  | 'artist.tracks.artist.image'
  | 'artist.tracks.artist.playbacks'
  | 'artist.tracks.artist.albums'
  | 'artist.tracks.artist.tracks'
  | 'artist.tracks.album.id'
  | 'artist.tracks.album.children'
  | 'artist.tracks.album.name'
  | 'artist.tracks.album.mbid'
  | 'artist.tracks.album.url'
  | 'artist.tracks.album.playbacks'
  | 'artist.tracks.album.tracks'
  | 'album.id'
  | 'album.parent.id'
  | 'album.parent.parent.id'
  | 'album.parent.parent.children'
  | 'album.parent.children'
  | 'album.parent.children.id'
  | 'album.parent.children.children'
  | 'album.parent.internal.content'
  | 'album.parent.internal.contentDigest'
  | 'album.parent.internal.description'
  | 'album.parent.internal.fieldOwners'
  | 'album.parent.internal.ignoreType'
  | 'album.parent.internal.mediaType'
  | 'album.parent.internal.owner'
  | 'album.parent.internal.type'
  | 'album.children'
  | 'album.children.id'
  | 'album.children.parent.id'
  | 'album.children.parent.children'
  | 'album.children.children'
  | 'album.children.children.id'
  | 'album.children.children.children'
  | 'album.children.internal.content'
  | 'album.children.internal.contentDigest'
  | 'album.children.internal.description'
  | 'album.children.internal.fieldOwners'
  | 'album.children.internal.ignoreType'
  | 'album.children.internal.mediaType'
  | 'album.children.internal.owner'
  | 'album.children.internal.type'
  | 'album.internal.content'
  | 'album.internal.contentDigest'
  | 'album.internal.description'
  | 'album.internal.fieldOwners'
  | 'album.internal.ignoreType'
  | 'album.internal.mediaType'
  | 'album.internal.owner'
  | 'album.internal.type'
  | 'album.name'
  | 'album.mbid'
  | 'album.url'
  | 'album.playbacks'
  | 'album.playbacks.id'
  | 'album.playbacks.parent.id'
  | 'album.playbacks.parent.children'
  | 'album.playbacks.children'
  | 'album.playbacks.children.id'
  | 'album.playbacks.children.children'
  | 'album.playbacks.internal.content'
  | 'album.playbacks.internal.contentDigest'
  | 'album.playbacks.internal.description'
  | 'album.playbacks.internal.fieldOwners'
  | 'album.playbacks.internal.ignoreType'
  | 'album.playbacks.internal.mediaType'
  | 'album.playbacks.internal.owner'
  | 'album.playbacks.internal.type'
  | 'album.playbacks.date'
  | 'album.playbacks.track.id'
  | 'album.playbacks.track.children'
  | 'album.playbacks.track.name'
  | 'album.playbacks.track.loved'
  | 'album.playbacks.track.mbid'
  | 'album.playbacks.track.streamable'
  | 'album.playbacks.track.url'
  | 'album.playbacks.track.image'
  | 'album.playbacks.track.playbacks'
  | 'album.artist.id'
  | 'album.artist.parent.id'
  | 'album.artist.parent.children'
  | 'album.artist.children'
  | 'album.artist.children.id'
  | 'album.artist.children.children'
  | 'album.artist.internal.content'
  | 'album.artist.internal.contentDigest'
  | 'album.artist.internal.description'
  | 'album.artist.internal.fieldOwners'
  | 'album.artist.internal.ignoreType'
  | 'album.artist.internal.mediaType'
  | 'album.artist.internal.owner'
  | 'album.artist.internal.type'
  | 'album.artist.name'
  | 'album.artist.mbid'
  | 'album.artist.url'
  | 'album.artist.image'
  | 'album.artist.image.size'
  | 'album.artist.image.text'
  | 'album.artist.playbacks'
  | 'album.artist.playbacks.id'
  | 'album.artist.playbacks.children'
  | 'album.artist.playbacks.date'
  | 'album.artist.albums'
  | 'album.artist.albums.id'
  | 'album.artist.albums.children'
  | 'album.artist.albums.name'
  | 'album.artist.albums.mbid'
  | 'album.artist.albums.url'
  | 'album.artist.albums.playbacks'
  | 'album.artist.albums.tracks'
  | 'album.artist.tracks'
  | 'album.artist.tracks.id'
  | 'album.artist.tracks.children'
  | 'album.artist.tracks.name'
  | 'album.artist.tracks.loved'
  | 'album.artist.tracks.mbid'
  | 'album.artist.tracks.streamable'
  | 'album.artist.tracks.url'
  | 'album.artist.tracks.image'
  | 'album.artist.tracks.playbacks'
  | 'album.tracks'
  | 'album.tracks.id'
  | 'album.tracks.parent.id'
  | 'album.tracks.parent.children'
  | 'album.tracks.children'
  | 'album.tracks.children.id'
  | 'album.tracks.children.children'
  | 'album.tracks.internal.content'
  | 'album.tracks.internal.contentDigest'
  | 'album.tracks.internal.description'
  | 'album.tracks.internal.fieldOwners'
  | 'album.tracks.internal.ignoreType'
  | 'album.tracks.internal.mediaType'
  | 'album.tracks.internal.owner'
  | 'album.tracks.internal.type'
  | 'album.tracks.name'
  | 'album.tracks.loved'
  | 'album.tracks.mbid'
  | 'album.tracks.streamable'
  | 'album.tracks.url'
  | 'album.tracks.image'
  | 'album.tracks.image.size'
  | 'album.tracks.image.text'
  | 'album.tracks.playbacks'
  | 'album.tracks.playbacks.id'
  | 'album.tracks.playbacks.children'
  | 'album.tracks.playbacks.date'
  | 'album.tracks.artist.id'
  | 'album.tracks.artist.children'
  | 'album.tracks.artist.name'
  | 'album.tracks.artist.mbid'
  | 'album.tracks.artist.url'
  | 'album.tracks.artist.image'
  | 'album.tracks.artist.playbacks'
  | 'album.tracks.artist.albums'
  | 'album.tracks.artist.tracks'
  | 'album.tracks.album.id'
  | 'album.tracks.album.children'
  | 'album.tracks.album.name'
  | 'album.tracks.album.mbid'
  | 'album.tracks.album.url'
  | 'album.tracks.album.playbacks'
  | 'album.tracks.album.tracks';

type LastfmTrackGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<LastfmTrackEdge>;
  readonly nodes: ReadonlyArray<LastfmTrack>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<LastfmTrackGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type LastfmTrackGroupConnection_distinctArgs = {
  field: LastfmTrackFieldsEnum;
};


type LastfmTrackGroupConnection_maxArgs = {
  field: LastfmTrackFieldsEnum;
};


type LastfmTrackGroupConnection_minArgs = {
  field: LastfmTrackFieldsEnum;
};


type LastfmTrackGroupConnection_sumArgs = {
  field: LastfmTrackFieldsEnum;
};


type LastfmTrackGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: LastfmTrackFieldsEnum;
};

type LastfmTrackSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<LastfmTrackFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type LastfmPlaybackConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<LastfmPlaybackEdge>;
  readonly nodes: ReadonlyArray<LastfmPlayback>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<LastfmPlaybackGroupConnection>;
};


type LastfmPlaybackConnection_distinctArgs = {
  field: LastfmPlaybackFieldsEnum;
};


type LastfmPlaybackConnection_maxArgs = {
  field: LastfmPlaybackFieldsEnum;
};


type LastfmPlaybackConnection_minArgs = {
  field: LastfmPlaybackFieldsEnum;
};


type LastfmPlaybackConnection_sumArgs = {
  field: LastfmPlaybackFieldsEnum;
};


type LastfmPlaybackConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: LastfmPlaybackFieldsEnum;
};

type LastfmPlaybackEdge = {
  readonly next: Maybe<LastfmPlayback>;
  readonly node: LastfmPlayback;
  readonly previous: Maybe<LastfmPlayback>;
};

type LastfmPlaybackFieldsEnum =
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type'
  | 'date'
  | 'track.id'
  | 'track.parent.id'
  | 'track.parent.parent.id'
  | 'track.parent.parent.children'
  | 'track.parent.children'
  | 'track.parent.children.id'
  | 'track.parent.children.children'
  | 'track.parent.internal.content'
  | 'track.parent.internal.contentDigest'
  | 'track.parent.internal.description'
  | 'track.parent.internal.fieldOwners'
  | 'track.parent.internal.ignoreType'
  | 'track.parent.internal.mediaType'
  | 'track.parent.internal.owner'
  | 'track.parent.internal.type'
  | 'track.children'
  | 'track.children.id'
  | 'track.children.parent.id'
  | 'track.children.parent.children'
  | 'track.children.children'
  | 'track.children.children.id'
  | 'track.children.children.children'
  | 'track.children.internal.content'
  | 'track.children.internal.contentDigest'
  | 'track.children.internal.description'
  | 'track.children.internal.fieldOwners'
  | 'track.children.internal.ignoreType'
  | 'track.children.internal.mediaType'
  | 'track.children.internal.owner'
  | 'track.children.internal.type'
  | 'track.internal.content'
  | 'track.internal.contentDigest'
  | 'track.internal.description'
  | 'track.internal.fieldOwners'
  | 'track.internal.ignoreType'
  | 'track.internal.mediaType'
  | 'track.internal.owner'
  | 'track.internal.type'
  | 'track.name'
  | 'track.loved'
  | 'track.mbid'
  | 'track.streamable'
  | 'track.url'
  | 'track.image'
  | 'track.image.size'
  | 'track.image.text'
  | 'track.playbacks'
  | 'track.playbacks.id'
  | 'track.playbacks.parent.id'
  | 'track.playbacks.parent.children'
  | 'track.playbacks.children'
  | 'track.playbacks.children.id'
  | 'track.playbacks.children.children'
  | 'track.playbacks.internal.content'
  | 'track.playbacks.internal.contentDigest'
  | 'track.playbacks.internal.description'
  | 'track.playbacks.internal.fieldOwners'
  | 'track.playbacks.internal.ignoreType'
  | 'track.playbacks.internal.mediaType'
  | 'track.playbacks.internal.owner'
  | 'track.playbacks.internal.type'
  | 'track.playbacks.date'
  | 'track.playbacks.track.id'
  | 'track.playbacks.track.children'
  | 'track.playbacks.track.name'
  | 'track.playbacks.track.loved'
  | 'track.playbacks.track.mbid'
  | 'track.playbacks.track.streamable'
  | 'track.playbacks.track.url'
  | 'track.playbacks.track.image'
  | 'track.playbacks.track.playbacks'
  | 'track.artist.id'
  | 'track.artist.parent.id'
  | 'track.artist.parent.children'
  | 'track.artist.children'
  | 'track.artist.children.id'
  | 'track.artist.children.children'
  | 'track.artist.internal.content'
  | 'track.artist.internal.contentDigest'
  | 'track.artist.internal.description'
  | 'track.artist.internal.fieldOwners'
  | 'track.artist.internal.ignoreType'
  | 'track.artist.internal.mediaType'
  | 'track.artist.internal.owner'
  | 'track.artist.internal.type'
  | 'track.artist.name'
  | 'track.artist.mbid'
  | 'track.artist.url'
  | 'track.artist.image'
  | 'track.artist.image.size'
  | 'track.artist.image.text'
  | 'track.artist.playbacks'
  | 'track.artist.playbacks.id'
  | 'track.artist.playbacks.children'
  | 'track.artist.playbacks.date'
  | 'track.artist.albums'
  | 'track.artist.albums.id'
  | 'track.artist.albums.children'
  | 'track.artist.albums.name'
  | 'track.artist.albums.mbid'
  | 'track.artist.albums.url'
  | 'track.artist.albums.playbacks'
  | 'track.artist.albums.tracks'
  | 'track.artist.tracks'
  | 'track.artist.tracks.id'
  | 'track.artist.tracks.children'
  | 'track.artist.tracks.name'
  | 'track.artist.tracks.loved'
  | 'track.artist.tracks.mbid'
  | 'track.artist.tracks.streamable'
  | 'track.artist.tracks.url'
  | 'track.artist.tracks.image'
  | 'track.artist.tracks.playbacks'
  | 'track.album.id'
  | 'track.album.parent.id'
  | 'track.album.parent.children'
  | 'track.album.children'
  | 'track.album.children.id'
  | 'track.album.children.children'
  | 'track.album.internal.content'
  | 'track.album.internal.contentDigest'
  | 'track.album.internal.description'
  | 'track.album.internal.fieldOwners'
  | 'track.album.internal.ignoreType'
  | 'track.album.internal.mediaType'
  | 'track.album.internal.owner'
  | 'track.album.internal.type'
  | 'track.album.name'
  | 'track.album.mbid'
  | 'track.album.url'
  | 'track.album.playbacks'
  | 'track.album.playbacks.id'
  | 'track.album.playbacks.children'
  | 'track.album.playbacks.date'
  | 'track.album.artist.id'
  | 'track.album.artist.children'
  | 'track.album.artist.name'
  | 'track.album.artist.mbid'
  | 'track.album.artist.url'
  | 'track.album.artist.image'
  | 'track.album.artist.playbacks'
  | 'track.album.artist.albums'
  | 'track.album.artist.tracks'
  | 'track.album.tracks'
  | 'track.album.tracks.id'
  | 'track.album.tracks.children'
  | 'track.album.tracks.name'
  | 'track.album.tracks.loved'
  | 'track.album.tracks.mbid'
  | 'track.album.tracks.streamable'
  | 'track.album.tracks.url'
  | 'track.album.tracks.image'
  | 'track.album.tracks.playbacks';

type LastfmPlaybackGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<LastfmPlaybackEdge>;
  readonly nodes: ReadonlyArray<LastfmPlayback>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<LastfmPlaybackGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type LastfmPlaybackGroupConnection_distinctArgs = {
  field: LastfmPlaybackFieldsEnum;
};


type LastfmPlaybackGroupConnection_maxArgs = {
  field: LastfmPlaybackFieldsEnum;
};


type LastfmPlaybackGroupConnection_minArgs = {
  field: LastfmPlaybackFieldsEnum;
};


type LastfmPlaybackGroupConnection_sumArgs = {
  field: LastfmPlaybackFieldsEnum;
};


type LastfmPlaybackGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: LastfmPlaybackFieldsEnum;
};

type LastfmPlaybackSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<LastfmPlaybackFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type LastfmMetaConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<LastfmMetaEdge>;
  readonly nodes: ReadonlyArray<LastfmMeta>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<LastfmMetaGroupConnection>;
};


type LastfmMetaConnection_distinctArgs = {
  field: LastfmMetaFieldsEnum;
};


type LastfmMetaConnection_maxArgs = {
  field: LastfmMetaFieldsEnum;
};


type LastfmMetaConnection_minArgs = {
  field: LastfmMetaFieldsEnum;
};


type LastfmMetaConnection_sumArgs = {
  field: LastfmMetaFieldsEnum;
};


type LastfmMetaConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: LastfmMetaFieldsEnum;
};

type LastfmMetaEdge = {
  readonly next: Maybe<LastfmMeta>;
  readonly node: LastfmMeta;
  readonly previous: Maybe<LastfmMeta>;
};

type LastfmMetaFieldsEnum =
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type'
  | 'total_playbacks';

type LastfmMetaGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<LastfmMetaEdge>;
  readonly nodes: ReadonlyArray<LastfmMeta>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<LastfmMetaGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type LastfmMetaGroupConnection_distinctArgs = {
  field: LastfmMetaFieldsEnum;
};


type LastfmMetaGroupConnection_maxArgs = {
  field: LastfmMetaFieldsEnum;
};


type LastfmMetaGroupConnection_minArgs = {
  field: LastfmMetaFieldsEnum;
};


type LastfmMetaGroupConnection_sumArgs = {
  field: LastfmMetaFieldsEnum;
};


type LastfmMetaGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: LastfmMetaFieldsEnum;
};

type LastfmMetaFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
  readonly total_playbacks: Maybe<StringQueryOperatorInput>;
};

type LastfmMetaSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<LastfmMetaFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type LastfmArtistConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<LastfmArtistEdge>;
  readonly nodes: ReadonlyArray<LastfmArtist>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<LastfmArtistGroupConnection>;
};


type LastfmArtistConnection_distinctArgs = {
  field: LastfmArtistFieldsEnum;
};


type LastfmArtistConnection_maxArgs = {
  field: LastfmArtistFieldsEnum;
};


type LastfmArtistConnection_minArgs = {
  field: LastfmArtistFieldsEnum;
};


type LastfmArtistConnection_sumArgs = {
  field: LastfmArtistFieldsEnum;
};


type LastfmArtistConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: LastfmArtistFieldsEnum;
};

type LastfmArtistEdge = {
  readonly next: Maybe<LastfmArtist>;
  readonly node: LastfmArtist;
  readonly previous: Maybe<LastfmArtist>;
};

type LastfmArtistFieldsEnum =
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type'
  | 'name'
  | 'mbid'
  | 'url'
  | 'image'
  | 'image.size'
  | 'image.text'
  | 'playbacks'
  | 'playbacks.id'
  | 'playbacks.parent.id'
  | 'playbacks.parent.parent.id'
  | 'playbacks.parent.parent.children'
  | 'playbacks.parent.children'
  | 'playbacks.parent.children.id'
  | 'playbacks.parent.children.children'
  | 'playbacks.parent.internal.content'
  | 'playbacks.parent.internal.contentDigest'
  | 'playbacks.parent.internal.description'
  | 'playbacks.parent.internal.fieldOwners'
  | 'playbacks.parent.internal.ignoreType'
  | 'playbacks.parent.internal.mediaType'
  | 'playbacks.parent.internal.owner'
  | 'playbacks.parent.internal.type'
  | 'playbacks.children'
  | 'playbacks.children.id'
  | 'playbacks.children.parent.id'
  | 'playbacks.children.parent.children'
  | 'playbacks.children.children'
  | 'playbacks.children.children.id'
  | 'playbacks.children.children.children'
  | 'playbacks.children.internal.content'
  | 'playbacks.children.internal.contentDigest'
  | 'playbacks.children.internal.description'
  | 'playbacks.children.internal.fieldOwners'
  | 'playbacks.children.internal.ignoreType'
  | 'playbacks.children.internal.mediaType'
  | 'playbacks.children.internal.owner'
  | 'playbacks.children.internal.type'
  | 'playbacks.internal.content'
  | 'playbacks.internal.contentDigest'
  | 'playbacks.internal.description'
  | 'playbacks.internal.fieldOwners'
  | 'playbacks.internal.ignoreType'
  | 'playbacks.internal.mediaType'
  | 'playbacks.internal.owner'
  | 'playbacks.internal.type'
  | 'playbacks.date'
  | 'playbacks.track.id'
  | 'playbacks.track.parent.id'
  | 'playbacks.track.parent.children'
  | 'playbacks.track.children'
  | 'playbacks.track.children.id'
  | 'playbacks.track.children.children'
  | 'playbacks.track.internal.content'
  | 'playbacks.track.internal.contentDigest'
  | 'playbacks.track.internal.description'
  | 'playbacks.track.internal.fieldOwners'
  | 'playbacks.track.internal.ignoreType'
  | 'playbacks.track.internal.mediaType'
  | 'playbacks.track.internal.owner'
  | 'playbacks.track.internal.type'
  | 'playbacks.track.name'
  | 'playbacks.track.loved'
  | 'playbacks.track.mbid'
  | 'playbacks.track.streamable'
  | 'playbacks.track.url'
  | 'playbacks.track.image'
  | 'playbacks.track.image.size'
  | 'playbacks.track.image.text'
  | 'playbacks.track.playbacks'
  | 'playbacks.track.playbacks.id'
  | 'playbacks.track.playbacks.children'
  | 'playbacks.track.playbacks.date'
  | 'playbacks.track.artist.id'
  | 'playbacks.track.artist.children'
  | 'playbacks.track.artist.name'
  | 'playbacks.track.artist.mbid'
  | 'playbacks.track.artist.url'
  | 'playbacks.track.artist.image'
  | 'playbacks.track.artist.playbacks'
  | 'playbacks.track.artist.albums'
  | 'playbacks.track.artist.tracks'
  | 'playbacks.track.album.id'
  | 'playbacks.track.album.children'
  | 'playbacks.track.album.name'
  | 'playbacks.track.album.mbid'
  | 'playbacks.track.album.url'
  | 'playbacks.track.album.playbacks'
  | 'playbacks.track.album.tracks'
  | 'albums'
  | 'albums.id'
  | 'albums.parent.id'
  | 'albums.parent.parent.id'
  | 'albums.parent.parent.children'
  | 'albums.parent.children'
  | 'albums.parent.children.id'
  | 'albums.parent.children.children'
  | 'albums.parent.internal.content'
  | 'albums.parent.internal.contentDigest'
  | 'albums.parent.internal.description'
  | 'albums.parent.internal.fieldOwners'
  | 'albums.parent.internal.ignoreType'
  | 'albums.parent.internal.mediaType'
  | 'albums.parent.internal.owner'
  | 'albums.parent.internal.type'
  | 'albums.children'
  | 'albums.children.id'
  | 'albums.children.parent.id'
  | 'albums.children.parent.children'
  | 'albums.children.children'
  | 'albums.children.children.id'
  | 'albums.children.children.children'
  | 'albums.children.internal.content'
  | 'albums.children.internal.contentDigest'
  | 'albums.children.internal.description'
  | 'albums.children.internal.fieldOwners'
  | 'albums.children.internal.ignoreType'
  | 'albums.children.internal.mediaType'
  | 'albums.children.internal.owner'
  | 'albums.children.internal.type'
  | 'albums.internal.content'
  | 'albums.internal.contentDigest'
  | 'albums.internal.description'
  | 'albums.internal.fieldOwners'
  | 'albums.internal.ignoreType'
  | 'albums.internal.mediaType'
  | 'albums.internal.owner'
  | 'albums.internal.type'
  | 'albums.name'
  | 'albums.mbid'
  | 'albums.url'
  | 'albums.playbacks'
  | 'albums.playbacks.id'
  | 'albums.playbacks.parent.id'
  | 'albums.playbacks.parent.children'
  | 'albums.playbacks.children'
  | 'albums.playbacks.children.id'
  | 'albums.playbacks.children.children'
  | 'albums.playbacks.internal.content'
  | 'albums.playbacks.internal.contentDigest'
  | 'albums.playbacks.internal.description'
  | 'albums.playbacks.internal.fieldOwners'
  | 'albums.playbacks.internal.ignoreType'
  | 'albums.playbacks.internal.mediaType'
  | 'albums.playbacks.internal.owner'
  | 'albums.playbacks.internal.type'
  | 'albums.playbacks.date'
  | 'albums.playbacks.track.id'
  | 'albums.playbacks.track.children'
  | 'albums.playbacks.track.name'
  | 'albums.playbacks.track.loved'
  | 'albums.playbacks.track.mbid'
  | 'albums.playbacks.track.streamable'
  | 'albums.playbacks.track.url'
  | 'albums.playbacks.track.image'
  | 'albums.playbacks.track.playbacks'
  | 'albums.artist.id'
  | 'albums.artist.parent.id'
  | 'albums.artist.parent.children'
  | 'albums.artist.children'
  | 'albums.artist.children.id'
  | 'albums.artist.children.children'
  | 'albums.artist.internal.content'
  | 'albums.artist.internal.contentDigest'
  | 'albums.artist.internal.description'
  | 'albums.artist.internal.fieldOwners'
  | 'albums.artist.internal.ignoreType'
  | 'albums.artist.internal.mediaType'
  | 'albums.artist.internal.owner'
  | 'albums.artist.internal.type'
  | 'albums.artist.name'
  | 'albums.artist.mbid'
  | 'albums.artist.url'
  | 'albums.artist.image'
  | 'albums.artist.image.size'
  | 'albums.artist.image.text'
  | 'albums.artist.playbacks'
  | 'albums.artist.playbacks.id'
  | 'albums.artist.playbacks.children'
  | 'albums.artist.playbacks.date'
  | 'albums.artist.albums'
  | 'albums.artist.albums.id'
  | 'albums.artist.albums.children'
  | 'albums.artist.albums.name'
  | 'albums.artist.albums.mbid'
  | 'albums.artist.albums.url'
  | 'albums.artist.albums.playbacks'
  | 'albums.artist.albums.tracks'
  | 'albums.artist.tracks'
  | 'albums.artist.tracks.id'
  | 'albums.artist.tracks.children'
  | 'albums.artist.tracks.name'
  | 'albums.artist.tracks.loved'
  | 'albums.artist.tracks.mbid'
  | 'albums.artist.tracks.streamable'
  | 'albums.artist.tracks.url'
  | 'albums.artist.tracks.image'
  | 'albums.artist.tracks.playbacks'
  | 'albums.tracks'
  | 'albums.tracks.id'
  | 'albums.tracks.parent.id'
  | 'albums.tracks.parent.children'
  | 'albums.tracks.children'
  | 'albums.tracks.children.id'
  | 'albums.tracks.children.children'
  | 'albums.tracks.internal.content'
  | 'albums.tracks.internal.contentDigest'
  | 'albums.tracks.internal.description'
  | 'albums.tracks.internal.fieldOwners'
  | 'albums.tracks.internal.ignoreType'
  | 'albums.tracks.internal.mediaType'
  | 'albums.tracks.internal.owner'
  | 'albums.tracks.internal.type'
  | 'albums.tracks.name'
  | 'albums.tracks.loved'
  | 'albums.tracks.mbid'
  | 'albums.tracks.streamable'
  | 'albums.tracks.url'
  | 'albums.tracks.image'
  | 'albums.tracks.image.size'
  | 'albums.tracks.image.text'
  | 'albums.tracks.playbacks'
  | 'albums.tracks.playbacks.id'
  | 'albums.tracks.playbacks.children'
  | 'albums.tracks.playbacks.date'
  | 'albums.tracks.artist.id'
  | 'albums.tracks.artist.children'
  | 'albums.tracks.artist.name'
  | 'albums.tracks.artist.mbid'
  | 'albums.tracks.artist.url'
  | 'albums.tracks.artist.image'
  | 'albums.tracks.artist.playbacks'
  | 'albums.tracks.artist.albums'
  | 'albums.tracks.artist.tracks'
  | 'albums.tracks.album.id'
  | 'albums.tracks.album.children'
  | 'albums.tracks.album.name'
  | 'albums.tracks.album.mbid'
  | 'albums.tracks.album.url'
  | 'albums.tracks.album.playbacks'
  | 'albums.tracks.album.tracks'
  | 'tracks'
  | 'tracks.id'
  | 'tracks.parent.id'
  | 'tracks.parent.parent.id'
  | 'tracks.parent.parent.children'
  | 'tracks.parent.children'
  | 'tracks.parent.children.id'
  | 'tracks.parent.children.children'
  | 'tracks.parent.internal.content'
  | 'tracks.parent.internal.contentDigest'
  | 'tracks.parent.internal.description'
  | 'tracks.parent.internal.fieldOwners'
  | 'tracks.parent.internal.ignoreType'
  | 'tracks.parent.internal.mediaType'
  | 'tracks.parent.internal.owner'
  | 'tracks.parent.internal.type'
  | 'tracks.children'
  | 'tracks.children.id'
  | 'tracks.children.parent.id'
  | 'tracks.children.parent.children'
  | 'tracks.children.children'
  | 'tracks.children.children.id'
  | 'tracks.children.children.children'
  | 'tracks.children.internal.content'
  | 'tracks.children.internal.contentDigest'
  | 'tracks.children.internal.description'
  | 'tracks.children.internal.fieldOwners'
  | 'tracks.children.internal.ignoreType'
  | 'tracks.children.internal.mediaType'
  | 'tracks.children.internal.owner'
  | 'tracks.children.internal.type'
  | 'tracks.internal.content'
  | 'tracks.internal.contentDigest'
  | 'tracks.internal.description'
  | 'tracks.internal.fieldOwners'
  | 'tracks.internal.ignoreType'
  | 'tracks.internal.mediaType'
  | 'tracks.internal.owner'
  | 'tracks.internal.type'
  | 'tracks.name'
  | 'tracks.loved'
  | 'tracks.mbid'
  | 'tracks.streamable'
  | 'tracks.url'
  | 'tracks.image'
  | 'tracks.image.size'
  | 'tracks.image.text'
  | 'tracks.playbacks'
  | 'tracks.playbacks.id'
  | 'tracks.playbacks.parent.id'
  | 'tracks.playbacks.parent.children'
  | 'tracks.playbacks.children'
  | 'tracks.playbacks.children.id'
  | 'tracks.playbacks.children.children'
  | 'tracks.playbacks.internal.content'
  | 'tracks.playbacks.internal.contentDigest'
  | 'tracks.playbacks.internal.description'
  | 'tracks.playbacks.internal.fieldOwners'
  | 'tracks.playbacks.internal.ignoreType'
  | 'tracks.playbacks.internal.mediaType'
  | 'tracks.playbacks.internal.owner'
  | 'tracks.playbacks.internal.type'
  | 'tracks.playbacks.date'
  | 'tracks.playbacks.track.id'
  | 'tracks.playbacks.track.children'
  | 'tracks.playbacks.track.name'
  | 'tracks.playbacks.track.loved'
  | 'tracks.playbacks.track.mbid'
  | 'tracks.playbacks.track.streamable'
  | 'tracks.playbacks.track.url'
  | 'tracks.playbacks.track.image'
  | 'tracks.playbacks.track.playbacks'
  | 'tracks.artist.id'
  | 'tracks.artist.parent.id'
  | 'tracks.artist.parent.children'
  | 'tracks.artist.children'
  | 'tracks.artist.children.id'
  | 'tracks.artist.children.children'
  | 'tracks.artist.internal.content'
  | 'tracks.artist.internal.contentDigest'
  | 'tracks.artist.internal.description'
  | 'tracks.artist.internal.fieldOwners'
  | 'tracks.artist.internal.ignoreType'
  | 'tracks.artist.internal.mediaType'
  | 'tracks.artist.internal.owner'
  | 'tracks.artist.internal.type'
  | 'tracks.artist.name'
  | 'tracks.artist.mbid'
  | 'tracks.artist.url'
  | 'tracks.artist.image'
  | 'tracks.artist.image.size'
  | 'tracks.artist.image.text'
  | 'tracks.artist.playbacks'
  | 'tracks.artist.playbacks.id'
  | 'tracks.artist.playbacks.children'
  | 'tracks.artist.playbacks.date'
  | 'tracks.artist.albums'
  | 'tracks.artist.albums.id'
  | 'tracks.artist.albums.children'
  | 'tracks.artist.albums.name'
  | 'tracks.artist.albums.mbid'
  | 'tracks.artist.albums.url'
  | 'tracks.artist.albums.playbacks'
  | 'tracks.artist.albums.tracks'
  | 'tracks.artist.tracks'
  | 'tracks.artist.tracks.id'
  | 'tracks.artist.tracks.children'
  | 'tracks.artist.tracks.name'
  | 'tracks.artist.tracks.loved'
  | 'tracks.artist.tracks.mbid'
  | 'tracks.artist.tracks.streamable'
  | 'tracks.artist.tracks.url'
  | 'tracks.artist.tracks.image'
  | 'tracks.artist.tracks.playbacks'
  | 'tracks.album.id'
  | 'tracks.album.parent.id'
  | 'tracks.album.parent.children'
  | 'tracks.album.children'
  | 'tracks.album.children.id'
  | 'tracks.album.children.children'
  | 'tracks.album.internal.content'
  | 'tracks.album.internal.contentDigest'
  | 'tracks.album.internal.description'
  | 'tracks.album.internal.fieldOwners'
  | 'tracks.album.internal.ignoreType'
  | 'tracks.album.internal.mediaType'
  | 'tracks.album.internal.owner'
  | 'tracks.album.internal.type'
  | 'tracks.album.name'
  | 'tracks.album.mbid'
  | 'tracks.album.url'
  | 'tracks.album.playbacks'
  | 'tracks.album.playbacks.id'
  | 'tracks.album.playbacks.children'
  | 'tracks.album.playbacks.date'
  | 'tracks.album.artist.id'
  | 'tracks.album.artist.children'
  | 'tracks.album.artist.name'
  | 'tracks.album.artist.mbid'
  | 'tracks.album.artist.url'
  | 'tracks.album.artist.image'
  | 'tracks.album.artist.playbacks'
  | 'tracks.album.artist.albums'
  | 'tracks.album.artist.tracks'
  | 'tracks.album.tracks'
  | 'tracks.album.tracks.id'
  | 'tracks.album.tracks.children'
  | 'tracks.album.tracks.name'
  | 'tracks.album.tracks.loved'
  | 'tracks.album.tracks.mbid'
  | 'tracks.album.tracks.streamable'
  | 'tracks.album.tracks.url'
  | 'tracks.album.tracks.image'
  | 'tracks.album.tracks.playbacks';

type LastfmArtistGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<LastfmArtistEdge>;
  readonly nodes: ReadonlyArray<LastfmArtist>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<LastfmArtistGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type LastfmArtistGroupConnection_distinctArgs = {
  field: LastfmArtistFieldsEnum;
};


type LastfmArtistGroupConnection_maxArgs = {
  field: LastfmArtistFieldsEnum;
};


type LastfmArtistGroupConnection_minArgs = {
  field: LastfmArtistFieldsEnum;
};


type LastfmArtistGroupConnection_sumArgs = {
  field: LastfmArtistFieldsEnum;
};


type LastfmArtistGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: LastfmArtistFieldsEnum;
};

type LastfmArtistSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<LastfmArtistFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type LastfmAlbumConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<LastfmAlbumEdge>;
  readonly nodes: ReadonlyArray<LastfmAlbum>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<LastfmAlbumGroupConnection>;
};


type LastfmAlbumConnection_distinctArgs = {
  field: LastfmAlbumFieldsEnum;
};


type LastfmAlbumConnection_maxArgs = {
  field: LastfmAlbumFieldsEnum;
};


type LastfmAlbumConnection_minArgs = {
  field: LastfmAlbumFieldsEnum;
};


type LastfmAlbumConnection_sumArgs = {
  field: LastfmAlbumFieldsEnum;
};


type LastfmAlbumConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: LastfmAlbumFieldsEnum;
};

type LastfmAlbumEdge = {
  readonly next: Maybe<LastfmAlbum>;
  readonly node: LastfmAlbum;
  readonly previous: Maybe<LastfmAlbum>;
};

type LastfmAlbumFieldsEnum =
  | 'id'
  | 'parent.id'
  | 'parent.parent.id'
  | 'parent.parent.parent.id'
  | 'parent.parent.parent.children'
  | 'parent.parent.children'
  | 'parent.parent.children.id'
  | 'parent.parent.children.children'
  | 'parent.parent.internal.content'
  | 'parent.parent.internal.contentDigest'
  | 'parent.parent.internal.description'
  | 'parent.parent.internal.fieldOwners'
  | 'parent.parent.internal.ignoreType'
  | 'parent.parent.internal.mediaType'
  | 'parent.parent.internal.owner'
  | 'parent.parent.internal.type'
  | 'parent.children'
  | 'parent.children.id'
  | 'parent.children.parent.id'
  | 'parent.children.parent.children'
  | 'parent.children.children'
  | 'parent.children.children.id'
  | 'parent.children.children.children'
  | 'parent.children.internal.content'
  | 'parent.children.internal.contentDigest'
  | 'parent.children.internal.description'
  | 'parent.children.internal.fieldOwners'
  | 'parent.children.internal.ignoreType'
  | 'parent.children.internal.mediaType'
  | 'parent.children.internal.owner'
  | 'parent.children.internal.type'
  | 'parent.internal.content'
  | 'parent.internal.contentDigest'
  | 'parent.internal.description'
  | 'parent.internal.fieldOwners'
  | 'parent.internal.ignoreType'
  | 'parent.internal.mediaType'
  | 'parent.internal.owner'
  | 'parent.internal.type'
  | 'children'
  | 'children.id'
  | 'children.parent.id'
  | 'children.parent.parent.id'
  | 'children.parent.parent.children'
  | 'children.parent.children'
  | 'children.parent.children.id'
  | 'children.parent.children.children'
  | 'children.parent.internal.content'
  | 'children.parent.internal.contentDigest'
  | 'children.parent.internal.description'
  | 'children.parent.internal.fieldOwners'
  | 'children.parent.internal.ignoreType'
  | 'children.parent.internal.mediaType'
  | 'children.parent.internal.owner'
  | 'children.parent.internal.type'
  | 'children.children'
  | 'children.children.id'
  | 'children.children.parent.id'
  | 'children.children.parent.children'
  | 'children.children.children'
  | 'children.children.children.id'
  | 'children.children.children.children'
  | 'children.children.internal.content'
  | 'children.children.internal.contentDigest'
  | 'children.children.internal.description'
  | 'children.children.internal.fieldOwners'
  | 'children.children.internal.ignoreType'
  | 'children.children.internal.mediaType'
  | 'children.children.internal.owner'
  | 'children.children.internal.type'
  | 'children.internal.content'
  | 'children.internal.contentDigest'
  | 'children.internal.description'
  | 'children.internal.fieldOwners'
  | 'children.internal.ignoreType'
  | 'children.internal.mediaType'
  | 'children.internal.owner'
  | 'children.internal.type'
  | 'internal.content'
  | 'internal.contentDigest'
  | 'internal.description'
  | 'internal.fieldOwners'
  | 'internal.ignoreType'
  | 'internal.mediaType'
  | 'internal.owner'
  | 'internal.type'
  | 'name'
  | 'mbid'
  | 'url'
  | 'playbacks'
  | 'playbacks.id'
  | 'playbacks.parent.id'
  | 'playbacks.parent.parent.id'
  | 'playbacks.parent.parent.children'
  | 'playbacks.parent.children'
  | 'playbacks.parent.children.id'
  | 'playbacks.parent.children.children'
  | 'playbacks.parent.internal.content'
  | 'playbacks.parent.internal.contentDigest'
  | 'playbacks.parent.internal.description'
  | 'playbacks.parent.internal.fieldOwners'
  | 'playbacks.parent.internal.ignoreType'
  | 'playbacks.parent.internal.mediaType'
  | 'playbacks.parent.internal.owner'
  | 'playbacks.parent.internal.type'
  | 'playbacks.children'
  | 'playbacks.children.id'
  | 'playbacks.children.parent.id'
  | 'playbacks.children.parent.children'
  | 'playbacks.children.children'
  | 'playbacks.children.children.id'
  | 'playbacks.children.children.children'
  | 'playbacks.children.internal.content'
  | 'playbacks.children.internal.contentDigest'
  | 'playbacks.children.internal.description'
  | 'playbacks.children.internal.fieldOwners'
  | 'playbacks.children.internal.ignoreType'
  | 'playbacks.children.internal.mediaType'
  | 'playbacks.children.internal.owner'
  | 'playbacks.children.internal.type'
  | 'playbacks.internal.content'
  | 'playbacks.internal.contentDigest'
  | 'playbacks.internal.description'
  | 'playbacks.internal.fieldOwners'
  | 'playbacks.internal.ignoreType'
  | 'playbacks.internal.mediaType'
  | 'playbacks.internal.owner'
  | 'playbacks.internal.type'
  | 'playbacks.date'
  | 'playbacks.track.id'
  | 'playbacks.track.parent.id'
  | 'playbacks.track.parent.children'
  | 'playbacks.track.children'
  | 'playbacks.track.children.id'
  | 'playbacks.track.children.children'
  | 'playbacks.track.internal.content'
  | 'playbacks.track.internal.contentDigest'
  | 'playbacks.track.internal.description'
  | 'playbacks.track.internal.fieldOwners'
  | 'playbacks.track.internal.ignoreType'
  | 'playbacks.track.internal.mediaType'
  | 'playbacks.track.internal.owner'
  | 'playbacks.track.internal.type'
  | 'playbacks.track.name'
  | 'playbacks.track.loved'
  | 'playbacks.track.mbid'
  | 'playbacks.track.streamable'
  | 'playbacks.track.url'
  | 'playbacks.track.image'
  | 'playbacks.track.image.size'
  | 'playbacks.track.image.text'
  | 'playbacks.track.playbacks'
  | 'playbacks.track.playbacks.id'
  | 'playbacks.track.playbacks.children'
  | 'playbacks.track.playbacks.date'
  | 'playbacks.track.artist.id'
  | 'playbacks.track.artist.children'
  | 'playbacks.track.artist.name'
  | 'playbacks.track.artist.mbid'
  | 'playbacks.track.artist.url'
  | 'playbacks.track.artist.image'
  | 'playbacks.track.artist.playbacks'
  | 'playbacks.track.artist.albums'
  | 'playbacks.track.artist.tracks'
  | 'playbacks.track.album.id'
  | 'playbacks.track.album.children'
  | 'playbacks.track.album.name'
  | 'playbacks.track.album.mbid'
  | 'playbacks.track.album.url'
  | 'playbacks.track.album.playbacks'
  | 'playbacks.track.album.tracks'
  | 'artist.id'
  | 'artist.parent.id'
  | 'artist.parent.parent.id'
  | 'artist.parent.parent.children'
  | 'artist.parent.children'
  | 'artist.parent.children.id'
  | 'artist.parent.children.children'
  | 'artist.parent.internal.content'
  | 'artist.parent.internal.contentDigest'
  | 'artist.parent.internal.description'
  | 'artist.parent.internal.fieldOwners'
  | 'artist.parent.internal.ignoreType'
  | 'artist.parent.internal.mediaType'
  | 'artist.parent.internal.owner'
  | 'artist.parent.internal.type'
  | 'artist.children'
  | 'artist.children.id'
  | 'artist.children.parent.id'
  | 'artist.children.parent.children'
  | 'artist.children.children'
  | 'artist.children.children.id'
  | 'artist.children.children.children'
  | 'artist.children.internal.content'
  | 'artist.children.internal.contentDigest'
  | 'artist.children.internal.description'
  | 'artist.children.internal.fieldOwners'
  | 'artist.children.internal.ignoreType'
  | 'artist.children.internal.mediaType'
  | 'artist.children.internal.owner'
  | 'artist.children.internal.type'
  | 'artist.internal.content'
  | 'artist.internal.contentDigest'
  | 'artist.internal.description'
  | 'artist.internal.fieldOwners'
  | 'artist.internal.ignoreType'
  | 'artist.internal.mediaType'
  | 'artist.internal.owner'
  | 'artist.internal.type'
  | 'artist.name'
  | 'artist.mbid'
  | 'artist.url'
  | 'artist.image'
  | 'artist.image.size'
  | 'artist.image.text'
  | 'artist.playbacks'
  | 'artist.playbacks.id'
  | 'artist.playbacks.parent.id'
  | 'artist.playbacks.parent.children'
  | 'artist.playbacks.children'
  | 'artist.playbacks.children.id'
  | 'artist.playbacks.children.children'
  | 'artist.playbacks.internal.content'
  | 'artist.playbacks.internal.contentDigest'
  | 'artist.playbacks.internal.description'
  | 'artist.playbacks.internal.fieldOwners'
  | 'artist.playbacks.internal.ignoreType'
  | 'artist.playbacks.internal.mediaType'
  | 'artist.playbacks.internal.owner'
  | 'artist.playbacks.internal.type'
  | 'artist.playbacks.date'
  | 'artist.playbacks.track.id'
  | 'artist.playbacks.track.children'
  | 'artist.playbacks.track.name'
  | 'artist.playbacks.track.loved'
  | 'artist.playbacks.track.mbid'
  | 'artist.playbacks.track.streamable'
  | 'artist.playbacks.track.url'
  | 'artist.playbacks.track.image'
  | 'artist.playbacks.track.playbacks'
  | 'artist.albums'
  | 'artist.albums.id'
  | 'artist.albums.parent.id'
  | 'artist.albums.parent.children'
  | 'artist.albums.children'
  | 'artist.albums.children.id'
  | 'artist.albums.children.children'
  | 'artist.albums.internal.content'
  | 'artist.albums.internal.contentDigest'
  | 'artist.albums.internal.description'
  | 'artist.albums.internal.fieldOwners'
  | 'artist.albums.internal.ignoreType'
  | 'artist.albums.internal.mediaType'
  | 'artist.albums.internal.owner'
  | 'artist.albums.internal.type'
  | 'artist.albums.name'
  | 'artist.albums.mbid'
  | 'artist.albums.url'
  | 'artist.albums.playbacks'
  | 'artist.albums.playbacks.id'
  | 'artist.albums.playbacks.children'
  | 'artist.albums.playbacks.date'
  | 'artist.albums.artist.id'
  | 'artist.albums.artist.children'
  | 'artist.albums.artist.name'
  | 'artist.albums.artist.mbid'
  | 'artist.albums.artist.url'
  | 'artist.albums.artist.image'
  | 'artist.albums.artist.playbacks'
  | 'artist.albums.artist.albums'
  | 'artist.albums.artist.tracks'
  | 'artist.albums.tracks'
  | 'artist.albums.tracks.id'
  | 'artist.albums.tracks.children'
  | 'artist.albums.tracks.name'
  | 'artist.albums.tracks.loved'
  | 'artist.albums.tracks.mbid'
  | 'artist.albums.tracks.streamable'
  | 'artist.albums.tracks.url'
  | 'artist.albums.tracks.image'
  | 'artist.albums.tracks.playbacks'
  | 'artist.tracks'
  | 'artist.tracks.id'
  | 'artist.tracks.parent.id'
  | 'artist.tracks.parent.children'
  | 'artist.tracks.children'
  | 'artist.tracks.children.id'
  | 'artist.tracks.children.children'
  | 'artist.tracks.internal.content'
  | 'artist.tracks.internal.contentDigest'
  | 'artist.tracks.internal.description'
  | 'artist.tracks.internal.fieldOwners'
  | 'artist.tracks.internal.ignoreType'
  | 'artist.tracks.internal.mediaType'
  | 'artist.tracks.internal.owner'
  | 'artist.tracks.internal.type'
  | 'artist.tracks.name'
  | 'artist.tracks.loved'
  | 'artist.tracks.mbid'
  | 'artist.tracks.streamable'
  | 'artist.tracks.url'
  | 'artist.tracks.image'
  | 'artist.tracks.image.size'
  | 'artist.tracks.image.text'
  | 'artist.tracks.playbacks'
  | 'artist.tracks.playbacks.id'
  | 'artist.tracks.playbacks.children'
  | 'artist.tracks.playbacks.date'
  | 'artist.tracks.artist.id'
  | 'artist.tracks.artist.children'
  | 'artist.tracks.artist.name'
  | 'artist.tracks.artist.mbid'
  | 'artist.tracks.artist.url'
  | 'artist.tracks.artist.image'
  | 'artist.tracks.artist.playbacks'
  | 'artist.tracks.artist.albums'
  | 'artist.tracks.artist.tracks'
  | 'artist.tracks.album.id'
  | 'artist.tracks.album.children'
  | 'artist.tracks.album.name'
  | 'artist.tracks.album.mbid'
  | 'artist.tracks.album.url'
  | 'artist.tracks.album.playbacks'
  | 'artist.tracks.album.tracks'
  | 'tracks'
  | 'tracks.id'
  | 'tracks.parent.id'
  | 'tracks.parent.parent.id'
  | 'tracks.parent.parent.children'
  | 'tracks.parent.children'
  | 'tracks.parent.children.id'
  | 'tracks.parent.children.children'
  | 'tracks.parent.internal.content'
  | 'tracks.parent.internal.contentDigest'
  | 'tracks.parent.internal.description'
  | 'tracks.parent.internal.fieldOwners'
  | 'tracks.parent.internal.ignoreType'
  | 'tracks.parent.internal.mediaType'
  | 'tracks.parent.internal.owner'
  | 'tracks.parent.internal.type'
  | 'tracks.children'
  | 'tracks.children.id'
  | 'tracks.children.parent.id'
  | 'tracks.children.parent.children'
  | 'tracks.children.children'
  | 'tracks.children.children.id'
  | 'tracks.children.children.children'
  | 'tracks.children.internal.content'
  | 'tracks.children.internal.contentDigest'
  | 'tracks.children.internal.description'
  | 'tracks.children.internal.fieldOwners'
  | 'tracks.children.internal.ignoreType'
  | 'tracks.children.internal.mediaType'
  | 'tracks.children.internal.owner'
  | 'tracks.children.internal.type'
  | 'tracks.internal.content'
  | 'tracks.internal.contentDigest'
  | 'tracks.internal.description'
  | 'tracks.internal.fieldOwners'
  | 'tracks.internal.ignoreType'
  | 'tracks.internal.mediaType'
  | 'tracks.internal.owner'
  | 'tracks.internal.type'
  | 'tracks.name'
  | 'tracks.loved'
  | 'tracks.mbid'
  | 'tracks.streamable'
  | 'tracks.url'
  | 'tracks.image'
  | 'tracks.image.size'
  | 'tracks.image.text'
  | 'tracks.playbacks'
  | 'tracks.playbacks.id'
  | 'tracks.playbacks.parent.id'
  | 'tracks.playbacks.parent.children'
  | 'tracks.playbacks.children'
  | 'tracks.playbacks.children.id'
  | 'tracks.playbacks.children.children'
  | 'tracks.playbacks.internal.content'
  | 'tracks.playbacks.internal.contentDigest'
  | 'tracks.playbacks.internal.description'
  | 'tracks.playbacks.internal.fieldOwners'
  | 'tracks.playbacks.internal.ignoreType'
  | 'tracks.playbacks.internal.mediaType'
  | 'tracks.playbacks.internal.owner'
  | 'tracks.playbacks.internal.type'
  | 'tracks.playbacks.date'
  | 'tracks.playbacks.track.id'
  | 'tracks.playbacks.track.children'
  | 'tracks.playbacks.track.name'
  | 'tracks.playbacks.track.loved'
  | 'tracks.playbacks.track.mbid'
  | 'tracks.playbacks.track.streamable'
  | 'tracks.playbacks.track.url'
  | 'tracks.playbacks.track.image'
  | 'tracks.playbacks.track.playbacks'
  | 'tracks.artist.id'
  | 'tracks.artist.parent.id'
  | 'tracks.artist.parent.children'
  | 'tracks.artist.children'
  | 'tracks.artist.children.id'
  | 'tracks.artist.children.children'
  | 'tracks.artist.internal.content'
  | 'tracks.artist.internal.contentDigest'
  | 'tracks.artist.internal.description'
  | 'tracks.artist.internal.fieldOwners'
  | 'tracks.artist.internal.ignoreType'
  | 'tracks.artist.internal.mediaType'
  | 'tracks.artist.internal.owner'
  | 'tracks.artist.internal.type'
  | 'tracks.artist.name'
  | 'tracks.artist.mbid'
  | 'tracks.artist.url'
  | 'tracks.artist.image'
  | 'tracks.artist.image.size'
  | 'tracks.artist.image.text'
  | 'tracks.artist.playbacks'
  | 'tracks.artist.playbacks.id'
  | 'tracks.artist.playbacks.children'
  | 'tracks.artist.playbacks.date'
  | 'tracks.artist.albums'
  | 'tracks.artist.albums.id'
  | 'tracks.artist.albums.children'
  | 'tracks.artist.albums.name'
  | 'tracks.artist.albums.mbid'
  | 'tracks.artist.albums.url'
  | 'tracks.artist.albums.playbacks'
  | 'tracks.artist.albums.tracks'
  | 'tracks.artist.tracks'
  | 'tracks.artist.tracks.id'
  | 'tracks.artist.tracks.children'
  | 'tracks.artist.tracks.name'
  | 'tracks.artist.tracks.loved'
  | 'tracks.artist.tracks.mbid'
  | 'tracks.artist.tracks.streamable'
  | 'tracks.artist.tracks.url'
  | 'tracks.artist.tracks.image'
  | 'tracks.artist.tracks.playbacks'
  | 'tracks.album.id'
  | 'tracks.album.parent.id'
  | 'tracks.album.parent.children'
  | 'tracks.album.children'
  | 'tracks.album.children.id'
  | 'tracks.album.children.children'
  | 'tracks.album.internal.content'
  | 'tracks.album.internal.contentDigest'
  | 'tracks.album.internal.description'
  | 'tracks.album.internal.fieldOwners'
  | 'tracks.album.internal.ignoreType'
  | 'tracks.album.internal.mediaType'
  | 'tracks.album.internal.owner'
  | 'tracks.album.internal.type'
  | 'tracks.album.name'
  | 'tracks.album.mbid'
  | 'tracks.album.url'
  | 'tracks.album.playbacks'
  | 'tracks.album.playbacks.id'
  | 'tracks.album.playbacks.children'
  | 'tracks.album.playbacks.date'
  | 'tracks.album.artist.id'
  | 'tracks.album.artist.children'
  | 'tracks.album.artist.name'
  | 'tracks.album.artist.mbid'
  | 'tracks.album.artist.url'
  | 'tracks.album.artist.image'
  | 'tracks.album.artist.playbacks'
  | 'tracks.album.artist.albums'
  | 'tracks.album.artist.tracks'
  | 'tracks.album.tracks'
  | 'tracks.album.tracks.id'
  | 'tracks.album.tracks.children'
  | 'tracks.album.tracks.name'
  | 'tracks.album.tracks.loved'
  | 'tracks.album.tracks.mbid'
  | 'tracks.album.tracks.streamable'
  | 'tracks.album.tracks.url'
  | 'tracks.album.tracks.image'
  | 'tracks.album.tracks.playbacks';

type LastfmAlbumGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<LastfmAlbumEdge>;
  readonly nodes: ReadonlyArray<LastfmAlbum>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly max: Maybe<Scalars['Float']>;
  readonly min: Maybe<Scalars['Float']>;
  readonly sum: Maybe<Scalars['Float']>;
  readonly group: ReadonlyArray<LastfmAlbumGroupConnection>;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};


type LastfmAlbumGroupConnection_distinctArgs = {
  field: LastfmAlbumFieldsEnum;
};


type LastfmAlbumGroupConnection_maxArgs = {
  field: LastfmAlbumFieldsEnum;
};


type LastfmAlbumGroupConnection_minArgs = {
  field: LastfmAlbumFieldsEnum;
};


type LastfmAlbumGroupConnection_sumArgs = {
  field: LastfmAlbumFieldsEnum;
};


type LastfmAlbumGroupConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: LastfmAlbumFieldsEnum;
};

type LastfmAlbumSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<LastfmAlbumFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type UseFeelingsQueryVariables = Exact<{ [key: string]: never; }>;


type UseFeelingsQuery = { readonly allFeelings: { readonly feelings: ReadonlyArray<Pick<feelings, 'time' | 'mood' | 'activities' | 'notes'>> } };

type UseFeelingsChartDataQueryVariables = Exact<{ [key: string]: never; }>;


type UseFeelingsChartDataQuery = { readonly allFeelings: { readonly data: ReadonlyArray<Pick<feelings, 'time' | 'mood'>> } };

type UseLatestFeelingsQueryVariables = Exact<{ [key: string]: never; }>;


type UseLatestFeelingsQuery = { readonly feelings: Maybe<Pick<feelings, 'time' | 'mood' | 'activities' | 'notes'>> };

type LastFmQueryVariables = Exact<{ [key: string]: never; }>;


type LastFmQuery = { readonly cover: Maybe<{ readonly image: Maybe<{ readonly childImageSharp: Maybe<Pick<ImageSharp, 'gatsbyImageData'>> }> }>, readonly playback: { readonly scrobbles: ReadonlyArray<(
      Pick<LastfmPlayback, 'date'>
      & { readonly track: Maybe<{ readonly album: Maybe<Pick<LastfmAlbum, 'name'>>, readonly artist: Maybe<Pick<LastfmArtist, 'name'>> }> }
    )> } };

type UseGoodreadsShelvesQueryVariables = Exact<{ [key: string]: never; }>;


type UseGoodreadsShelvesQuery = { readonly currentlyReading: { readonly books: ReadonlyArray<(
      Pick<GoodreadsBook, 'title' | 'author' | 'isbn' | 'url' | 'started'>
      & { readonly coverImage: Maybe<{ readonly childImageSharp: Maybe<Pick<ImageSharp, 'gatsbyImageData'>> }> }
    )> }, readonly recentlyFinished: { readonly books: ReadonlyArray<(
      Pick<GoodreadsBook, 'finished' | 'title' | 'author' | 'isbn' | 'url' | 'started'>
      & { readonly coverImage: Maybe<{ readonly childImageSharp: Maybe<Pick<ImageSharp, 'gatsbyImageData'>> }> }
    )> } };

type BlogListingQueryVariables = Exact<{ [key: string]: never; }>;


type BlogListingQuery = { readonly allMdx: { readonly edges: ReadonlyArray<{ readonly node: (
        Pick<Mdx, 'excerpt' | 'timeToRead'>
        & { readonly fields: Maybe<(
          Pick<MdxFields, 'slug' | 'date'>
          & { readonly latestCommit: Maybe<Pick<MdxFieldsLatestCommit, 'date'>> }
        )>, readonly frontmatter: Maybe<(
          Pick<MdxFrontmatter, 'title' | 'date' | 'description' | 'tags'>
          & { readonly cover: Maybe<Pick<File, 'publicURL'>> }
        )> }
      ) }> } };

type BlogPostBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


type BlogPostBySlugQuery = { readonly mdx: Maybe<(
    Pick<Mdx, 'timeToRead' | 'excerpt' | 'collection' | 'body'>
    & { readonly frontmatter: Maybe<(
      Pick<MdxFrontmatter, 'title' | 'date' | 'tags' | 'description'>
      & { readonly cover: Maybe<Pick<File, 'publicURL'>> }
    )>, readonly fields: Maybe<(
      Pick<MdxFields, 'slug' | 'date'>
      & { readonly latestCommit: Maybe<Pick<MdxFieldsLatestCommit, 'date'>> }
    )> }
  )> };

type TalkBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


type TalkBySlugQuery = { readonly mdx: Maybe<(
    Pick<Mdx, 'timeToRead' | 'excerpt' | 'collection' | 'body'>
    & { readonly frontmatter: Maybe<(
      Pick<MdxFrontmatter, 'title' | 'date' | 'tags' | 'description' | 'location'>
      & { readonly cover: Maybe<Pick<File, 'publicURL'>> }
    )>, readonly fields: Maybe<(
      Pick<MdxFields, 'slug' | 'date'>
      & { readonly latestCommit: Maybe<Pick<MdxFieldsLatestCommit, 'date'>> }
    )> }
  )> };

type TalkListingQueryVariables = Exact<{ [key: string]: never; }>;


type TalkListingQuery = { readonly allMdx: { readonly edges: ReadonlyArray<{ readonly node: (
        Pick<Mdx, 'excerpt' | 'timeToRead'>
        & { readonly fields: Maybe<(
          Pick<MdxFields, 'slug' | 'date'>
          & { readonly latestCommit: Maybe<Pick<MdxFieldsLatestCommit, 'date'>> }
        )>, readonly frontmatter: Maybe<Pick<MdxFrontmatter, 'title' | 'tags' | 'date' | 'description'>> }
      ) }> } };

type GatsbyImageSharpFixedFragment = Pick<ImageSharpFixed, 'base64' | 'width' | 'height' | 'src' | 'srcSet'>;

type GatsbyImageSharpFixed_tracedSVGFragment = Pick<ImageSharpFixed, 'tracedSVG' | 'width' | 'height' | 'src' | 'srcSet'>;

type GatsbyImageSharpFixed_withWebpFragment = Pick<ImageSharpFixed, 'base64' | 'width' | 'height' | 'src' | 'srcSet' | 'srcWebp' | 'srcSetWebp'>;

type GatsbyImageSharpFixed_withWebp_tracedSVGFragment = Pick<ImageSharpFixed, 'tracedSVG' | 'width' | 'height' | 'src' | 'srcSet' | 'srcWebp' | 'srcSetWebp'>;

type GatsbyImageSharpFixed_noBase64Fragment = Pick<ImageSharpFixed, 'width' | 'height' | 'src' | 'srcSet'>;

type GatsbyImageSharpFixed_withWebp_noBase64Fragment = Pick<ImageSharpFixed, 'width' | 'height' | 'src' | 'srcSet' | 'srcWebp' | 'srcSetWebp'>;

type GatsbyImageSharpFluidFragment = Pick<ImageSharpFluid, 'base64' | 'aspectRatio' | 'src' | 'srcSet' | 'sizes'>;

type GatsbyImageSharpFluidLimitPresentationSizeFragment = { maxHeight: ImageSharpFluid['presentationHeight'], maxWidth: ImageSharpFluid['presentationWidth'] };

type GatsbyImageSharpFluid_tracedSVGFragment = Pick<ImageSharpFluid, 'tracedSVG' | 'aspectRatio' | 'src' | 'srcSet' | 'sizes'>;

type GatsbyImageSharpFluid_withWebpFragment = Pick<ImageSharpFluid, 'base64' | 'aspectRatio' | 'src' | 'srcSet' | 'srcWebp' | 'srcSetWebp' | 'sizes'>;

type GatsbyImageSharpFluid_withWebp_tracedSVGFragment = Pick<ImageSharpFluid, 'tracedSVG' | 'aspectRatio' | 'src' | 'srcSet' | 'srcWebp' | 'srcSetWebp' | 'sizes'>;

type GatsbyImageSharpFluid_noBase64Fragment = Pick<ImageSharpFluid, 'aspectRatio' | 'src' | 'srcSet' | 'sizes'>;

type GatsbyImageSharpFluid_withWebp_noBase64Fragment = Pick<ImageSharpFluid, 'aspectRatio' | 'src' | 'srcSet' | 'srcWebp' | 'srcSetWebp' | 'sizes'>;

type PagesQueryQueryVariables = Exact<{ [key: string]: never; }>;


type PagesQueryQuery = { readonly allSiteFunction: { readonly nodes: ReadonlyArray<Pick<SiteFunction, 'functionRoute'>> }, readonly allSitePage: { readonly nodes: ReadonlyArray<Pick<SitePage, 'path'>> } };

}