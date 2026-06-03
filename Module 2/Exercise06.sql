SELECT
    event_id,
    SUM(CASE WHEN resource_type = 'PDF' THEN 1 ELSE 0 END) AS pdf_count,
    SUM(CASE WHEN resource_type = 'Image' THEN 1 ELSE 0 END) AS image_count,
    SUM(CASE WHEN resource_type = 'Link' THEN 1 ELSE 0 END) AS link_count
FROM Resources
GROUP BY event_id
ORDER BY event_id;