package gatech.cs6400.team12.jauntyjalopies.common;

public enum ErrorCode implements IErrorCode{
    UNABLE_TO_CONNECT(400),
    CUSTOMER_ADDITION_ERROR(1000),
    CUSTOMER_NOT_FOUND(1100),
    USER_INVALID_CREDENTIAL(2000),
    VEHICLE_ADDITION_ERROR(3000),
    VEHICLE_TYPE_UNSUPPORTED(3100),
    VEHICLE_NOT_FOUND(3200),
    VEHICLE_SALE_FAILURE(3300),
    REPAIR_UPDATE_LABOR_CHARGE_FAILURE(4000),
    REPAIR_CLOSE_FAILURE(4100),
    REPAIR_INSERT_FAILURE(4200),
    REPAIR_CHANGE_QUANTITY(4300),
    ADD_PART_FAILURE(4400),
    INVALID_MANUFACTURER(5000),
    REPORT_NOT_FETCHED(6000),
    UNKNOWN_ERROR(500),
    DATABASE_ERROR(10000);

    private Integer errorCode;

    ErrorCode(Integer errorCode) {
        this.errorCode = errorCode;
    }

    @Override
    public Integer getErrorCode() {
        return errorCode;
    }

}
