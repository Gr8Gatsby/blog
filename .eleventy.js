const Image = require("@11ty/eleventy-img");
const isProduction = process.env.ELEVENTY_ENV === "production";

module.exports = function(eleventyConfig) {
  // Image optimization filter
  eleventyConfig.addNunjucksAsyncShortcode("responsiveImage", async (src, alt) => {
    let metadata = await Image(src, {
      widths: [600, 1024], // Mobile (600px) and Desktop (1024px)
      formats: ["jpeg", "webp"], // Generate both JPEG and WebP formats
      urlPath: "/images/", // The path for the images on the website
      outputDir: "./docs/images/" // Output directory for the optimized images
    });

    let lowsrc = metadata.jpeg[0]; // Mobile version (600px)
    let highsrc = metadata.jpeg[1]; // Desktop version (1024px)

    // Returning the HTML for <picture> element for responsive images
    return `<picture>
      <source type="image/webp" srcset="${metadata.webp[1].url}" media="(min-width: 1024px)">
      <source type="image/webp" srcset="${metadata.webp[0].url}" media="(max-width: 1024px)">
      <source type="image/jpeg" srcset="${highsrc.url}" media="(min-width: 1024px)">
      <source type="image/jpeg" srcset="${lowsrc.url}" media="(max-width: 1024px)">
      <img src="${lowsrc.url}" alt="${alt}" loading="lazy" decoding="async" width="${lowsrc.width}" height="${lowsrc.height}">
    </picture>`;
  });
  // Define a collection for blog posts and exclude `index.md`
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").filter(function(item) {
      // Exclude the `index.md` file from the collection
      return !item.inputPath.includes("index.md");
    });
  });

  // Copy `src/css` to `docs/css`
  eleventyConfig.addPassthroughCopy("src/css");

  // Copy `src/images` to `docs/images`
  eleventyConfig.addPassthroughCopy("src/images");

  return {
    pathPrefix: isProduction ? "/blog/" : "/",
    dir: {
      input: "src", // Folder where your content lives
      output: "docs", // GitHub Pages will use this folder for serving
      includes: "_includes", // Optional: for layouts, partials, etc.
      layouts: "_layouts" // Optional: for reusable layouts
    },
    eleventyComputed: {
      year: () => new Date().getFullYear() // Dynamically compute the current year
    }
  };
};