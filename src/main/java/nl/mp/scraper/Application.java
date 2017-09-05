package nl.mp.scraper;

import nl.mp.scraper.service.MPScraper;

import java.io.IOException;

public class Application {
    public static void main(String[] args) throws IOException {
        System.out.println("start");
        MPScraper scraper = new MPScraper();
        scraper.scrape("output/autos.csv");
        System.out.println("done");
    }
}
