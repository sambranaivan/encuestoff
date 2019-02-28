

encuestadores + encuestas
SELECT * FROM `encuestadores_carnaval` e left join carnavals c ON c.userid like CONCAT('%',e.codigo)