package nl.mp.scraper.domain;

import java.util.Arrays;

public class Auto {
    private String naam;
    private String km;
    private String prijs;
    private String bouwjaar;
    private String url;
    private String merk;
    private String type;
    private String SEPARATOR = ";";

    public String getNaam() {
        return naam;
    }

    public void setNaam(String naam) {
        String[] parts = naam.split(" ");
        if (parts.length > 1) {
            this.merk = parts[0];
            this.type = parts[1];
        }
        this.naam = naam;
    }

    public String getKm() {
        return km;
    }

    public void setKm(String km) {
        String k = km.replace(" km", "");
        k = k.replace(".", "");
        this.km = k;
    }

    public String getPrijs() {
        return prijs;
    }

    public void setPrijs(String prijs) {
        if (prijs.indexOf("€") != -1) {

            String p = prijs.replace("€ ", "");
            p = p.replace(".", "");
            p = p.substring(0, p.indexOf(","));
            this.prijs = p;
        } else {
            this.prijs = prijs;
        }
    }

    public String getBouwjaar() {
        return bouwjaar;
    }

    public void setBouwjaar(String bouwjaar) {
        this.bouwjaar = bouwjaar;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String toString() {
        return String.join(SEPARATOR, Arrays.asList(merk, type, naam, prijs, bouwjaar, km, url));
    }

}
