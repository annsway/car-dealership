SELECT 
uu.*
, case when sp.username is not null then 'Salesperson'
	when sw.username is not null then 'Service Writer' 
    when ic.username is not null then 'Inventory Clerk' 
	when m.username is not null then 'Manager' 
    end as user_Job
FROM LoginUser uu
LEFT JOIN Salesperson sp on uu.username = sp.username
left join ServiceWriter sw on uu.username = sw.username
left join InventoryClerk ic on uu.username = ic.username
left join Manager m on uu.username = m.username

order by user_job
;

select CURDATE FROM dual; 

select * from Vehicle v 
order by v.invoice_price desc
; 
SELECT * FROM Customer c;
SELECT * FROM Individual ic;
SELECT * FROM Business bc; 