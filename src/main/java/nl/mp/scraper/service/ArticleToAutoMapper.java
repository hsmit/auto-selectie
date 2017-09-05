package nl.mp.scraper.service;

import nl.mp.scraper.domain.Auto;
import org.jsoup.nodes.Element;

/**
 * Created by hanness on 5-9-2017.
 */
public class ArticleToAutoMapper {
    public static Auto mapToAuto(Element article) {
        Auto auto = new Auto();
        auto.setNaam(article.select("span.mp-listing-title[title]").first().attr("title"));
        auto.setUrl(article.select("h2.heading > a[href]").first().attr("href"));
        auto.setPrijs(article.select("span.price-new").first().text());
        auto.setBouwjaar(article.select("div.listing-priority-product-container").select("span").first().text());
        auto.setKm(article.select("div.listing-priority-product-container").select("span").get(1).text());
        return auto;
    }
}
