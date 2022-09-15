const { JSDOM } = require("jsdom");
const EleventyFetch = require("@11ty/eleventy-fetch");
const Image = require("@11ty/eleventy-img");
const retry = require("async-retry");
const trim = require("lodash/trim");

const getShelf = async (userID, shelf, limit) => {
  const params = new URLSearchParams({
    ref: "nav_mybooks",
    shelf,
    per_page: 100,
  });
  const goodreadsHTML = await retry(
    async () =>
      EleventyFetch(
        `https://www.goodreads.com/review/list/${userID}?${params.toString()}`,
        {
          duration: "12h",
          type: "text",
        }
      ),
    {
      retries: 5,
    }
  );

  const { document: goodreadsDocument } = new JSDOM(goodreadsHTML).window;

  const books = await Promise.all(
    Array.from(goodreadsDocument.querySelectorAll("#booksBody .bookalike"))
      .map(async (row) => {
        const thumbnail = row
          ?.querySelector("td.field.cover img")
          ?.getAttribute("src");
        // Get the full sized thumbnail
        const cover = thumbnail?.replace(/\._\w+\d+_/, "");

        const urlPath = row
          ?.querySelector("td.field.cover a")
          ?.getAttribute("href");

        if (!cover || !urlPath) {
          return null;
        }

        const image = await Image(cover, {
          widths: [200],
          urlPath: "/img/goodreads/",
          outputDir: "./_site/img/goodreads/",
          cacheOptions: {
            duration: "1y",
          },
        });

        const author = customTrim(
          row?.querySelector("td.field.author .value")?.textContent
        )
          ?.split(", ")
          .reverse()
          .join(" ");

        return {
          title: customTrim(
            row?.querySelector("td.field.title a")?.getAttribute("title")
          ),
          author,
          isbn: customTrim(
            row?.querySelector("td.field.isbn .value")?.textContent
          ),
          isbn13: customTrim(
            row?.querySelector("td.field.isbn13 .value")?.textContent
          ),
          asin: customTrim(
            row?.querySelector("td.field.asin .value")?.textContent
          ),
          pages: parseInt(
            customTrim(
              row?.querySelector("td.field.num_pages .value")?.textContent
            ) || "0"
          ),
          published: getDateField(row, "td.field.date_pub .value"),
          started: getDateField(
            row,
            "td.field.date_started .date_started_value"
          ),
          finished: getDateField(row, "td.field.date_read .date_read_value"),
          cover: image,
          url: urlPath ? `https://www.goodreads.com${urlPath}` : null,
        };
      })
      .filter((book) => !!book)
      .slice(0, limit)
  );

  return books;
};

const trimChars = "\n *";

const getDateField = (row, selector) => {
  const rawDate = row.querySelector(selector)?.textContent;

  if (rawDate && !rawDate.includes("unknown")) {
    return new Date(trim(rawDate, trimChars)).toISOString();
  }

  return new Date("2000-01-01").toISOString();
};

const customTrim = (value) => (value ? trim(value, trimChars) : null);

module.exports = async function () {
  const userID = "29665939";
  const shelves = {
    currentlyReading: await getShelf(userID, "currently-reading", 1),
    read: await getShelf(userID, "read", 11),
  };

  return shelves;
};
