package nl.mp.scraper;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class MPRequest {
    private String priceFrom;
    private int yearTo;
    private String mileageFrom;
    private String mileageTo;
    private int categoryId;
    private List<String> attributes = new ArrayList<>();

    static Map<String, String> attributesMap = new HashMap();

    public MPRequest() {

        attributesMap.put("M,11554", "elektrische-ramen");
        attributesMap.put("M,11553", "airconditioning");
        attributesMap.put("M,11548", "abs");
        attributesMap.put("S,10882", "vraagprijs");
        attributesMap.put("S,535", "handgeschakeld");
        attributesMap.put("S,484", "stationwagon");
        attributesMap.put("S,474", "diesel");
        attributesMap.put("N,189", "15-20-km-l");
        attributesMap.put("N,190", "20-25-km-l");
        attributesMap.put("N,180", "101-125-pk");
        attributesMap.put("N,181", "126-150-pk");
        attributesMap.put("N,176", "4-t-m-5");
        attributesMap.put("N,172", "4-t-m-5");
        attributesMap.put("N,73", "1-4-2-0-liter");
    }


    public String getPriceFrom() {
        return priceFrom;
    }

    public void setPriceFrom(String priceFrom) {
        this.priceFrom = priceFrom;
    }

    public int getYearTo() {
        return yearTo;
    }

    public void setYearTo(int yearTo) {
        this.yearTo = yearTo;
    }

    public String getMileageFrom() {
        return mileageFrom;
    }

    public void setMileageFrom(String mileageFrom) {
        this.mileageFrom = mileageFrom;
    }

    public String getMileageTo() {
        return mileageTo;
    }

    public void setMileageTo(String mileageTo) {
        this.mileageTo = mileageTo;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }


    public List<String> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<String> attributes) {
        this.attributes = attributes;
    }

    public void addAttributes(String... attributes) {
        for (String newAttr : attributes) {
            this.attributes.add(newAttr);
        }
    }


    public String buildQuery() {
        return attributesAsText() +
                ".html?categoryId=" + categoryId +
                "&attributes=" + attributesEncoded() +
                "&priceFrom=" + priceFrom + "%2C00" +
                "&yearTo=" + yearTo +
                "&mileageFrom=" + mileageFrom +
                "&mileageTo=" + mileageTo +
                "";
    }

    private String attributesEncoded() {
        return attributes.stream().map(a -> {
            try {
                return URLEncoder.encode(a, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
                return "";
            }
        }).collect(Collectors.joining( "+" ));
    }

    private String attributesAsText() {
        return String.join("-", attributes.stream().map(x -> attributesMap.get(x)).collect(Collectors.toList()));
    }

}
