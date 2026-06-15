package com.cod8flow.cod8flow.repository;

import com.cod8flow.cod8flow.domain.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BoardRepository extends JpaRepository<Board, UUID> {

    List<Board> findByWorkspaceId(UUID workspaceId);
}