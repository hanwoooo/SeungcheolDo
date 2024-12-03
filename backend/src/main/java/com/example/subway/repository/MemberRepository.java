package com.example.subway.repository;

import com.example.subway.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<MemberEntity, Long> {
    // select * from member_table where member_email=?)
    Optional<MemberEntity> findByMemberEmail(String memberEmail);

    Optional<MemberEntity> findById(Long memberId);
}
