package com.example.subway.entity;

import com.example.subway.dto.MemberDto;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "members")
public class MemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String memberName;

    @Column(unique = true)
    private String memberEmail;

    @Column
    private String memberPassword;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "member_id")  // 외래 키 설정
    private List<FavoriteEntity> favorites = new ArrayList<>();

    public static MemberEntity toMemberEntity(MemberDto memberDTO) {
        MemberEntity memberEntity = new MemberEntity();
        memberEntity.setMemberEmail(memberDTO.getMemberEmail());
        memberEntity.setMemberPassword(memberDTO.getMemberPassword());
        return memberEntity;
    }
}
