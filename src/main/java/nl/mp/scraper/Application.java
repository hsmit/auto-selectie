package nl.mp.scraper;

import java.io.IOException;

public class Application {
    public static void main(String[] args) throws IOException {
        MPScraper scraper = new MPScraper();
        scraper.scrape();
    }
}
