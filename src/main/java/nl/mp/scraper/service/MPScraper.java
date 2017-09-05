package nl.mp.scraper.service;

import nl.mp.scraper.domain.Auto;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static nl.mp.scraper.domain.Constants.SITE;

public class MPScraper {

    public Document getDocument(String uri) {
        Document doc;
        try {
            doc = Jsoup.connect(uri).userAgent("Mozilla/5.0")
                    .timeout(30000)
                    .get();
        } catch (IOException e) {
            throw new RuntimeException();
        }
        return doc;
    }

    /**
     *
     * @param page starting at 1
     * @return
     */
    private String makeUri(int page) {
        MPRequest mpRequest = new MPRequest();
        mpRequest.setCategoryId(91);
        mpRequest.setPriceFrom("1.000");
        mpRequest.setYearTo(2013);
        mpRequest.setMileageFrom("99.000");
        mpRequest.setMileageTo("200.000");
        mpRequest.addAttributes("M,11554", "M,11553", "M,11548", "S,10882", "S,535", "S,484", "S,474", "N,190", "N,189", "N,181", "N,180", "N,176", "N,172", "N,73");

        return urlBuild(mpRequest, page, "attribute_mileage");
    }

    public  String urlBuild(MPRequest mpRequest, int currentPage, String sortBy) {
        return SITE + "/z/auto-s/" + mpRequest.buildQuery()  + "&sortBy=" + sortBy + "&currentPage=" + currentPage;
    }

    public int countPages(Document document) {
        Elements pagination = document.select("span#pagination-pages");
        if (pagination == null || pagination.size() == 0) {
            return 1;
        }
        return Integer.parseInt(pagination.select("span.step-over").last().text());
    }

    public void scrape()  {
        System.out.println("start");
        List<Auto> allAutos = new ArrayList<>();

        String firstPage = makeUri(1);

        Document firstDocument = getDocument(firstPage);
        int pages = countPages(firstDocument);
        for(int i = 1; i < pages; i++) {
            String resultPage = makeUri(i);
            Document d = getDocument(resultPage);
            List<Auto> autos = getAutos(d);
            allAutos.addAll(autos);
        }
        writeToCsv(allAutos, new File("output/autos.csv"));
        System.out.println("done");
    }

    private List<Auto> getAutos(Document resultDocument) {
        return resultDocument.select("article.search-result")
                .stream()
                .map(ArticleToAutoMapper::mapToAuto)
                .collect(Collectors.toList());
    }

    private void writeToCsv(List<Auto> autos, File filename) {
        String headers = String.join(";", Arrays.asList("merk", "type", "naam", "prijs", "jaar", "km", "url" + "\n"));
        FileWriter fileWriter = null;
        try {
            fileWriter = new FileWriter(filename);
            fileWriter.append(headers);
            for (Auto a : autos) {
                String row = a.toString() + "\n";
                fileWriter.append(row);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            try {
                fileWriter.flush();
                fileWriter.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
