create policy "creator delete comments" on community_comments
  for delete using (
    community_book_id in (
      select cb.id from community_books cb
      join communities c on c.id = cb.community_id
      where c.creator_id = auth.uid()
    )
  );
