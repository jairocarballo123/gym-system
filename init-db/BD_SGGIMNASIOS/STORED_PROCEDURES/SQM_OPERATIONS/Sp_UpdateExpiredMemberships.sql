USE [DB_GYM_ENTERPRISE];
GO

CREATE OR ALTER PROCEDURE GYM_OPERATIONS.Sp_UpdateExpiredMemberships
    @ReferenceDate DATE = NULL 
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Today DATE = ISNULL(@ReferenceDate, CAST(GETDATE() AS DATE));

    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE GYM_OPERATIONS.Tbl_Memberships
        SET StatusId = 3  -- 3 = Vencido
        WHERE EndDate < @Today
          AND StatusId = 1;  -- Solo activas

   
        UPDATE m
        SET m.StatusId = 3 
        FROM GYM_OPERATIONS.Tbl_Members m
        WHERE m.StatusId = 1   
          AND NOT EXISTS (
              SELECT 1
              FROM GYM_OPERATIONS.Tbl_Memberships ms
              WHERE ms.MemberId = m.MemberId
                AND ms.StatusId = 1   -- Membresía activa
          );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO



 
