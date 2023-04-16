import { readLines } from "https://deno.land/std@0.166.0/io/mod.ts";

const articles: {
  url: string;
  title: string;
}[] = [];

let temp_article: {
  url?: string;
  title?: string;
} = {};
let in_title = false;
for await (const line of readLines(Deno.stdin)) {
  if (line.startsWith("arXiv:")) {
    temp_article.url = `https://arxiv.org/abs/${
      (line.match(/\d{4}\.\d{5}/) ?? [])[0]
    }`;
  }
  if (in_title && !line.startsWith("Authors:")) {
    temp_article.title += line;
  }
  if (line.startsWith("Title:")) {
    in_title = true;
    temp_article.title = (line.match(/Title: (.*)$/) ?? [])[1];
  }
  if (line.startsWith("Authors:")) {
    in_title = false;
    const { url, title } = temp_article;
    if (!url || !title) {
      continue;
    }
    articles.push({
      url,
      title,
    });
    temp_article = {};
  }
}

articles.forEach(({ url, title }) => {
  console.log(`URL: ${url}`);
  console.log(`Title: ${title}`);
  console.log("");
});
