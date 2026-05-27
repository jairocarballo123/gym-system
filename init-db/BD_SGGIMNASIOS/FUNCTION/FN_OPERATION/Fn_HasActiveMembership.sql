USE [DB_GYM_ENTERPRISE];
GO

CREATE OR ALTER FUNCTION GYM_OPERATIONS.Fn_HasActiveMembership
(
    @MemberId INT
)
RETURNS BIT
AS
BEGIN
    DECLARE @HasAccess BIT = 0;

    -- Revisamos si el cliente tiene alguna membresía donde HOY esté entre su fecha de inicio y fin
    IF EXISTS (
        SELECT 1 
        FROM GYM_OPERATIONS.Tbl_Memberships
        WHERE MemberId = @MemberId
          AND StatusId = 1
          AND GETDATE() BETWEEN StartDate AND EndDate
    )
    BEGIN
        SET @HasAccess = 1; -- ¡Luz Verde!
    END

    RETURN @HasAccess;
END;
GO