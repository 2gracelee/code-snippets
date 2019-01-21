ALTER PROC [dbo].[Users_SelectAll_Paged]
@PageIndex int,
@PageSize int,
@SearchText NVARCHAR(50)

AS

/*
Users_SelectAll_Paged @PageIndex =0, @PageSize = 30, @SearchText = ''
*/

SELECT U.Id, FirstName, LastName, Email, RoleId, R.Name as Role, DepartmentId, D.Name as Department, PhoneNumber, ImageUrl, COUNT(*) OVER() as TotalCount

FROM Users as U
LEFT JOIN Department as D ON U.DepartmentId = D.Id
LEFT JOIN Roles as R On U.RoleId = R.Id

WHERE (FirstName LIKE '%' + @SearchText + '%')
OR (LastName LIKE '%' + @SearchText + '%')
OR (D.Name LIKE '%' + @SearchText + '%')
OR (R.Name LIKE '%' + @SearchText + '%')
ORDER BY LastName ASC
OFFSET (@PageIndex * @PageSize) ROWS FETCH NEXT @PageSize ROWS ONLY
