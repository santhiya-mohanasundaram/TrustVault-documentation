package com.trustvault.dto;

public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private long count;
    private String color;
    private String bgColor;
    private String icon;

    public CategoryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getBgColor() { return bgColor; }
    public void setBgColor(String bgColor) { this.bgColor = bgColor; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
