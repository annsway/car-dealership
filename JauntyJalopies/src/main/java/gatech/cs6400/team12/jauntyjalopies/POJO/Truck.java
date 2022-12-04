package gatech.cs6400.team12.jauntyjalopies.POJO;

import lombok.Data;

@Data
public class Truck {
    private String vin;
    private Integer cargoCapacity;
    private String cargoCoverType;
    private Integer numOfRearAxies;
}
